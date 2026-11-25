/**
 * Tests for:
 * 1. USD Payment Webhook & Order Tracker (/api/payments/webhook, /api/payments/orders)
 * 2. Embeddable Audit Widget & Dashboard UI serving
 * 3. Daily Batch Prospect Auditor (scripts/daily-batch-audit.js)
 */

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = require('../server/index');
const siteAuditService = require('../server/services/siteAuditService');
const leadStore = require('../server/services/leadStore');
const { parseProspectsFile, runBatchAudit } = require('../scripts/daily-batch-audit');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Running Payment, Widget & Batch Audit Tests');
  console.log('====================================================\n');

  // Create an audit & matching lead first
  const audit = await siteAuditService.runAudit('https://pay-test.example.com', {
    goal: 'Leads',
    requester: { name: 'Sarah', email: 'sarah@example.com' },
    skipExternal: true,
    mockFetch: async (url) => ({
      status: 200,
      finalUrl: url,
      loadTimeMs: 2100,
      headers: {},
      html: '<html><head><title>Short</title></head><body></body></html>'
    })
  });

  const lead = leadStore.addLead({
    brandId: 'ps-digilabs',
    brandName: 'PS DigiLabs',
    customerName: 'Sarah',
    email: 'sarah@example.com',
    auditId: audit.id,
    service: 'Automated Website & SEO Audit',
    message: `Audited ${audit.finalUrl} (${audit.id})`
  });

  // 1. Test Payment Webhook with HMAC-SHA256 verification
  process.env.PAYMENT_WEBHOOK_SECRET = 'test_secret_2026';

  await new Promise((resolve, reject) => {
    const server = app.listen(3097, async () => {
      try {
        const lsPayload = JSON.stringify({
          meta: {
            event_name: 'order_created',
            custom_data: { audit_id: audit.id }
          },
          data: {
            id: 'ls_ord_' + Date.now(),
            attributes: {
              total: 19900,
              currency: 'USD',
              status: 'paid',
              user_name: 'Sarah Lee',
              user_email: 'sarah@example.com',
              first_order_item: { product_name: 'PS DigiLabs Growth & CRO Overhaul' }
            }
          }
        });

        // Invalid signature must be rejected
        const badRes = await fetch('http://localhost:3097/api/payments/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': 'deadbeef'
          },
          body: lsPayload
        });
        assert.strictEqual(badRes.status, 401);

        // Valid HMAC signature must succeed
        const validSig = crypto
          .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET)
          .update(lsPayload, 'utf8')
          .digest('hex');

        const okRes = await fetch('http://localhost:3097/api/payments/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': validSig
          },
          body: lsPayload
        });
        const okJson = await okRes.json();
        assert.strictEqual(okRes.status, 201);
        assert.strictEqual(okJson.success, true);
        assert.strictEqual(okJson.order.amountUsd, 199);
        assert.strictEqual(okJson.order.auditId, audit.id);
        assert.strictEqual(okJson.order.fulfillment.status, 'READY_FOR_DEPLOYMENT');

        // Duplicate webhook should return 200 duplicate:true
        const dupRes = await fetch('http://localhost:3097/api/payments/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': validSig
          },
          body: lsPayload
        });
        const dupJson = await dupRes.json();
        assert.strictEqual(dupRes.status, 200);
        assert.strictEqual(dupJson.duplicate, true);

        // Audit & Lead must now be PAID
        const updatedAudit = siteAuditService.getAuditById(audit.id);
        assert.strictEqual(updatedAudit.paymentStatus, 'PAID');
        const updatedLead = leadStore.getLeads('ps-digilabs').find((l) => l.id === lead.id);
        assert.strictEqual(updatedLead.paymentStatus, 'PAID');

        // Orders endpoint check
        const ordersRes = await fetch('http://localhost:3097/api/payments/orders');
        const ordersJson = await ordersRes.json();
        assert.strictEqual(ordersRes.status, 200);
        assert.ok(ordersJson.stats.totalRevenueUsd >= 199);

        // Widget & Dashboard UI check
        const widgetRes = await fetch('http://localhost:3097/widgets/ps-digilabs/audit-widget.js');
        const widgetJs = await widgetRes.text();
        assert.strictEqual(widgetRes.status, 200);
        assert.ok(widgetJs.includes('openPSAuditModal'));

        const dashRes = await fetch('http://localhost:3097/');
        const dashHtml = await dashRes.text();
        assert.strictEqual(dashRes.status, 200);
        assert.ok(dashHtml.includes('data-tab="audits"'));
        assert.ok(dashHtml.includes('rev-total-usd'));

        const previewRes = await fetch('http://localhost:3097/psdigilabs-preview.html');
        const previewHtml = await previewRes.text();
        assert.strictEqual(previewRes.status, 200);
        assert.ok(previewHtml.includes('id="ps-audit-widget"'));
        assert.ok(previewHtml.includes('/widgets/ps-digilabs/audit-widget.js'));

        console.log('✅ [PASS] Payment webhook HMAC verification, deduplication & PAID state sync');
        console.log('✅ [PASS] Embeddable audit widget & dashboard UI serving');
        server.close(resolve);
      } catch (err) {
        server.close(() => reject(err));
      }
    });
  });

  delete process.env.PAYMENT_WEBHOOK_SECRET;

  // 2. Test Daily Batch Prospect Auditor
  const sampleCsvPath = path.join(__dirname, '../data/prospects.sample.csv');
  const sampleProspects = parseProspectsFile(sampleCsvPath);
  assert.strictEqual(sampleProspects.length, 2);

  const tmpOutDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ps-batch-audit-'));
  const batchSummary = await runBatchAudit(
    [
      { url: 'https://weak-prospect.example.com', company: 'Weak Co', contactName: 'Sam', email: 'sam@weak.example.com', goal: 'Leads' },
      { url: 'https://strong-prospect.example.com', company: 'Strong Co', contactName: 'Mia', email: 'mia@strong.example.com', goal: 'Leads' }
    ],
    {
      maxScore: 75,
      concurrency: 2,
      skipExternal: true,
      outDir: tmpOutDir,
      mockFetch: async (url) => {
        if (url.includes('weak-prospect')) {
          return { status: 200, finalUrl: url, loadTimeMs: 2500, headers: {}, html: '<html><head></head><body></body></html>' };
        }
        return {
          status: 200,
          finalUrl: url,
          loadTimeMs: 250,
          headers: { 'content-encoding': 'br', 'strict-transport-security': 'max-age=31536000' },
          html: `<html><head><title>Strong Co | Enterprise Cloud Software</title><meta name="description" content="Enterprise cloud automation platform engineered for reliable high-volume global operations and faster delivery."><meta name="viewport" content="width=device-width"><link rel="canonical" href="https://strong-prospect.example.com/"><meta property="og:title" content="Strong Co"><meta property="og:description" content="Cloud"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Strong Co"}</script><script src="https://www.googletagmanager.com/gtag/js"></script></head><body><h1>Strong Co</h1><form></form><a href="https://wa.me/916289482083">WA</a></body></html>`
        };
      }
    }
  );

  assert.strictEqual(batchSummary.results.length, 2);
  assert.strictEqual(batchSummary.qualifiedLeads.length, 1);
  assert.strictEqual(batchSummary.qualifiedLeads[0].domain, 'weak-prospect.example.com');
  assert.ok(fs.existsSync(batchSummary.jsonPath));
  assert.ok(fs.existsSync(batchSummary.csvPath));
  fs.rmSync(tmpOutDir, { recursive: true, force: true });
  console.log('✅ [PASS] Daily batch prospect auditor & CSV/JSON outreach export');

  console.log('\n🎉 ALL PAYMENT, WIDGET & BATCH AUDIT TESTS PASSED!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
