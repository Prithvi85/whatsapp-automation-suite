/**
 * Multi-Brand WhatsApp Configuration & Automation Registry
 * Supporting:
 * 1. Ritika Jaiswal Fashion (www.ritikajaiswalfashion.com)
 * 2. PS DigiLabs (www.psdigilabs.in)
 * 3. Creative Monks (www.creativemonks.in)
 */

module.exports = {
  brands: {
    'ritika-jaiswal': {
      id: 'ritika-jaiswal',
      name: 'Ritika Jaiswal Fashion',
      tagline: 'Luxury Couture & Bridal Atelier',
      website: 'https://www.ritikajaiswalfashion.com',
      domain: 'ritikajaiswalfashion.com',
      // Primary WhatsApp number (configurable via env RITIKA_WHATSAPP_NUMBER)
      // Note: User provided +91923759949 (9 digits). Can be updated in .env if 10th digit is needed.
      phone: process.env.RITIKA_WHATSAPP_NUMBER || '91923759949',
      displayPhone: '+91 92375 9949',
      metaPhoneNumberId: process.env.RITIKA_PHONE_NUMBER_ID || '',
      location: '12B Camac Street, Kolkata, West Bengal 700017',
      branding: {
        primaryColor: '#B89058', // Champagne Gold
        secondaryColor: '#1A1A1A',
        textColor: '#FFFFFF',
        avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=120&auto=format&fit=crop&q=80',
        badge: 'Couture Concierge'
      },
      welcomeGreeting: 'Namaste! Welcome to Ritika Jaiswal Atelier. How may our couture team assist your bridal or festive wardrobe today?',
      quickReplies: [
        { id: 'rj_lookbook', title: '👗 View Lookbook & Catalog', payload: 'MENU_LOOKBOOK' },
        { id: 'rj_appointment', title: '📅 Book Atelier Visit (Camac St)', payload: 'MENU_APPOINTMENT' },
        { id: 'rj_bespoke', title: '✨ Custom Bridal Consultation', payload: 'MENU_BESPOKE' },
        { id: 'rj_order_status', title: '📦 Track My Order', payload: 'MENU_ORDER_STATUS' },
        { id: 'rj_stylist', title: '👩‍💼 Chat with Fashion Stylist', payload: 'MENU_STYLIST' }
      ],
      automatedResponses: {
        MENU_LOOKBOOK: `✨ *Ritika Jaiswal Couture Lookbook*\n\nExplore our latest collections of bespoke bridal lehengas, reception ensembles, and luxury ready-to-wear.\n\n📖 Digital Lookbook: https://www.ritikajaiswalfashion.com/lookbook\n✨ Bridal Collection: https://www.ritikajaiswalfashion.com/bridal\n\nWould you like to book a private viewing or speak with our atelier stylist?`,
        MENU_APPOINTMENT: `📅 *Flagship Atelier Appointment Booking*\n\n📍 *Location:* 12B Camac Street, Kolkata - 700017\n🕒 *Timings:* Mon - Sat | 11:00 AM - 7:30 PM (By Appointment Only)\n\nPlease reply with:\n1. Your Full Name\n2. Preferred Date & Time\n3. Occasion (Bridal / Engagement / Cocktail / Festive)\n\nOur concierge will confirm your private slot immediately.`,
        MENU_BESPOKE: `✨ *Bespoke Bridal & Custom Orders*\n\nEvery piece at Ritika Jaiswal is crafted with intricate hand-embroidery and tailored to perfection.\n\n• Turnaround Time: 4 to 8 weeks for bridal couture\n• Worldwide White-Glove Shipping Available\n• Custom Sizing & Fabric Swatch Consultation\n\nPlease send us an image or describe your vision, and our senior master designer will assist you.`,
        MENU_ORDER_STATUS: `📦 *Ritika Jaiswal Order Tracking*\n\nPlease reply with your *Order Number* (e.g. RJ-2026-1042) or the email ID used during checkout. Our client relations team will share live tracking and dispatch updates with you.`,
        MENU_STYLIST: `👩‍💼 *Personal Stylist Connected*\n\nA member of our luxury styling team at Camac Street has been alerted and will join this chat in a few moments. Feel free to send screenshots or queries in the meantime!`
      }
    },

    'ps-digilabs': {
      id: 'ps-digilabs',
      name: 'PS DigiLabs',
      tagline: 'Digital Transformation & Performance Lab',
      website: 'https://www.psdigilabs.in',
      domain: 'psdigilabs.in',
      phone: process.env.PS_WHATSAPP_NUMBER || '916289482083',
      displayPhone: '+91 62894 82083',
      metaPhoneNumberId: process.env.PS_PHONE_NUMBER_ID || '',
      branding: {
        primaryColor: '#0066FF', // Royal Electric Blue
        secondaryColor: '#0F172A',
        textColor: '#FFFFFF',
        avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
        badge: 'Online • Quick Reply'
      },
      welcomeGreeting: 'Hello! Welcome to PS DigiLabs. We build high-converting websites, software, and scalable digital marketing funnels. How can we elevate your business today?',
      quickReplies: [
        { id: 'ps_services', title: '💻 Services & Tech Stack', payload: 'MENU_SERVICES' },
        { id: 'ps_audit', title: '📊 Free Website / SEO Audit', payload: 'MENU_AUDIT' },
        { id: 'ps_quote', title: '💰 Get Instant Project Quote', payload: 'MENU_QUOTE' },
        { id: 'ps_discovery', title: '📞 Schedule 15-Min Strategy Call', payload: 'MENU_DISCOVERY' },
        { id: 'ps_human', title: '👨‍💻 Speak with a Tech Lead', payload: 'MENU_HUMAN' }
      ],
      automatedResponses: {
        MENU_SERVICES: `🚀 *PS DigiLabs Digital Solutions:*\n\n1. 🌐 *Custom Web & Web App Development* (React, Next.js, WordPress, Shopify, Node.js)\n2. 📱 *Mobile App Development* (iOS & Android)\n3. 📈 *Performance Marketing & Google/Meta Ads*\n4. 🔍 *SEO & Conversion Rate Optimization (CRO)*\n5. ⚙️ *Custom Automation & CRM / WhatsApp APIs*\n\nReply with the service number (1-5) or your requirement to receive our portfolio & case studies!`,
        MENU_AUDIT: `📊 *Claim Your Instant Automated Digital Audit:*\n\nSimply reply with your *Website URL* (e.g. yourcompany.com) and your primary business goal (Leads / Sales / Traffic).\n\nOur automated audit engine will analyze your website speed, technical SEO, schema, and conversion readiness and send your interactive report immediately!`,
        MENU_QUOTE: `💰 *Instant Project Quotation:*\n\nPlease reply with a quick summary:\n• Project Type: (Website / E-commerce / Mobile App / Digital Marketing)\n• Target Launch Timeline:\n• Estimated Budget Bracket:\n\nWe will prepare an itemized scope and proposal for you promptly.`,
        MENU_DISCOVERY: `📞 *Schedule a Strategy Consultation:*\n\nPick a time that suits you or reply with your preferred day/time slot.\n🗓️ Direct Calendar: https://calendly.com/psdigilabs/discovery\n\nOr reply 'CALL ME' with your preferred time, and our director will dial you directly.`,
        MENU_HUMAN: `👨‍💻 *Connecting to Tech Consultant:*\n\nOur engineering and growth team lead has received your request and will reply right here within 5-10 minutes.`
      }
    },

    'creative-monks': {
      id: 'creative-monks',
      name: 'Creative Monks',
      tagline: 'Artisanal Wedding Photography & Cinematography',
      website: 'https://www.creativemonks.in',
      domain: 'creativemonks.in',
      // Creative Monks has two numbers:
      // Line 1: 7003797652 (Wedding & Event Photography / Bookings)
      // Line 2: 9038516799 (Commercial, Pre-wedding, Client Deliverables & Support)
      primaryPhone: process.env.CREATIVE_MONKS_PRIMARY_PHONE || '917003797652',
      secondaryPhone: process.env.CREATIVE_MONKS_SECONDARY_PHONE || '919038516799',
      displayPhone: '+91 70037 97652 / +91 90385 16799',
      metaPhoneNumberId: process.env.CREATIVE_MONKS_PHONE_NUMBER_ID || '',
      location: '27/A Satyajit Ray Sarani, Rabindra Nagar, Behala, Kolkata 700060',
      departments: [
        {
          id: 'wedding-shoots',
          title: '💍 Weddings & Pre-Weddings',
          description: 'Wedding photography, candid films, pre-wedding & rice ceremonies',
          phone: '917003797652',
          displayPhone: '+91 70037 97652',
          leadRep: 'Creative Team 1 (Wedding Bookings)'
        },
        {
          id: 'commercial-support',
          title: '🎬 Commercial Shoots & Client Support',
          description: 'Commercial films, fashion shoots, album delivery & photo editing status',
          phone: '919038516799',
          displayPhone: '+91 90385 16799',
          leadRep: 'Creative Team 2 (Production & Post)'
        }
      ],
      branding: {
        primaryColor: '#D9534F', // Warm Terracotta / Coral
        secondaryColor: '#1F2421',
        textColor: '#FFFFFF',
        avatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=120&auto=format&fit=crop&q=80',
        badge: 'Studio Active'
      },
      welcomeGreeting: 'Hello & Welcome to Creative Monks! 📸 We capture heartfelt wedding stories, cinematic films, and milestone celebrations across India. How can we make your moments unforgettable?',
      quickReplies: [
        { id: 'cm_weddings', title: '💍 Wedding & Pre-Wedding Packages', payload: 'MENU_WEDDING' },
        { id: 'cm_dates', title: '📅 Check Date Availability', payload: 'MENU_CHECK_DATE' },
        { id: 'cm_family', title: '👶 Rice Ceremony & Baby Shoots', payload: 'MENU_FAMILY' },
        { id: 'cm_commercial', title: '🎬 Fashion & Commercial Shoots', payload: 'MENU_COMMERCIAL' },
        { id: 'cm_album_status', title: '🖼️ Album & Video Delivery Status', payload: 'MENU_DELIVERY' }
      ],
      automatedResponses: {
        MENU_WEDDING: `💍 *Creative Monks Wedding & Pre-Wedding Collections:*\n\nWe offer complete bespoke coverage:\n• Traditional & Candid Wedding Photography\n• 4K Cinematic Wedding Films & Teaser Trailers\n• Drone Aerial Coverage & Pre-Wedding Conceptual Shoots\n• Premium Flush-Mount Canvera/Leather Photobooks\n\n✨ View our portfolio: https://www.creativemonks.in\n\nTo check customized package pricing, please share:\n1. Wedding Dates & City\n2. Estimated Number of Events (Haldi, Mehendi, Sangeet, Wedding, Reception).`,
        MENU_CHECK_DATE: `📅 *Wedding Date Availability Check:*\n\nWe book a limited number of weddings per season to preserve creative excellence.\n\nPlease reply with:\n• Bride & Groom Name:\n• Event Date(s):\n• Venue / City:\n\nOur lead booking manager (+91 70037 97652) will instantly verify calendar availability.`,
        MENU_FAMILY: `👶 *Rice Ceremony & Milestone Celebrations:*\n\nCelebrate your family's precious milestones with our dedicated candid team.\n• Annaprashan / Rice Ceremony Coverage\n• Maternity & Newborn Shoots\n• Birthday & Anniversary Documentation\n\nReply with your event date and location for our celebration rate card!`,
        MENU_COMMERCIAL: `🎬 *Commercial & Fashion Cinematography:*\n\nFor commercial brand campaigns, fashion lookbooks, and corporate films, our second production line handles your technical brief.\n\n📲 Direct WhatsApp: https://wa.me/919038516799 (+91 90385 16799)\n\nPlease share your brand name, deliverable requirements, and shoot timeline.`,
        MENU_DELIVERY: `🖼️ *Client Post-Production & Album Status:*\n\nCongratulations again on your shoot!\n\nFor RAW file selection links, teaser updates, or printed album dispatch tracking, please reply with your *Event Booking ID or Name & Wedding Date*.\n\nOur post-production desk (+91 90385 16799) will pull up your edit queue immediately.`
      }
    }
  }
};
