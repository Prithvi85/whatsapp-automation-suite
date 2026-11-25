/**
 * Lead Store & In-Memory / File Persistent CRM
 * Captures inquiries across Ritika Jaiswal, PS DigiLabs, and Creative Monks
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure leads file exists
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
}

class LeadStore {
  constructor() {
    this.leads = this._loadLeads();
  }

  _loadLeads() {
    try {
      const content = fs.readFileSync(LEADS_FILE, 'utf8');
      return JSON.parse(content || '[]');
    } catch (e) {
      console.error('Error loading leads file:', e);
      return [];
    }
  }

  _saveLeads() {
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(this.leads, null, 2));
    } catch (e) {
      console.error('Error saving leads file:', e);
    }
  }

  /**
   * Add new captured lead
   */
  addLead(leadData) {
    const lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      brandId: leadData.brandId,
      brandName: leadData.brandName || leadData.brandId,
      customerName: leadData.customerName || 'Anonymous / Website Visitor',
      phone: leadData.phone || '',
      email: leadData.email || '',
      service: leadData.service || 'General Inquiry',
      message: leadData.message || '',
      source: leadData.source || 'Website Widget',
      channel: leadData.channel || 'WhatsApp Webhook / Form',
      auditId: leadData.auditId || '',
      paymentStatus: leadData.paymentStatus || 'UNPAID',
      paidAmountUsd: leadData.paidAmountUsd || 0,
      status: 'NEW'
    };

    this.leads.unshift(lead);
    this._saveLeads();
    return lead;
  }

  /**
   * Mark a lead as PAID (matched by auditId, leadId, or email)
   */
  markLeadPaid({ auditId, leadId, email, amountUsd = 0, orderId = '' }) {
    let updated = null;
    for (const lead of this.leads) {
      const matchAudit = auditId && (lead.auditId === auditId || (lead.message && lead.message.includes(auditId)));
      const matchId = leadId && lead.id === leadId;
      const matchEmail = email && lead.email && lead.email.toLowerCase() === email.toLowerCase();

      if (matchAudit || matchId || matchEmail) {
        lead.paymentStatus = 'PAID';
        lead.status = 'PAID';
        lead.paidAmountUsd = Number(amountUsd) || lead.paidAmountUsd || 0;
        lead.orderId = orderId || lead.orderId || '';
        lead.paidAt = new Date().toISOString();
        updated = lead;
        break;
      }
    }

    if (updated) {
      this._saveLeads();
    }
    return updated;
  }

  /**
   * Get all leads or filter by brand
   */
  getLeads(brandId = null) {
    if (brandId) {
      return this.leads.filter(l => l.brandId === brandId);
    }
    return this.leads;
  }

  /**
   * Get lead statistics
   */
  getStats() {
    return {
      total: this.leads.length,
      byBrand: {
        'ritika-jaiswal': this.leads.filter(l => l.brandId === 'ritika-jaiswal').length,
        'ps-digilabs': this.leads.filter(l => l.brandId === 'ps-digilabs').length,
        'creative-monks': this.leads.filter(l => l.brandId === 'creative-monks').length
      }
    };
  }
}

module.exports = new LeadStore();
