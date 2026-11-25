/**
 * Frontend Interactive Console & Simulator Driver with WhatsApp Web Gateway Polling
 */

const brandsData = {
  'ritika-jaiswal': {
    id: 'ritika-jaiswal',
    name: 'Ritika Jaiswal Fashion',
    tagline: 'Luxury Couture & Bridal Atelier',
    website: 'https://www.ritikajaiswalfashion.com',
    domain: 'ritikajaiswalfashion.com',
    phone: '91923759949',
    displayPhone: '+91 92375 9949',
    badge: 'Couture Concierge',
    avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=120&auto=format&fit=crop&q=80',
    welcomeGreeting: 'Namaste! Welcome to Ritika Jaiswal Atelier. Looking for bespoke bridal lehengas, reception wear, or an atelier visit at 12B Camac Street, Kolkata?',
    waLink: 'https://wa.me/91923759949?text=' + encodeURIComponent('Namaste Ritika Jaiswal Atelier, I would like to inquire about couture bridal collections from your website.'),
    features: [
      'Universal Floating WhatsApp Chat Widget (Branded in Champagne Gold)',
      'Bespoke Bridal Lehengas & Couture Lookbook Instant Download',
      'Camac Street Flagship Atelier Appointment Scheduling',
      'E-commerce Product Detail Page "Inquire on WhatsApp" Custom Sizing Trigger',
      'Order Status & White-Glove Dispatch Tracking',
      'VIP Personal Stylist Live Chat Escalation'
    ],
    embedSnippet: `<!-- Ritika Jaiswal Fashion (www.ritikajaiswalfashion.com) WhatsApp Integration -->
<script>
  window.WA_BRAND_CONFIG = {
    id: 'ritika-jaiswal',
    name: 'Ritika Jaiswal Atelier',
    tagline: 'Luxury Couture & Bridal • Camac St, Kolkata',
    phone: '91923759949',
    branding: {
      primaryColor: '#B89058',
      avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=120&auto=format&fit=crop&q=80'
    },
    welcomeGreeting: 'Namaste! Welcome to Ritika Jaiswal Atelier. How may our couture team assist your bridal wardrobe today?',
    quickReplies: [
      { title: '👗 View Lookbook & Catalog' },
      { title: '📅 Book Atelier Visit (Camac St)' },
      { title: '✨ Custom Bridal Consultation' },
      { title: '📦 Track My Order' },
      { title: '👩‍💼 Chat with Fashion Stylist' }
    ]
  };
</script>
<script src="https://your-domain.com/widgets/whatsapp-widget.js" async></script>
<script src="https://your-domain.com/widgets/ritika-jaiswal/product-inquiry.js" async></script>`,
    quickOptions: [
      { id: 'MENU_LOOKBOOK', title: '👗 View Lookbook' },
      { id: 'MENU_APPOINTMENT', title: '📅 Book Atelier Visit' },
      { id: 'MENU_BESPOKE', title: '✨ Custom Bridal' },
      { id: 'MENU_ORDER_STATUS', title: '📦 Track Order' },
      { id: 'MENU_STYLIST', title: '👩‍💼 Speak to Stylist' }
    ]
  },

  'ps-digilabs': {
    id: 'ps-digilabs',
    name: 'PS DigiLabs',
    tagline: 'Digital Transformation & Performance Lab',
    website: 'https://www.psdigilabs.in',
    domain: 'psdigilabs.in',
    phone: '916289482083',
    displayPhone: '+91 62894 82083',
    badge: 'Online • Quick Reply',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    welcomeGreeting: 'Hello! 👋 Welcome to PS DigiLabs. We build high-converting websites, web apps, and scalable digital marketing funnels. How can we elevate your brand?',
    waLink: 'https://wa.me/916289482083?text=' + encodeURIComponent('Hello PS DigiLabs, I visited psdigilabs.in and would like to discuss a software/marketing project.'),
    features: [
      'Universal Floating WhatsApp Widget (Branded in Electric Tech Blue)',
      'Digital Services Menu (React/Next.js Web, Mobile Apps, Growth Ads, SEO)',
      'Free Technical Website & SEO Audit Request Pipeline',
      'Instant Project Scope & Quotation Estimator Modal',
      '15-Minute Technical Strategy Discovery Call Booking',
      'Direct Escalation to Solutions Architect (+91 62894 82083)'
    ],
    embedSnippet: `<!-- PS DigiLabs (www.psdigilabs.in) WhatsApp Integration -->
<script>
  window.WA_BRAND_CONFIG = {
    id: 'ps-digilabs',
    name: 'PS DigiLabs Tech Concierge',
    tagline: 'Online • Web, App & Performance Lab',
    phone: '916289482083',
    branding: {
      primaryColor: '#0066FF',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80'
    },
    welcomeGreeting: 'Hi there! 👋 Looking to build a website, app, or scale marketing?',
    quickReplies: [
      { title: '💻 Services & Tech Stack' },
      { title: '📊 Free Website / SEO Audit' },
      { title: '💰 Get Instant Project Quote' },
      { title: '📞 Schedule Strategy Call' },
      { title: '👨‍💻 Speak with Tech Lead' }
    ]
  };
</script>
<script src="https://your-domain.com/widgets/whatsapp-widget.js" async></script>
<script src="https://your-domain.com/widgets/ps-digilabs/quote-calculator.js" async></script>
<script src="https://your-domain.com/widgets/ps-digilabs/audit-widget.js" async></script>`,Target:
    quickOptions: [
      { id: 'MENU_SERVICES', title: '💻 Services & Tech' },
      { id: 'MENU_AUDIT', title: '📊 Free SEO Audit' },
      { id: 'MENU_QUOTE', title: '💰 Get Quote' },
      { id: 'MENU_DISCOVERY', title: '📞 Schedule Call' },
      { id: 'MENU_HUMAN', title: '👨‍💻 Speak to Lead' }
    ]
  },

  'creative-monks': {
    id: 'creative-monks',
    name: 'Creative Monks',
    tagline: 'Artisanal Wedding Photography & Cinematography',
    website: 'https://www.creativemonks.in',
    domain: 'creativemonks.in',
    displayPhone: '+91 70037 97652 / +91 90385 16799',
    badge: 'Dual-Line Studio',
    avatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=120&auto=format&fit=crop&q=80',
    welcomeGreeting: 'Hello & Welcome to Creative Monks! 📸 We capture heartfelt wedding stories, cinematic films, and milestone celebrations across India.',
    waLink: 'https://wa.me/917003797652?text=' + encodeURIComponent('Hello Creative Monks, I saw your wedding portfolio on creativemonks.in and want to check shoot availability.'),
    features: [
      'Multi-Line / Dual Department Switcher Widget',
      'Line 1 (+91 70037 97652): Wedding & Pre-Wedding Shoots & Rice Ceremony Bookings',
      'Line 2 (+91 90385 16799): Commercial/Fashion Shoots & Album/Deliverables Tracking',
      'Interactive Wedding Date Availability Checker Modal',
      'Cinematic Portfolio & Teaser Showcase Delivery',
      'Studio Location Connector (27/A Satyajit Ray Sarani, Behala, Kolkata)'
    ],
    embedSnippet: `<!-- Creative Monks (www.creativemonks.in) Dual-Line WhatsApp Integration -->
<script>
  window.WA_BRAND_CONFIG = {
    id: 'creative-monks',
    name: 'Creative Monks Studio',
    tagline: 'Artisanal Wedding & Commercial Cinematography',
    departments: [
      {
        id: 'wedding-shoots',
        title: '💍 Weddings & Pre-Weddings',
        description: 'Wedding photography, films & rice ceremonies',
        phone: '917003797652',
        displayPhone: '+91 70037 97652'
      },
      {
        id: 'commercial-support',
        title: '🎬 Commercial & Client Support',
        description: 'Brand films, fashion shoots, album & video status',
        phone: '919038516799',
        displayPhone: '+91 90385 16799'
      }
    ],
    branding: {
      primaryColor: '#D9534F',
      avatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=120&auto=format&fit=crop&q=80'
    },
    welcomeGreeting: 'Hello! 📸 Choose Wedding Bookings (+91 70037 97652) or Commercial / Client Support (+91 90385 16799).',
    quickReplies: [
      { title: '💍 Wedding & Pre-Wedding Packages' },
      { title: '📅 Check Date Availability' },
      { title: '👶 Rice Ceremony & Baby Shoots' },
      { title: '🎬 Fashion & Commercial Shoots' },
      { title: '🖼️ Album & Video Delivery Status' }
    ]
  };
</script>
<script src="https://your-domain.com/widgets/whatsapp-widget.js" async></script>
<script src="https://your-domain.com/widgets/creative-monks/date-checker.js" async></script>`,
    quickOptions: [
      { id: 'MENU_WEDDING', title: '💍 Wedding Packages' },
      { id: 'MENU_CHECK_DATE', title: '📅 Check Date' },
      { id: 'MENU_FAMILY', title: '👶 Rice Ceremony' },
      { id: 'MENU_COMMERCIAL', title: '🎬 Commercial (Line 2)' },
      { id: 'MENU_DELIVERY', title: '🖼️ Album Status (Line 2)' }
    ]
  }
};

