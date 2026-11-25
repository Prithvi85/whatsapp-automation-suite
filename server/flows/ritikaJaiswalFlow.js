/**
 * Automation Flow: Ritika Jaiswal Fashion (www.ritikajaiswalfashion.com)
 * Number: +91923759949
 * Specialization: Bridal Couture, Bespoke Atelier Consultations, Camac Street Flagship
 */

const brandsConfig = require('../../config/brands.config');
const brand = brandsConfig.brands['ritika-jaiswal'];

class RitikaJaiswalFlow {
  constructor() {
    this.brand = brand;
  }

  async handleInbound(messageText, buttonPayload, senderPhone, senderName) {
    const text = (messageText || '').toLowerCase().trim();
    const payload = buttonPayload || '';

    // 1. Atelier Visit / Appointment (12B Camac Street, Kolkata)
    if (payload === 'MENU_APPOINTMENT' || text.includes('appointment') || text.includes('visit') || text.includes('camac') || text.includes('store') || text.includes('trial')) {
      return {
        type: 'text',
        text: `📅 *Flagship Atelier Private Appointment*\n\n` +
          `📍 *Address:* 12B Camac Street, Kolkata, West Bengal 700017\n` +
          `🕒 *Hours:* Monday to Saturday | 11:00 AM – 7:30 PM (By Prior Appointment)\n\n` +
          `To confirm your private bridal viewing slot, please reply with:\n` +
          `• *Occasion:* (e.g. Wedding Lehenga / Sangeet / Reception)\n` +
          `• *Tentative Wedding Date:*\n` +
          `• *Preferred Day & Time for Visit:*\n\n` +
          `Our atelier manager will review the schedule and send your appointment confirmation pass immediately.`,
        followUpButtons: [
          { id: 'MENU_STYLIST', title: '👩‍💼 Speak to Stylist' },
          { id: 'MENU_LOOKBOOK', title: '👗 View Lookbook' }
        ]
      };
    }

    // 2. Bespoke Bridal Consultation & Custom Sizing (checked BEFORE generic lookbook)
    if (payload === 'MENU_BESPOKE' || text.includes('bespoke') || text.includes('custom') || text.includes('size') || text.includes('sizing') || text.includes('measurement') || text.includes('fabric')) {
      return {
        type: 'text',
        text: `✨ *Bespoke Bridal Design & Couture Service*\n\n` +
          `Every couture ensemble at Ritika Jaiswal is customized to your exact silhouette and color palette.\n\n` +
          `• *Bridal Lead Time:* 4 to 8 weeks\n` +
          `• *Virtual Consultations:* Available via Video Call for outstation & NRI brides\n` +
          `• *Fabric Swatches & Custom Dyes:* Delivered upon request\n\n` +
          `Please share your wedding date and any inspiration photos. Our head couturier will review and guide you step-by-step.`,
        followUpButtons: [
          { id: 'MENU_APPOINTMENT', title: '📅 Book Camac St Visit' },
          { id: 'MENU_STYLIST', title: '👩‍💼 Talk to Couturier' }
        ]
      };
    }

    // 3. Order Tracking & Dispatch Desk
    if (payload === 'MENU_ORDER_STATUS' || text.includes('order') || text.includes('status') || text.includes('tracking') || text.includes('dispatch') || text.includes('delivery')) {
      return {
        type: 'text',
        text: `📦 *Order Tracking & Dispatch Desk*\n\n` +
          `Thank you for your order with Ritika Jaiswal Fashion.\n\n` +
          `Please reply with your *Order Number* (e.g. RJ-2026-XXXX) or the *Full Name & Email* provided during your purchase.\n\n` +
          `Our logistics concierge will share real-time stitching and courier tracking details.`,
        followUpButtons: [
          { id: 'MENU_STYLIST', title: '👩‍💼 Human Support' },
          { id: 'MENU_LOOKBOOK', title: '👗 Explore New In' }
        ]
      };
    }

    // 4. Stylist Escalation
    if (payload === 'MENU_STYLIST' || text.includes('stylist') || text.includes('human') || text.includes('call') || text.includes('speak') || text.includes('person')) {
      return {
        type: 'text',
        text: `👩‍💼 *Connecting to Ritika Jaiswal Styling Desk*\n\n` +
          `A member of our personal styling team has been notified. We will reply to this chat right away.\n\n` +
          `Atelier Hotline: +91 92375 9949\n` +
          `Location: 12B Camac Street, Kolkata\n\n` +
          `Feel free to share photos, color preferences, or budget requirements while you wait!`,
        followUpButtons: [
          { id: 'MENU_LOOKBOOK', title: '👗 View Lookbook' },
          { id: 'MENU_APPOINTMENT', title: '📅 Schedule Visit' }
        ]
      };
    }

    // 5. Lookbook & Catalog
    if (payload === 'MENU_LOOKBOOK' || text.includes('lookbook') || text.includes('catalog') || text.includes('collection') || text.includes('bridal') || text.includes('lehenga')) {
      return {
        type: 'text',
        text: `✨ *Ritika Jaiswal Bridal & Festive Lookbook*\n\n` +
          `Dear ${senderName || 'Client'},\n\n` +
          `Thank you for admiring our couture creations. Explore our latest bridal lehengas, reception gowns, and festive wear crafted with heritage zardozi, gota, and fine resham embroidery.\n\n` +
          `📖 *Digital Lookbook:* https://www.ritikajaiswalfashion.com/lookbook\n` +
          `👗 *Bridal Ensembles:* https://www.ritikajaiswalfashion.com/bridal\n` +
          `⭐ *White-Glove Delivery:* Across India & Worldwide\n\n` +
          `Would you like to book a private consultation at our Camac Street atelier or speak with a senior stylist?`,
        followUpButtons: [
          { id: 'MENU_APPOINTMENT', title: '📅 Book Atelier Visit' },
          { id: 'MENU_BESPOKE', title: '✨ Custom Bridal Order' },
          { id: 'MENU_STYLIST', title: '👩‍💼 Chat with Stylist' }
        ]
      };
    }

    // Default / Greeting
    return {
      type: 'interactive_list',
      header: 'Ritika Jaiswal Atelier',
      body: `Namaste ${senderName || ''}! ✨ Welcome to Ritika Jaiswal Atelier (Kolkata).\n\nHow may our couture team assist your bridal or festive wardrobe today?`,
      buttonTitle: 'Select Service',
      sections: [
        {
          title: 'Bridal & Couture Services',
          rows: [
            { id: 'MENU_LOOKBOOK', title: '👗 Digital Lookbook', description: 'Explore bespoke lehengas & gowns' },
            { id: 'MENU_APPOINTMENT', title: '📅 Flagship Atelier Visit', description: 'Book appointment at Camac Street' },
            { id: 'MENU_BESPOKE', title: '✨ Bespoke Custom Design', description: 'Custom sizing, colors & embroidery' },
            { id: 'MENU_ORDER_STATUS', title: '📦 Track My Order', description: 'Check dispatch and courier status' },
            { id: 'MENU_STYLIST', title: '👩‍💼 Personal Stylist Chat', description: 'Speak with our couture concierge' }
          ]
        }
      ]
    };
  }
}

module.exports = new RitikaJaiswalFlow();
