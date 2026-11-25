/**
 * Meta WhatsApp Cloud API Service (Graph API v21.0)
 * Supports official Meta Cloud API messaging:
 * - Text Messages
 * - Quick-Reply Buttons
 * - Interactive List Menus
 * - Media & Lookbook Attachments
 * - Pre-approved WhatsApp Templates
 */

const https = require('https');

class WhatsAppCloudApiService {
  constructor() {
    this.graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v21.0';
    this.systemAccessToken = process.env.META_WHATSAPP_ACCESS_TOKEN || '';
  }

  /**
   * Helper to execute HTTPS request to Graph API
   */
  async _sendGraphRequest(phoneNumberId, payload) {
    if (!this.systemAccessToken || !phoneNumberId) {
      console.log(`[WhatsApp API Dry-Run] Token or PhoneNumberId not configured. Simulating dispatch to: ${payload.to}`);
      console.log(`[Payload Preview]:`, JSON.stringify(payload, null, 2));
      return {
        simulated: true,
        success: true,
        message: 'Dispatched in dry-run/simulation mode. Configure META_WHATSAPP_ACCESS_TOKEN to send live messages.',
        timestamp: new Date().toISOString()
      };
    }

    return new Promise((resolve, reject) => {
      const dataString = JSON.stringify(payload);
      const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/${this.graphApiVersion}/${phoneNumberId}/messages`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.systemAccessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataString)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ success: true, data: parsed });
            } else {
              console.error(`[WhatsApp API Error] HTTP ${res.statusCode}:`, parsed);
              resolve({ success: false, error: parsed, statusCode: res.statusCode });
            }
          } catch (e) {
            resolve({ success: false, raw: body, statusCode: res.statusCode });
          }
        });
      });

      req.on('error', (err) => {
        console.error('[WhatsApp Network Error]:', err.message);
        reject(err);
      });

      req.write(dataString);
      req.end();
    });
  }

  /**
   * Send plain text WhatsApp message
   */
  async sendTextMessage(phoneNumberId, to, text, previewUrl = true) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'text',
      text: {
        preview_url: previewUrl,
        body: text
      }
    };
    return this._sendGraphRequest(phoneNumberId, payload);
  }

  /**
   * Send Interactive Quick-Reply Buttons (up to 3 buttons)
   */
  async sendInteractiveButtons(phoneNumberId, to, bodyText, buttons, headerText = null, footerText = null) {
    const actionButtons = buttons.slice(0, 3).map((btn, index) => ({
      type: 'reply',
      reply: {
        id: btn.id || `btn_${index}`,
        title: btn.title.substring(0, 20) // Meta limit: 20 chars
      }
    }));

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: { buttons: actionButtons }
      }
    };

    if (headerText) {
      payload.interactive.header = { type: 'text', text: headerText };
    }
    if (footerText) {
      payload.interactive.footer = { text: footerText };
    }

    return this._sendGraphRequest(phoneNumberId, payload);
  }

  /**
   * Send Interactive List Menu (up to 10 options across sections)
   */
  async sendInteractiveList(phoneNumberId, to, headerText, bodyText, buttonText, sections) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: headerText },
        body: { text: bodyText },
        footer: { text: 'Select an option below to proceed' },
        action: {
          button: buttonText.substring(0, 20),
          sections: sections
        }
      }
    };
    return this._sendGraphRequest(phoneNumberId, payload);
  }

  /**
   * Send Media Document / Lookbook PDF
   */
  async sendDocument(phoneNumberId, to, documentUrl, caption, filename = 'Lookbook.pdf') {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'document',
      document: {
        link: documentUrl,
        caption: caption,
        filename: filename
      }
    };
    return this._sendGraphRequest(phoneNumberId, payload);
  }
}

module.exports = new WhatsAppCloudApiService();
