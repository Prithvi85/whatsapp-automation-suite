/**
 * Multi-Brand WhatsApp Chatbot Engine & Orchestrator
 * Maps incoming Meta WhatsApp Cloud API webhooks to the right brand flow
 */

const brandsConfig = require('../../config/brands.config');
const ritikaFlow = require('../flows/ritikaJaiswalFlow');
const psFlow = require('../flows/psDigiLabsFlow');
const cmFlow = require('../flows/creativeMonksFlow');
const leadStore = require('./leadStore');
const whatsappCloudApi = require('./whatsappCloudApi');

class ChatbotEngine {
  constructor() {
    this.brands = brandsConfig.brands;
  }

  /**
   * Determine which brand this interaction belongs to
   */
  resolveBrand(brandId, recipientId, senderId, text = '') {
    if (brandId && this.brands[brandId]) {
      return this.brands[brandId];
    }

    const cleanRecipient = (recipientId || '').replace(/\D/g, '');
    const cleanSender = (senderId || '').replace(/\D/g, '');

    // Check Ritika Jaiswal
    if (cleanRecipient.includes('923759949') || cleanSender.includes('923759949') || (brandId && brandId.includes('ritika'))) {
      return this.brands['ritika-jaiswal'];
    }

    // Check PS DigiLabs
    if (cleanRecipient.includes('6289482083') || cleanSender.includes('6289482083') || (brandId && brandId.includes('psdigilabs'))) {
      return this.brands['ps-digilabs'];
    }

    // Check Creative Monks (Line 1 or Line 2)
    if (cleanRecipient.includes('7003797652') || cleanRecipient.includes('9038516799') ||
        cleanSender.includes('7003797652') || cleanSender.includes('9038516799') ||
        (brandId && brandId.includes('creative'))) {
      return this.brands['creative-monks'];
    }

    // Keyword fallback
    const lower = text.toLowerCase();
    if (lower.includes('couture') || lower.includes('lehenga') || lower.includes('camac') || lower.includes('ritika')) {
      return this.brands['ritika-jaiswal'];
    }
    if (lower.includes('software') || lower.includes('seo') || lower.includes('web development') || lower.includes('app') || lower.includes('digilabs')) {
      return this.brands['ps-digilabs'];
    }
    if (lower.includes('photography') || lower.includes('wedding shoot') || lower.includes('cinematography') || lower.includes('creative monks')) {
      return this.brands['creative-monks'];
    }

    // Default to ritika-jaiswal if unspecified
    return this.brands['ritika-jaiswal'];
  }

  /**
   * Process incoming message (from Webhook or Simulator)
   */
  async processMessage({ brandId, senderPhone, senderName, messageText, buttonPayload, recipientId, isSimulation = false }) {
    const brand = this.resolveBrand(brandId, recipientId, senderPhone, messageText);
    const resolvedBrandId = brand.id;

    // Record incoming interaction as a potential lead
    leadStore.addLead({
      brandId: resolvedBrandId,
      brandName: brand.name,
      customerName: senderName || 'WhatsApp User (' + (senderPhone || 'Anonymous') + ')',
      phone: senderPhone,
      message: messageText || buttonPayload || 'Initiated WhatsApp conversation',
      source: isSimulation ? 'Live Simulator Test' : 'WhatsApp Cloud API Webhook',
      channel: 'WhatsApp'
    });

    let botResponse = null;

    if (resolvedBrandId === 'ritika-jaiswal') {
      botResponse = await ritikaFlow.handleInbound(messageText, buttonPayload, senderPhone, senderName);
    } else if (resolvedBrandId === 'ps-digilabs') {
      botResponse = await psFlow.handleInbound(messageText, buttonPayload, senderPhone, senderName);
    } else if (resolvedBrandId === 'creative-monks') {
      botResponse = await cmFlow.handleInbound(messageText, buttonPayload, senderPhone, senderName, recipientId);
    }

    // If not a simulation and live API credentials exist, dispatch directly through WhatsApp Cloud API
    if (!isSimulation && brand.metaPhoneNumberId && senderPhone) {
      if (botResponse.type === 'interactive_list') {
        await whatsappCloudApi.sendInteractiveList(
          brand.metaPhoneNumberId,
          senderPhone,
          botResponse.header,
          botResponse.body,
          botResponse.buttonTitle,
          botResponse.sections
        );
      } else if (botResponse.followUpButtons && botResponse.followUpButtons.length) {
        await whatsappCloudApi.sendInteractiveButtons(
          brand.metaPhoneNumberId,
          senderPhone,
          botResponse.text,
          botResponse.followUpButtons
        );
      } else {
        await whatsappCloudApi.sendTextMessage(
          brand.metaPhoneNumberId,
          senderPhone,
          botResponse.text
        );
      }
    }

    return {
      brand: brand,
      senderPhone: senderPhone,
      response: botResponse,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new ChatbotEngine();