let currentBrandId = 'ritika-jaiswal';

document.addEventListener('DOMContentLoaded', () => {
  initBrandSwitching();
  initTabs();
  initChatSimulator();
  initDashboardAuditForm();
  loadBrandView(currentBrandId);
  fetchLeads();
  fetchAuditsAndOrders();
  initGatewayPolling();
  setInterval(fetchLeads, 8000);
  setInterval(fetchAuditsAndOrders, 10000);
});

function initBrandSwitching() {
  const cards = document.querySelectorAll('.nav-brand-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentBrandId = card.getAttribute('data-brand');
      loadBrandView(currentBrandId);
    });
  });
}

function loadBrandView(brandId) {
  const brand = brandsData[brandId];
  if (!brand) return;

  // Header
  document.getElementById('brand-header-title').innerText = brand.name;
  document.getElementById('brand-header-desc').innerText = brand.tagline;
  document.getElementById('brand-website-link').href = brand.website;
  document.getElementById('brand-website-link').innerText = `Visit ${brand.domain} ↗`;

  // "Open in WhatsApp" Link
  const realWaBtn = document.getElementById('btn-open-real-wa');
  realWaBtn.href = brand.waLink;

  // Simulator Meta
  document.getElementById('sim-phone-badge').innerText = brand.displayPhone;
  document.getElementById('mockup-avatar').src = brand.avatar;
  document.getElementById('mockup-title').innerText = brand.name;
  document.getElementById('mockup-sub').innerText = `Online • ${brand.badge}`;

  // Quick chips
  const chipsContainer = document.getElementById('mockup-quick-chips');
  chipsContainer.innerHTML = '';
  brand.quickOptions.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'mockup-chip';
    chip.innerText = opt.title;
    chip.addEventListener('click', () => {
      sendSimulatorMessage(opt.title, opt.id);
    });
    chipsContainer.appendChild(chip);
  });

  // Features list
  const featureList = document.getElementById('brand-feature-list');
  featureList.innerHTML = brand.features.map(f => `<li>${f}</li>`).join('');

  // Embed Snippet Code Block
  document.getElementById('embed-code-block').innerText = brand.embedSnippet;

  // Automation Specs Tab
  renderAutomationSpecs(brand);

  // Reset simulator with brand welcome message
  resetSimulator(brand);
}

