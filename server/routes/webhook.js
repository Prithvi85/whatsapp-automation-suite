/**
 * Meta WhatsApp Cloud API Webhook Controller
 * Handles GET (Verification) and POST (Event notifications)
 */

const express = require('express');
const router = express.Router();
const chatbotEngine = require('../services/chatbotEngine');

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'antigravity_wa_secure_token_2026';

/**
 * GET /api/webhook
 * Meta Webhook Challenge Verification
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Meta Webhook Verified Successfully]');
      return res.status(200).send(challenge);
    } else {
      console.warn('[Meta Webhook Verification Failed] Token mismatch');
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
});

/**
 * POST /api/webhook
 * Inbound WhatsApp message receiver
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // Fast-acknowledge HTTP 200 to Meta
    res.status(200).send('EVENT_RECEIVED');

    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          const metadata = value.metadata || {};
          const recipientPhoneNumberId = metadata.phone_number_id;

          // Check if it's a message event
          if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const senderPhone = message.from;
            const contact = (value.contacts && value.contacts[0]) || {};
            const senderName = (contact.profile && contact.profile.name) || 'Client';

            let messageText = '';
            let buttonPayload = '';

            if (message.type === 'text') {
              messageText = message.text ? message.text.body : '';
            } else if (message.type === 'interactive') {
              if (message.interactive.type === 'button_reply') {
                buttonPayload = message.interactive.button_reply.id;
                messageText = message.interactive.button_reply.title;
              } else if (message.interactive.type === 'list_reply') {
                buttonPayload = message.interactive.list_reply.id;
                messageText = message.interactive.list_reply.title;
              }
            } else if (message.type === 'button') {
              buttonPayload = message.button ? message.button.payload : '';
              messageText = message.button ? message.button.text : '';
            }

            console.log(`[Incoming WhatsApp] From: ${senderPhone} (${senderName}) | Msg: "${messageText}" | Payload: "${buttonPayload}"`);

            // Process via Chatbot Engine
            await chatbotEngine.processMessage({
              recipientId: recipientPhoneNumberId,
              senderPhone: senderPhone,
              senderName: senderName,
              messageText: messageText,
              buttonPayload: buttonPayload,
              isSimulation: false
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('[Webhook Processing Error]:', error);
  }
});

module.exports = router;
