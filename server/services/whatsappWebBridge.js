/**
 * WhatsApp Web Live Session Bridge (Baileys Engine)
 * Directly pairs with your real phone's WhatsApp via QR Code ("Linked Devices").
 * Once paired, automated texts respond live inside real mobile WhatsApp without Meta API approval!
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const chatbotEngine = require('./chatbotEngine');
const leadStore = require('./leadStore');

const AUTH_DIR = path.join(__dirname, '../../data/baileys_auth');

class WhatsAppWebBridge {
  constructor() {
    this.sock = null;
    this.status = 'DISCONNECTED'; // 'DISCONNECTED' | 'QR_READY' | 'CONNECTED'
    this.qrDataUrl = null;
    this.rawQr = null;
    this.userPhone = null;
    this.userName = null;
    this.reconnectAttempts = 0;
  }

  async start() {
    try {
      if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
      }

      this.status = 'INITIALIZING';
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

      this.sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Antigravity Hub', 'Chrome', '1.0.0'],
        syncFullHistory: false
      });

      // Handle credentials update
      this.sock.ev.on('creds.update', saveCreds);

      // Handle connection updates
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.rawQr = qr;
          this.status = 'QR_READY';
          try {
            this.qrDataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 6 });
          } catch (e) {
            console.error('Error generating QR DataURL:', e);
          }
          console.log('[WhatsApp Web Gateway] QR Code generated. Ready to pair from phone.');
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log(`[WhatsApp Web Gateway] Connection closed. Should reconnect: ${shouldReconnect}`);
          this.status = 'DISCONNECTED';
          this.qrDataUrl = null;
          this.userPhone = null;

          if (shouldReconnect) {
            setTimeout(() => this.start(), 3000);
          }
        } else if (connection === 'open') {
          this.status = 'CONNECTED';
          this.qrDataUrl = null;
          const userJid = this.sock.user?.id || '';
          this.userPhone = userJid.split(':')[0] || userJid.split('@')[0];
          this.userName = this.sock.user?.name || 'Business Phone';
          console.log(`========================================================`);
          console.log(`🟢 [WhatsApp Web Gateway LIVE] Connected to Phone: +${this.userPhone}`);
          console.log(`🚀 Automated Bot is now active on real mobile WhatsApp!`);
          console.log(`========================================================`);
        }
      });

      // Handle inbound mobile messages
      this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const m of messages) {
          // Do not reply to self-sent messages to avoid infinite loops
          if (m.key.fromMe) continue;

          const remoteJid = m.key.remoteJid;
          if (!remoteJid || remoteJid.endsWith('@g.us')) continue; // Skip group chats, focus on direct customer DMs

          const senderPhone = remoteJid.split('@')[0];
          const senderName = m.pushName || 'WhatsApp Customer';

          // Extract text from message
          let messageText = '';
          const msg = m.message;
          if (!msg) continue;

          if (msg.conversation) {
            messageText = msg.conversation;
          } else if (msg.extendedTextMessage?.text) {
            messageText = msg.extendedTextMessage.text;
          } else if (msg.buttonsResponseMessage?.selectedButtonId) {
            messageText = msg.buttonsResponseMessage.selectedButtonId;
          } else if (msg.listResponseMessage?.singleSelectReply?.selectedRowId) {
            messageText = msg.listResponseMessage.singleSelectReply.selectedRowId;
          } else if (msg.templateButtonReplyMessage?.selectedId) {
            messageText = msg.templateButtonReplyMessage.selectedId;
          }

          if (!messageText) continue;

          console.log(`[Real WhatsApp Incoming] From: +${senderPhone} (${senderName}): "${messageText}"`);

          // Process through unified Chatbot Engine
          const botResult = await chatbotEngine.processMessage({
            senderPhone: senderPhone,
            senderName: senderName,
            messageText: messageText,
            recipientId: this.userPhone,
            isSimulation: false
          });

          // Format bot response for mobile WhatsApp
          const response = botResult.response;
          let replyText = '';

          if (response.type === 'interactive_list') {
            replyText = `*${response.header}*\n\n${response.body}\n\n`;
            if (response.sections && response.sections[0]) {
              replyText += response.sections[0].rows.map((row, idx) => `*${idx + 1}.* ${row.title}\n_${row.description}_`).join('\n\n');
              replyText += `\n\n_Reply with 1, 2, 3... or type your inquiry._`;
            }
          } else {
            replyText = response.text || '';
            if (response.followUpButtons && response.followUpButtons.length) {
              replyText += `\n\n*Quick Options:*\n`;
              replyText += response.followUpButtons.map((btn, idx) => `👉 *${idx + 1}.* ${btn.title}`).join('\n');
              replyText += `\n\n_Reply with your choice number or message us directly!_`;
            }
          }

          // Dispatch automated reply into real mobile WhatsApp chat
          try {
            await this.sock.sendMessage(remoteJid, { text: replyText });
            console.log(`[Real WhatsApp Sent] Automated reply dispatched to +${senderPhone}`);
          } catch (sendErr) {
            console.error('[Error sending real WhatsApp message]:', sendErr.message);
          }
        }
      });

    } catch (err) {
      console.error('[WhatsApp Web Gateway Error]:', err);
      this.status = 'ERROR';
    }
  }

  getStatus() {
    return {
      status: this.status,
      qrDataUrl: this.qrDataUrl,
      userPhone: this.userPhone ? `+${this.userPhone}` : null,
      userName: this.userName,
      isLive: this.status === 'CONNECTED',
      timestamp: new Date().toISOString()
    };
  }

  async logout() {
    try {
      if (this.sock) {
        await this.sock.logout();
      }
    } catch (e) {}
    this.status = 'DISCONNECTED';
    this.userPhone = null;
    this.qrDataUrl = null;
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    }
    setTimeout(() => this.start(), 1500);
    return { success: true, message: 'Session logged out. Fresh QR will be generated.' };
  }
}

module.exports = new WhatsAppWebBridge();
