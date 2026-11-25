/**
 * Automation Flow: PS DigiLabs (www.psdigilabs.in)
 * Number: +916289482083
 * Specialization: Custom Web & Mobile Development, SEO & Performance Marketing, Cloud & Automation
 */

const brandsConfig = require('../../config/brands.config');
const siteAuditService = require('../services/siteAuditService');
const brand = brandsConfig.brands['ps-digilabs'];

class PSDigiLabsFlow {
  constructor() {
    this.brand = brand;
  }

  async handleInbound(messageText, buttonPayload, senderPhone, senderName) {
    const text = (messageText || '').toLowerCase().trim();
    const payload = buttonPayload || '';
    const extractedUrl = siteAuditService.extractUrlFromText(messageText);

    // 0. Instant Automated Website / SEO Audit when a URL is provided
    if (extractedUrl && (!payload || payload === 'MENU_AUDIT')) {
      try {
        const audit = await siteAuditService.runAudit(extractedUrl, {
          goal: text.includes('sale') || text.includes('ecom') ? 'E-Commerce Sales' : 'Leads & Conversions',
          requester: {
            name: senderName || '',
            phone: senderPhone || ''
          }
        });

        return {
          type: 'text',
          text: siteAuditService.formatWhatsAppAuditSummary(audit),
          audit,
          followUpButtons: [
            { id: 'MENU_QUOTE', title: '💰 Get Full Scope' },
            { id: 'MENU_DISCOVERY', title: '📞 Book Strategy Call' },
            { id: 'MENU_HUMAN', title: '👨‍💻 Speak to Tech Lead' }
          ]
        };
      } catch (err) {
        return {
          type: 'text',
          text: `⚠️ *Could Not Complete Automated Audit for* \`${extractedUrl}\`\n\n` +
            `Reason: ${err.message}\n\n` +
            `Please reply with a public website URL (e.g. *https://yourcompany.com*) or connect with our engineering team directly.`,
          followUpButtons: [
            { id: 'MENU_AUDIT', title: '📊 Try Another URL' },
            { id: 'MENU_HUMAN', title: '👨‍💻 Speak to Tech Lead' }
          ]
        };
      }
    }

    // 1. Services Menu
    if (payload === 'MENU_SERVICES' || text.includes('service') || text.includes('web') || text.includes('development') || text.includes('app') || text.includes('react') || text.includes('software')) {
      return {
        type: 'text',
        text: `🚀 *PS DigiLabs Technical Capabilities & Solutions*\n\n` +
          `We engineer high-performance digital products and scalable marketing funnels:\n\n` +
          `1. 🌐 *Web & E-Commerce:* React, Next.js, Node.js, Shopify, WooCommerce\n` +
          `2. 📱 *Mobile Apps:* Cross-platform iOS & Android (React Native, Flutter)\n` +
          `3. 📈 *Performance Marketing:* Google Ads, Meta Ads, Funnel CRO\n` +
          `4. 🔍 *SEO & Growth:* Technical site audits, backlink architecture, PageSpeed 90+\n` +
          `5. 🤖 *Automation & APIs:* WhatsApp Business Cloud API, CRM integrations\n\n` +
          `What type of project are you planning?`,
        followUpButtons: [
          { id: 'MENU_QUOTE', title: '💰 Get Instant Quote' },
          { id: 'MENU_AUDIT', title: '📊 Free Website Audit' },
          { id: 'MENU_DISCOVERY', title: '📞 Schedule Call' }
        ]
      };
    }

    // 2. Free Website / SEO Audit
    if (payload === 'MENU_AUDIT' || text.includes('audit') || text.includes('seo') || text.includes('ranking') || text.includes('speed') || text.includes('analyze')) {
      return {
        type: 'text',
        text: `📊 *Complimentary Website & SEO Audit*\n\n` +
          `Our automated engine + technical team analyzes your website across:\n` +
          `• Core Web Vitals & Server Response Speed\n` +
          `• On-Page, Schema & Technical SEO indexing\n` +
          `• Mobile UI/UX & Lead-Conversion Readiness\n\n` +
          `Simply reply with your *Website URL* (e.g. *https://yourcompany.com*) to receive your *instant live score, interactive report, and copy-paste SEO patch* in ~15 seconds!`,
        followUpButtons: [
          { id: 'MENU_QUOTE', title: '💰 Estimate Project' },
          { id: 'MENU_HUMAN', title: '👨‍💻 Speak to Tech Lead' }
        ]
      };
    }

    // 3. Instant Project Quote
    if (payload === 'MENU_QUOTE' || text.includes('quote') || text.includes('cost') || text.includes('price') || text.includes('pricing') || text.includes('estimate') || text.includes('budget')) {
      return {
        type: 'text',
        text: `💰 *Instant Project Quotation & Scope Assessment*\n\n` +
          `To provide you an accurate roadmap and milestone pricing, please share:\n\n` +
          `• *Project Type:* (Website / Mobile App / E-commerce / SEO Marketing)\n` +
          `• *Target Timeline:* (Urgent / 1 Month / Flexible)\n` +
          `• *Key Features:* (e.g. Payment Gateway, Admin Dashboard, User Auth)\n` +
          `• *Estimated Budget Bracket:*\n\n` +
          `Our senior solutions architect will compile a scope sheet and reach out right away.`,
        followUpButtons: [
          { id: 'MENU_DISCOVERY', title: '📞 Book Strategy Call' },
          { id: 'MENU_HUMAN', title: '👨‍💻 Chat with Architect' }
        ]
      };
    }

    // 4. Discovery Call / Strategy Session
    if (payload === 'MENU_DISCOVERY' || text.includes('call') || text.includes('meeting') || text.includes('zoom') || text.includes('consultation')) {
      return {
        type: 'text',
        text: `📞 *Schedule a 15-Minute Technical Strategy Call*\n\n` +
          `Discuss your requirements directly with our technical founder:\n\n` +
          `📅 *Book Directly on Calendar:* https://calendly.com/psdigilabs/discovery\n\n` +
          `Or simply reply with your preferred time slot (e.g. *Today 4:00 PM* or *Tomorrow 11:00 AM*), and we will confirm the meeting link.`,
        followUpButtons: [
          { id: 'MENU_SERVICES', title: '💻 Explore Services' },
          { id: 'MENU_QUOTE', title: '💰 Get Quote First' }
        ]
      };
    }

    // 5. Speak with Tech Lead
    if (payload === 'MENU_HUMAN' || text.includes('human') || text.includes('talk') || text.includes('support')) {
      return {
        type: 'text',
        text: `👨‍💻 *Connecting to PS DigiLabs Technical Lead*\n\n` +
          `Our engineering team has been notified (+91 62894 82083). A specialist will respond right here shortly.\n\n` +
          `You may drop any project documents, wireframes, or reference URLs in this chat in the meantime!`,
        followUpButtons: [
          { id: 'MENU_SERVICES', title: '💻 Services' },
          { id: 'MENU_QUOTE', title: '💰 Quick Quote' }
        ]
      };
    }

    // Default / Greeting
    return {
      type: 'interactive_list',
      header: 'PS DigiLabs Tech Concierge',
      body: `Hello ${senderName || ''}! 👋 Welcome to PS DigiLabs.\n\nWe design, develop, and scale high-performance websites, apps, and digital growth engines. How can we help you?`,
      buttonTitle: 'Choose Option',
      sections: [
        {
          title: 'PS DigiLabs Solutions',
          rows: [
            { id: 'MENU_SERVICES', title: '💻 Web & App Development', description: 'React, Next.js, Flutter, E-commerce' },
            { id: 'MENU_AUDIT', title: '📊 Free Website/SEO Audit', description: 'Get actionable performance insights' },
            { id: 'MENU_QUOTE', title: '💰 Get Project Quotation', description: 'Receive scope breakdown & pricing' },
            { id: 'MENU_DISCOVERY', title: '📞 Schedule Strategy Call', description: '15-min consultation with tech lead' },
            { id: 'MENU_HUMAN', title: '👨‍💻 Speak with Engineer', description: 'Direct human assistance' }
          ]
        }
      ]
    };
  }
}

module.exports = new PSDigiLabsFlow();