function renderAutomationSpecs(brand) {
  const container = document.getElementById('flow-specs-content');
  let specsHtml = `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:16px;">
        <h4 style="font-size:14px; margin-bottom:8px; color:#25D366;">1. Verified Phone Numbers & Routing</h4>
        <p style="font-size:13px; color:#9CA3AF;">Primary WhatsApp Number: <strong style="color:#FFF;">${brand.displayPhone}</strong></p>
        <p style="font-size:13px; color:#9CA3AF; margin-top:4px;">Webhook Domain Matching: <strong style="color:#FFF;">${brand.domain}</strong></p>
      </div>

      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:16px;">
        <h4 style="font-size:14px; margin-bottom:8px; color:#25D366;">2. Automated Intent Tree</h4>
        <ul style="padding-left:18px; font-size:13px; color:#D1D5DB; display:flex; flex-direction:column; gap:6px;">
          ${brand.quickOptions.map(opt => `<li><strong>${opt.title}</strong> (Payload: <code>${opt.id}</code>)</li>`).join('')}
        </ul>
      </div>

      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:16px;">
        <h4 style="font-size:14px; margin-bottom:8px; color:#25D366;">3. Meta Cloud API Endpoints</h4>
        <p style="font-size:12.5px; color:#9CA3AF; font-family:'JetBrains Mono', monospace;">POST https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages</p>
      </div>
    </div>
  `;
  container.innerHTML = specsHtml;
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const tabId = 'tab-' + btn.getAttribute('data-tab');
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  document.getElementById('btn-copy-embed').addEventListener('click', () => {
    const code = document.getElementById('embed-code-block').innerText;
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById('btn-copy-embed');
      btn.innerText = 'Copied!';
      setTimeout(() => { btn.innerText = 'Copy Code'; }, 2000);
    });
  });
}

