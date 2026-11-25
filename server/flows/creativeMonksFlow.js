/**
 * Automation Flow: Creative Monks (www.creativemonks.in)
 * Dual Lines:
 *   - Line 1 (+917003797652): Weddings, Pre-Weddings, Events, Rice Ceremonies
 *   - Line 2 (+919038516799): Commercial Films, Fashion Campaigns, Post-Production & Album Tracking
 * Location: 27/A Satyajit Ray Sarani, Behala, Kolkata 700060
 */

const brandsConfig = require('../../config/brands.config');
const brand = brandsConfig.brands['creative-monks'];

class CreativeMonksFlow {
  constructor() {
    this.brand = brand;
  }

  async handleInbound(messageText, buttonPayload, senderPhone, senderName, receivingLine = null) {
    const text = (messageText || '').toLowerCase().trim();
    const payload = buttonPayload || '';

    // 1. Date Availability Check (Prioritized before generic wedding)
    if (payload === 'MENU_CHECK_DATE' || text.includes('availability') || text.includes('available') || text.includes('check date') || text.includes('reserve date') || text.includes('slot')) {
      return {
        type: 'text',
        text: `📅 *Creative Monks Date Availability Check*\n\n` +
          `To ensure bespoke attention to detail, our principal team accepts only a limited number of weddings per season.\n\n` +
          `Please reply with:\n` +
          `1. Bride & Groom Name\n` +
          `2. Event Date(s)\n` +
          `3. Venue / Location (Kolkata / Outstation)\n` +
          `4. Events to be Covered (Haldi, Sangeet, Wedding, Reception)\n\n` +
          `Our calendar director will verify slot availability and reserve your date.`,
        followUpButtons: [
          { id: 'MENU_WEDDING', title: '💍 View Packages' },
          { id: 'MENU_HUMAN_LINE1', title: '📞 Direct Call (+91 7003797652)' }
        ]
      };
    }

    // 2. Client Deliverables & Album Delivery Status (Line 2: 9038516799 - Prioritized before generic wedding)
    if (payload === 'MENU_DELIVERY' || text.includes('album') || text.includes('delivery') || text.includes('pendrive') || text.includes('edit status') || (text.includes('status') && !text.includes('quote'))) {
      return {
        type: 'text',
        text: `🖼️ *Post-Production & Album Delivery Status*\n\n` +
          `Our post-production team operates from Behala, Kolkata:\n` +
          `📲 *Direct Desk:* +91 90385 16799\n\n` +
          `Please reply with:\n` +
          `• *Event Name / Couple Name:*\n` +
          `• *Event Date:*\n` +
          `• *Query:* (RAW Selection Link / Teaser Video / Album Proof / Album Dispatch)\n\n` +
          `Our editing manager will look up your project file and provide a status update.`,
        followUpButtons: [
          { id: 'MENU_HUMAN_LINE2', title: '👨‍💼 Post-Production Support' },
          { id: 'MENU_WEDDING', title: '💍 Wedding Desk' }
        ]
      };
    }

    // 3. Family / Rice Ceremony (Annaprashan) / Baby Shoots
    if (payload === 'MENU_FAMILY' || text.includes('rice') || text.includes('annaprashan') || text.includes('baby') || text.includes('maternity') || text.includes('birthday')) {
      return {
        type: 'text',
        text: `👶 *Rice Ceremony (Annaprashan) & Family Shoots*\n\n` +
          `Capture your baby's precious first milestones with candid elegance.\n\n` +
          `• Candid Baby & Family Portraits\n` +
          `• Traditional Ritual & Ceremony Documentation\n` +
          `• Compact Highlight Video\n` +
          `• Designer Photo Album\n\n` +
          `Please share your ceremony date and venue location, and our Kolkata team will share the rate card.`,
        followUpButtons: [
          { id: 'MENU_CHECK_DATE', title: '📅 Check Date' },
          { id: 'MENU_HUMAN_LINE1', title: '📞 Book Shoot' }
        ]
      };
    }

    // 4. Commercial & Fashion Shoots (Line 2: 9038516799)
    if (payload === 'MENU_COMMERCIAL' || text.includes('commercial') || text.includes('fashion') || text.includes('brand') || text.includes('corporate') || text.includes('product') || text.includes('ad')) {
      return {
        type: 'text',
        text: `🎬 *Commercial & Fashion Cinematography Desk*\n\n` +
          `Managed directly by our commercial production line:\n` +
          `📲 *Direct Hotline:* +91 90385 16799\n\n` +
          `• High-Fashion & Lookbook Shoots\n` +
          `• Brand Commercials & Social Video Ads\n` +
          `• Corporate Documentaries & Event Coverage\n\n` +
          `Please share your brand name, expected deliverables, and target shoot window for a tailored commercial quotation.`,
        followUpButtons: [
          { id: 'MENU_DELIVERY', title: '🖼️ Album/Edit Status' },
          { id: 'MENU_HUMAN_LINE2', title: '👨‍💼 Speak to Commercial Dir' }
        ]
      };
    }

    // 5. Wedding & Pre-Wedding Collections (Line 1: 7003797652)
    if (payload === 'MENU_WEDDING' || text.includes('wedding') || text.includes('marriage') || text.includes('pre-wedding') || text.includes('pre wedding') || text.includes('cinematography')) {
      return {
        type: 'text',
        text: `💍 *Creative Monks Wedding Cinematography & Photography*\n\n` +
          `Dear ${senderName || 'Client'},\n\n` +
          `We craft cinematic love stories that capture raw, unscripted emotions.\n\n` +
          `✨ *Our Wedding Packages Include:*\n` +
          `• Candid & Traditional 4K Photography\n` +
          `• Cinematic Teaser Trailers & Feature Wedding Film\n` +
          `• Drone Aerial Shoots & Conceptual Pre-Weddings\n` +
          `• Luxury Handcrafted Flush Mount Photobooks\n\n` +
          `🌐 *Portfolio:* https://www.creativemonks.in\n` +
          `📲 *Direct Wedding Hotline:* +91 70037 97652\n\n` +
          `Would you like to check date availability or receive our wedding package brochure?`,
        followUpButtons: [
          { id: 'MENU_CHECK_DATE', title: '📅 Check Date' },
          { id: 'MENU_FAMILY', title: '👶 Rice Ceremony' },
          { id: 'MENU_HUMAN_LINE1', title: '📞 Speak to Booking Mgr' }
        ]
      };
    }

    // 6. Contact Human (Line 1 or Line 2)
    if (payload === 'MENU_HUMAN_LINE1' || payload === 'MENU_HUMAN_LINE2' || text.includes('call') || text.includes('speak') || text.includes('person') || text.includes('manager')) {
      const isLine2 = payload === 'MENU_HUMAN_LINE2' || text.includes('commercial');
      const targetNumber = isLine2 ? '+91 90385 16799 (Commercial & Post)' : '+91 70037 97652 (Weddings & Events)';
      return {
        type: 'text',
        text: `📞 *Creative Monks Team Connected*\n\n` +
          `You are connected to: *${targetNumber}*\n` +
          `Studio Address: 27/A Satyajit Ray Sarani, Behala, Kolkata 700060\n\n` +
          `Our coordinator has been pinged and will respond shortly!`,
        followUpButtons: [
          { id: 'MENU_WEDDING', title: '💍 Wedding Portfolio' },
          { id: 'MENU_CHECK_DATE', title: '📅 Check Availability' }
        ]
      };
    }

    // Default / Greeting with Department Routing
    return {
      type: 'interactive_list',
      header: 'Creative Monks Studio',
      body: `Hello ${senderName || ''}! 📸 Welcome to Creative Monks (Kolkata).\n\nWe specialize in fine-art wedding stories and cinematic films. Choose a service or department below:`,
      buttonTitle: 'Select Service',
      sections: [
        {
          title: 'Weddings & Family (Line 1: +91 70037 97652)',
          rows: [
            { id: 'MENU_WEDDING', title: '💍 Wedding & Pre-Wedding', description: 'Candid photo & cinematic 4K film packages' },
            { id: 'MENU_CHECK_DATE', title: '📅 Check Date Availability', description: 'Reserve your wedding or shoot date' },
            { id: 'MENU_FAMILY', title: '👶 Rice Ceremony & Baby', description: 'Annaprashan & family milestones' }
          ]
        },
        {
          title: 'Commercial & Support (Line 2: +91 90385 16799)',
          rows: [
            { id: 'MENU_COMMERCIAL', title: '🎬 Fashion & Commercial', description: 'Brand campaigns & fashion lookbooks' },
            { id: 'MENU_DELIVERY', title: '🖼️ Album & Video Status', description: 'Deliverable tracking & editing updates' }
          ]
        }
      ]
    };
  }
}

module.exports = new CreativeMonksFlow();
