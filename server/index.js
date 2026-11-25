/**
 * Multi-Brand WhatsApp Integration & Automation Server
 * Supporting:
 * 1. Ritika Jaiswal Fashion (www.ritikajaiswalfashion.com) -> +91923759949
 * 2. PS DigiLabs (www.psdigilabs.in) -> +916289482083
 * 3. Creative Monks (www.creativemonks.in) -> +917003797652 / +919038516799
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const webhookRoutes = require('./routes/webhook');
const leadsRoutes = require('./routes/leads');
const brandsRoutes = require('./routes/brands');
const gatewayRoutes = require('./routes/gateway');
const auditRoutes = require('./routes/audit');
const paymentRoutes = require('./routes/payments');
const whatsappWebBridge = require('./services/whatsappWebBridge');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (preserve rawBody for payment webhook HMAC verification)
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Serve static widgets and assets
app.use('/widgets', express.static(path.join(__dirname, '../widgets')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/gateway', gatewayRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Multi-Brand WhatsApp Automation Hub',
    gateway: whatsappWebBridge.getStatus(),
    timestamp: new Date().toISOString(),
    supportedBrands: [
      { name: 'Ritika Jaiswal Fashion', site: 'www.ritikajaiswalfashion.com', phone: '+91923759949' },
      { name: 'PS DigiLabs', site: 'www.psdigilabs.in', phone: '+916289482083' },
      { name: 'Creative Monks', site: 'www.creativemonks.in', lines: ['+917003797652 (Weddings)', '+919038516799 (Commercial & Support)'] }
    ]
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`================================================================`);
    console.log(`🚀 Multi-Brand WhatsApp Automation Server Live on Port ${PORT}`);
    console.log(`🌐 Live Dashboard: http://localhost:${PORT}`);
    console.log(`🔗 Webhook Endpoint: http://localhost:${PORT}/api/webhook`);
    console.log(`📱 WhatsApp Web Gateway: Initializing QR engine...`);
    console.log(`================================================================`);

    // Start Baileys live phone gateway
    whatsappWebBridge.start();
  });
}

module.exports = app;