function initChatSimulator() {
  const input = document.getElementById('mockup-input');
  const sendBtn = document.getElementById('mockup-send');
  const resetBtn = document.getElementById('sim-reset-btn');

  function handleSend() {
    const val = input.value.trim();
    if (!val) return;
    sendSimulatorMessage(val, '');
    input.value = '';
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  resetBtn.addEventListener('click', () => {
    resetSimulator(brandsData[currentBrandId]);
  });
}

function resetSimulator(brand) {
  const messagesContainer = document.getElementById('mockup-messages');
  messagesContainer.innerHTML = '';
  appendBotBubble(brand.welcomeGreeting, brand.quickOptions);
}

function appendUserBubble(text) {
  const messagesContainer = document.getElementById('mockup-messages');
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble msg-user';
  bubble.innerHTML = `
    <div>${escapeHtml(text)}</div>
    <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  messagesContainer.appendChild(bubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function appendBotBubble(text, actionButtons = []) {
  const messagesContainer = document.getElementById('mockup-messages');
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble msg-bot';

  let actionsHtml = '';
  if (actionButtons && actionButtons.length) {
    actionsHtml = `
      <div class="sim-actions">
        ${actionButtons.map(btn => `
          <button class="sim-action-btn" data-payload="${btn.id || ''}" data-title="${btn.title}">
            ${btn.title}
          </button>
        `).join('')}
      </div>
    `;
  }

  bubble.innerHTML = `
    <div>${formatWhatsAppMarkdown(text)}</div>
    ${actionsHtml}
    <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;

  messagesContainer.appendChild(bubble);

  // Attach click listeners to action buttons
  bubble.querySelectorAll('.sim-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const payload = btn.getAttribute('data-payload');
      const title = btn.getAttribute('data-title');
      sendSimulatorMessage(title, payload);
    });
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendSimulatorMessage(text, payload = '') {
  appendUserBubble(text);

  try {
    const res = await fetch('/api/brands/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandId: currentBrandId,
        messageText: text,
        buttonPayload: payload,
        senderName: 'Demo Customer',
        senderPhone: '+91 98000 12345'
      })
    });

    const data = await res.json();
    if (data.success && data.data && data.data.response) {
      const resp = data.data.response;
      setTimeout(() => {
        if (resp.type === 'interactive_list') {
          const listOptions = (resp.sections && resp.sections[0] ? resp.sections[0].rows : []);
          appendBotBubble(resp.body, listOptions);
        } else {
          appendBotBubble(resp.text, resp.followUpButtons || []);
        }
      }, 400);
      fetchLeads();
    }
  } catch (e) {
    console.error('Simulator error:', e);
  }
}

