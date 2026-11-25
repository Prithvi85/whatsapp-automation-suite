/**
 * USD Payment Webhook & Order Tracker Service
 * Supports Merchant-of-Record webhooks (Lemon Squeezy, Dodo Payments, Paddle, or custom JSON)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const siteAuditService = require('./siteAuditService');
const leadStore = require('./leadStore');

const DATA_DIR = path.join(__dirname, '../../data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

class PaymentService {
  constructor() {
    this.orders = this._loadOrders();
  }

  _loadOrders() {
    try {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      console.error('[PaymentService] Failed to load orders:', err.message);
      return [];
    }
  }

  _saveOrders() {
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(this.orders.slice(0, 500), null, 2));
    } catch (err) {
      console.error('[PaymentService] Failed to save orders:', err.message);
    }
  }

  /**
   * Verify HMAC-SHA256 webhook signature when PAYMENT_WEBHOOK_SECRET is configured
   */
  verifySignature(rawBody, headers = {}) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) {
      return { verified: true, mode: 'unsigned-dev' };
    }

    const sigHeader =
      headers['x-signature'] ||
      headers['x-webhook-signature'] ||
      headers['webhook-signature'] ||
      '';

    if (!sigHeader) {
      return { verified: false, reason: 'Missing webhook signature header' };
    }

    const payloadBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody || ''), 'utf8');
    const expectedHex = crypto.createHmac('sha256', secret).update(payloadBuffer).digest('hex');

    // Support both raw hex ("abc123...") and prefixed ("sha256=abc123...")
    const providedHex = String(sigHeader).replace(/^sha256=/i, '').trim();

    if (providedHex.length !== expectedHex.length) {
      return { verified: false, reason: 'Invalid webhook signature length' };
    }

    const match = crypto.timingSafeEqual(Buffer.from(providedHex, 'utf8'), Buffer.from(expectedHex, 'utf8'));
    return match ? { verified: true, mode: 'hmac-sha256' } : { verified: false, reason: 'Webhook signature mismatch' };
  }

  /**
   * Normalize webhook payloads from Lemon Squeezy, Dodo Payments, Paddle, or direct JSON
   */
  normalizeWebhookPayload(body = {}) {
    // Lemon Squeezy format
    if (body.meta && body.data && body.data.attributes) {
      const attrs = body.data.attributes;
      const custom = body.meta.custom_data || {};
      const eventName = body.meta.event_name || 'order_created';
      const totalCents = Number(attrs.total || attrs.subtotal || 0);
      return {
        provider: 'lemonsqueezy',
        eventType: eventName,
        isPaidEvent: ['order_created', 'subscription_payment_success'].includes(eventName) && attrs.status !== 'refunded',
        externalOrderId: String(body.data.id || attrs.order_number || ''),
        auditId: custom.audit_id || '',
        leadId: custom.lead_id || '',
        customerName: attrs.user_name || '',
        customerEmail: attrs.user_email || '',
        currency: (attrs.currency || 'USD').toUpperCase(),
        amountUsd: totalCents > 0 ? Math.round((totalCents / 100) * 100) / 100 : Number(custom.amount_usd || 99),
        productName: attrs.first_order_item?.product_name || 'PS DigiLabs Fix Package'
      };
    }

    // Dodo Payments / Stripe-style or custom webhook format
    const dataObj = body.data || body;
    const metadata = dataObj.metadata || body.metadata || {};
    const eventType = body.type || body.event_type || body.event || 'payment.succeeded';
    const rawAmount = Number(dataObj.total_amount ?? dataObj.amount_usd ?? dataObj.amount ?? 99);
    // If provider sends cents (e.g., 9900 or 19900) alongside currency, normalize if clearly cents
    const amountUsd = dataObj.amount_usd !== undefined
      ? Number(dataObj.amount_usd)
      : (rawAmount >= 1000 && !String(rawAmount).includes('.') ? rawAmount / 100 : rawAmount);

    return {
      provider: body.provider || (body.business_id ? 'dodopayments' : 'custom'),
      eventType,
      isPaidEvent: /succeeded|paid|completed|order_created/i.test(eventType) || dataObj.status === 'succeeded' || dataObj.status === 'paid',
      externalOrderId: String(dataObj.payment_id || dataObj.order_id || dataObj.id || ''),
      auditId: metadata.audit_id || dataObj.audit_id || body.auditId || '',
      leadId: metadata.lead_id || dataObj.lead_id || body.leadId || '',
      customerName: dataObj.customer?.name || dataObj.customer_name || body.customerName || '',
      customerEmail: dataObj.customer?.email || dataObj.customer_email || body.customerEmail || '',
      currency: (dataObj.currency || body.currency || 'USD').toUpperCase(),
      amountUsd,
      productName: dataObj.product_name || metadata.tier_name || body.productName || 'PS DigiLabs Website Fix Package'
    };
  }

  /**
   * Process verified payment webhook, update audit & lead state, and build fulfillment package
   */
  processWebhook(body = {}) {
    const normalized = this.normalizeWebhookPayload(body);

    if (!normalized.isPaidEvent) {
      return {
        ignored: true,
        reason: `Event "${normalized.eventType}" is not a completed payment event.`
      };
    }

    // Deduplicate by externalOrderId if provided
    if (normalized.externalOrderId) {
      const existing = this.orders.find((o) => o.externalOrderId === normalized.externalOrderId);
      if (existing) {
        return { duplicate: true, order: existing };
      }
    }

    const orderId = 'ord_' + Date.now().toString(36) + '_' + crypto.randomBytes(3).toString('hex');
    const linkedAudit = normalized.auditId ? siteAuditService.markAuditPaid(normalized.auditId, {
      orderId,
      amountUsd: normalized.amountUsd
    }) : null;

    const linkedLead = leadStore.markLeadPaid({
      auditId: normalized.auditId,
      leadId: normalized.leadId,
      email: normalized.customerEmail,
      amountUsd: normalized.amountUsd,
      orderId
    });

    const fulfillment = {
      status: linkedAudit ? 'READY_FOR_DEPLOYMENT' : 'QUEUED_FOR_ONBOARDING',
      deliverables: linkedAudit
        ? [
            `SEO & Schema Quick-Fix HTML Patch for ${linkedAudit.domain}`,
            `Prioritized Fix Checklist (${linkedAudit.findings.filter((f) => f.severity !== 'pass').length} items)`,
            `Live Report Reference: ${linkedAudit.reportUrl}`
          ]
        : ['PS DigiLabs onboarding & website access request'],
      metaPatchHtml: linkedAudit?.quickFixes?.metaPatchHtml || ''
    };

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      provider: normalized.provider,
      eventType: normalized.eventType,
      externalOrderId: normalized.externalOrderId,
      auditId: normalized.auditId,
      domain: linkedAudit?.domain || '',
      leadId: linkedLead?.id || normalized.leadId || '',
      customerName: normalized.customerName || linkedAudit?.requester?.name || linkedLead?.customerName || 'Global Client',
      customerEmail: normalized.customerEmail || linkedAudit?.requester?.email || linkedLead?.email || '',
      productName: normalized.productName,
      currency: normalized.currency,
      amountUsd: normalized.amountUsd,
      status: 'PAID',
      fulfillment
    };

    this.orders.unshift(order);
    this._saveOrders();

    return { duplicate: false, order, linkedAudit, linkedLead };
  }

  getOrders(limit = 50) {
    return this.orders.slice(0, limit);
  }

  getRevenueStats() {
    const paidOrders = this.orders.filter((o) => o.status === 'PAID');
    const totalUsd = paidOrders.reduce((sum, o) => sum + (Number(o.amountUsd) || 0), 0);
    return {
      totalOrders: paidOrders.length,
      totalRevenueUsd: Math.round(totalUsd * 100) / 100,
      averageOrderUsd: paidOrders.length ? Math.round((totalUsd / paidOrders.length) * 100) / 100 : 0
    };
  }
}

module.exports = new PaymentService();
