/**
 * WhatsApp Web Live Gateway Route
 * Allows web dashboard to see real-time QR code and connection status
 */

const express = require('express');
const router = express.Router();
const whatsappWebBridge = require('../services/whatsappWebBridge');

/**
 * GET /api/gateway/status
 * Return live pairing QR code or connected status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: whatsappWebBridge.getStatus()
  });
});

/**
 * POST /api/gateway/logout
 * Log out and regenerate QR code
 */
router.post('/logout', async (req, res) => {
  const result = await whatsappWebBridge.logout();
  res.json(result);
});

module.exports = router;