async function fetchLeads() {
  try {
    const res = await fetch('/api/leads');
    const data = await res.json();
    if (data.success) {
      const leads = data.leads || [];
      document.getElementById('active-leads-count').innerText = `Captured Leads: ${leads.length}`;

      const tbody = document.getElementById('leads-tbody');
      if (leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color:#6B7280;">No leads captured yet. Send a message in the simulator!</td></tr>`;
        return;
      }

      tbody.innerHTML = leads.map(l => `
        <tr>
          <td style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#9CA3AF;">${new Date(l.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</td>
          <td><strong>${escapeHtml(l.customerName)}</strong><br><span style="font-size:10px; color:#9CA3AF;">${escapeHtml(l.brandName)}</span></td>
          <td style="font-family:'JetBrains Mono', monospace;">${escapeHtml(l.phone || 'N/A')}</td>
          <td>${escapeHtml(l.message)}</td>
          <td><span style="font-size:11px; background:rgba(37,211,102,0.1); color:#25D366; padding:2px 6px; border-radius:4px;">${escapeHtml(l.source)}</span></td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error('Error fetching leads:', e);
  }
}

function initDashboardAuditForm() {
  const form = document.getElementById('dashboard-audit-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('dash-audit-url');
    const goalSelect = document.getElementById('dash-audit-goal');
    const btn = document.getElementById('dash-audit-btn');
    const feedback = document.getElementById('dash-audit-feedback');

    btn.disabled = true;
    btn.innerText = 'Auditing...';
    feedback.style.display = 'none';

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.value.trim(), goal: goalSelect.value })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to audit URL');
      }
      const a = json.audit;
      feedback.innerHTML = `Audited <strong>${escapeHtml(a.domain)}</strong> &bull; Score: <strong>${a.scores.overall}/100</strong> &bull; <a href="${escapeHtml(a.reportUrl)}" target="_blank" style="color:#38BDF8;text-decoration:underline;">Open Report</a>`;
      feedback.style.display = 'block';
      urlInput.value = '';
      fetchAuditsAndOrders();
      fetchLeads();
    } catch (err) {
      feedback.innerHTML = `<span style="color:#F87171;">${escapeHtml(err.message)}</span>`;
      feedback.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.innerText = 'Run Audit';
    }
  });
}

async function fetchAuditsAndOrders() {
  try {
    const [auditsRes, ordersRes] = await Promise.all([
      fetch('/api/audit?limit=15'),
      fetch('/api/payments/orders?limit=20')
    ]);
    const auditsJson = await auditsRes.json();
    const ordersJson = await ordersRes.json();

    if (ordersJson.success && ordersJson.stats) {
      const s = ordersJson.stats;
      const revEl = document.getElementById('rev-total-usd');
      const countEl = document.getElementById('rev-paid-count');
      const avgEl = document.getElementById('rev-avg-usd');
      if (revEl) revEl.innerText = `$${s.totalRevenueUsd}`;
      if (countEl) countEl.innerText = String(s.totalOrders);
      if (avgEl) avgEl.innerText = `$${s.averageOrderUsd}`;
    }

    if (auditsJson.success) {
      const audits = auditsJson.audits || [];
      const tbody = document.getElementById('audits-tbody');
      if (!tbody) return;
      if (audits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:18px; color:#6B7280;">No site audits yet. Run one above or send a URL in PS DigiLabs chat!</td></tr>';
        return;
      }

      tbody.innerHTML = audits.map((a) => {
        const isPaid = a.paymentStatus === 'PAID';
        const badgeStyle = isPaid
          ? 'background:rgba(16,185,129,0.15);color:#10B981;'
          : 'background:rgba(245,158,11,0.15);color:#F59E0B;';
        return `
          <tr>
            <td><strong>${escapeHtml(a.domain)}</strong></td>
            <td style="font-family:'JetBrains Mono', monospace;">${a.scores?.overall ?? '-'}/100</td>
            <td style="font-family:'JetBrains Mono', monospace;">$${a.offer?.priceUsd ?? '-'}</td>
            <td><span style="font-size:11px;padding:2px 6px;border-radius:4px;${badgeStyle}">${isPaid ? 'PAID' : 'UNPAID'}</span></td>
            <td><a href="${escapeHtml(a.reportUrl)}" target="_blank" style="color:#38BDF8;text-decoration:underline;font-size:12px;">Report &nearr;</a></td>
          </tr>
        `;
      }).join('');
    }
  } catch (e) {
    console.error('Error fetching audits/orders:', e);
  }
}

/**
 * Real WhatsApp Web Phone Gateway Polling
 */
function initGatewayPolling() {
  const qrImg = document.getElementById('gateway-qr-image');
  const qrSpinner = document.getElementById('gateway-qr-spinner');
  const heading = document.getElementById('gateway-heading');
  const desc = document.getElementById('gateway-description');
  const connectedDetails = document.getElementById('gateway-connected-details');
  const connectedNumber = document.getElementById('gateway-connected-number');
  const logoutBtn = document.getElementById('btn-gateway-logout');
  const statusDot = document.getElementById('gateway-status-dot');
  const sidebarDot = document.getElementById('sidebar-gateway-dot');
  const sidebarStatus = document.getElementById('sidebar-gateway-status');

  logoutBtn.addEventListener('click', async () => {
    if (confirm('Disconnect phone and generate fresh WhatsApp QR code?')) {
      await fetch('/api/gateway/logout', { method: 'POST' });
    }
  });

  async function poll() {
    try {
      const res = await fetch('/api/gateway/status');
      const json = await res.json();
      if (json.success && json.data) {
        const gw = json.data;

        if (gw.status === 'CONNECTED') {
          // Connected state
          qrImg.style.display = 'none';
          qrSpinner.style.display = 'none';
          heading.innerText = '🟢 Phone WhatsApp Connected & Automating Live!';
          desc.style.display = 'none';
          connectedDetails.style.display = 'block';
          connectedNumber.innerText = `🟢 Connected to Mobile Phone: ${gw.userPhone || 'Active'}`;
          statusDot.style.background = '#25D366';
          statusDot.style.boxShadow = '0 0 10px #25D366';
          sidebarDot.style.background = '#25D366';
          sidebarStatus.innerText = `Gateway: +${gw.userPhone || 'Active'}`;
        } else if (gw.status === 'QR_READY' && gw.qrDataUrl) {
          // QR Ready state
          qrSpinner.style.display = 'none';
          qrImg.src = gw.qrDataUrl;
          qrImg.style.display = 'block';
          heading.innerText = '📱 Scan to Link Real Phone WhatsApp';
          desc.style.display = 'block';
          connectedDetails.style.display = 'none';
          statusDot.style.background = '#EAB308';
          statusDot.style.boxShadow = '0 0 10px #EAB308';
          sidebarDot.style.background = '#EAB308';
          sidebarStatus.innerText = 'Gateway: Scan QR to Link';
        } else {
          // Initializing
          qrImg.style.display = 'none';
          qrSpinner.style.display = 'block';
          qrSpinner.innerText = 'Starting WhatsApp Session Engine...';
          connectedDetails.style.display = 'none';
          statusDot.style.background = '#3B82F6';
          sidebarStatus.innerText = 'Gateway: Initializing...';
        }
      }
    } catch (e) {
      console.warn('Gateway poll error:', e.message);
    }
  }

  poll();
  setInterval(poll, 2500);
}

function formatWhatsAppMarkdown(text) {
  if (!text) return '';
  return escapeHtml(text)
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<del>$1</del>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
