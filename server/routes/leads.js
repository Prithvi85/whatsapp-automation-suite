/**
 * Leads Management & Website Form-to-WhatsApp Ingestion
 */

const express = require('express');
const router = express.Router();
const leadStore = require('../services/leadStore');
const chatbotEngine = require('../services/chatbotEngine');

/**
 * GET /api/leads
 * Fetch all leads or by brand
 */
router.get('/', (req, res) => {
  const brandId = req.query.brand;
  const leads = leadStore.getLeads(brandId);
  res.json({ success: true, count: leads.length, leads });
});

/**
 * GET /api/leads/stats
 * Statistics across brands
 */
router.get('/stats', (req, res) => {
  res.json({ success: true, stats: leadStore.getStats() });
});

/**
 * POST /api/leads
 * Submit form from website (e.g. quote form, appointment request, contact form)
 */
router.post('/', async (req, res) => {
  try {
    const { brandId, name, phone, email, service, message, source } = req.body;

    if (!brandId) {
      return res.status(400).json({ success: false, error: 'Missing required field: brandId' });
    }

    const brand = chatbotEngine.resolveBrand(brandId);

    const lead = leadStore.addLead({
      brandId: brand.id,
      brandName: brand.name,
      customerName: name || 'Website Visitor',
      phone: phone || '',
      email: email || '',
      service: service || 'Website Inquiry',
      message: message || '',
      source: source || 'Website Embed Form',
      channel: 'Web Lead Capture'
    });

    console.log(`[New Web Lead] Brand: ${brand.name} | Customer: ${name} | Phone: ${phone}`);

    res.status(201).json({
      success: true,
      message: 'Lead captured successfully and added to automation pipeline.',
      lead: lead
    });
  } catch (error) {
    console.error('[Lead Ingestion Error]:', error);
    res.status(500).json({ success: false, error: 'Internal server error processing lead' });
  }
});

module.exports = router;
