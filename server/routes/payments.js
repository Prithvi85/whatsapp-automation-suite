/**
 * USD Payment Webhook & Revenue Order Tracker Routes
 */

const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

/**
 * POST /api/payments/webhook
 * Receives Merchant-of-Record payment events (Lemon Squeezy, Dodo Payments, Paddle, custom)
 */
router.post('/webhook', (req, res) => {
  const verification = paymentService.verifySignature(req.rawBody || JSON.stringify(req.body || {}), req.headers);
  if (!verification.verified) {
    return res.status(401).json({ success: false, error: verification.reason });
  }

  try {
    const result = paymentService.processWebhook(req.body || {});
    if (result.ignored) {
      return res.status(200).json({ success: true, ignored: true, reason: result.reason });
    }

    res.status(result.duplicate ? 200 : 201).json({
      success: true,
      duplicate: Boolean(result.duplicate),
      verificationMode: verification.mode,
      order: result.order
    });
  } catch (err) {
    console.error('[Payment Webhook Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/payments/orders
 * List recorded USD orders and revenue summary
 */
router.get('/orders', (req, res) => {
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  res.json({
    success: true,
    stats: paymentService.getRevenueStats(),
    orders: paymentService.getOrders(limit)
  });
});

module.exports = router;
