/**
 * Brand Metadata & Live WhatsApp Simulator Route
 */

const express = require('express');
const router = express.Router();
const brandsConfig = require('../../config/brands.config');
const chatbotEngine = require('../services/chatbotEngine');

/**
 * GET /api/brands
 * Get list of configured brands
 */
router.get('/', (req, res) => {
  res.json({ success: true, brands: brandsConfig.brands });
});

/**
 * GET /api/brands/:id
 * Get single brand details
 */
router.get('/:id', (req, res) => {
  const brand = brandsConfig.brands[req.params.id];
  if (!brand) {
    return res.status(404).json({ success: false, error: 'Brand not found' });
  }
  res.json({ success: true, brand });
});

/**
 * POST /api/simulate
 * Simulates incoming WhatsApp interaction and returns immediate bot reply
 */
router.post('/simulate', async (req, res) => {
  try {
    const { brandId, messageText, buttonPayload, senderPhone, senderName, recipientId } = req.body;

    const result = await chatbotEngine.processMessage({
      brandId: brandId || 'ritika-jaiswal',
      senderPhone: senderPhone || '+91 98000 00000',
      senderName: senderName || 'Demo Customer',
      messageText: messageText || '',
      buttonPayload: buttonPayload || '',
      recipientId: recipientId || '',
      isSimulation: true
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Simulation Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
