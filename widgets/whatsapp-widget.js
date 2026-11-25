/**
 * Universal WhatsApp Floating Widget & Lead Connector
 * Works on any website (Shopify, WordPress, Webflow, React, Static HTML)
 * Supports Single Agent and Multi-Agent / Department Switcher
 */
(function (window, document) {
  'use strict';

  function initWhatsAppWidget(options) {
    var brand = options || {};
    var brandId = brand.id || 'default';
    var primaryPhone = brand.phone || (brand.departments && brand.departments[0] ? brand.departments[0].phone : '910000000000');
    var brandName = brand.name || 'Customer Support';
    var tagline = brand.tagline || 'Online • Typically replies instantly';
    var brandColor = (brand.branding && brand.branding.primaryColor) || '#25D366';
    var avatarUrl = (brand.branding && brand.branding.avatar) || 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg';
    var welcomeGreeting = brand.welcomeGreeting || 'Hello! How can we assist you today?';
    var quickReplies = brand.quickReplies || [];
    var departments = brand.departments || null;
    var position = brand.position || 'right'; // 'right' or 'left'
    var prefillMessage = brand.defaultMessage || 'Hello ' + brandName + ', I have an inquiry from ' + window.location.hostname;

    // Check if widget already injected
    if (document.getElementById('wa-widget-container-' + brandId)) return;

    // Style injection
    var style = document.createElement('style');
    style.innerHTML = `
      .wa-widget-root {
        position: fixed;
        bottom: 24px;
        ${position}: 24px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      .wa-launcher-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${brandColor};
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        border: none;
        outline: none;
        position: relative;
      }
      .wa-launcher-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.32);
      }
      .wa-launcher-btn svg {
        width: 32px;
        height: 32px;
        fill: #FFFFFF;
      }
      .wa-badge-pulse {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 14px;
        height: 14px;
        background: #FF3B30;
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        animation: waPulse 2s infinite;
      }
      @keyframes waPulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 59, 48, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); }
      }
      .wa-chat-window {
        display: none;
        position: absolute;
        bottom: 74px;
        ${position}: 0;
        width: 360px;
        max-width: calc(100vw - 32px);
        background: #FFFFFF;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        flex-direction: column;
        animation: waFadeIn 0.22s ease-out forwards;
        border: 1px solid rgba(0,0,0,0.08);
      }
      .wa-chat-window.wa-open {
        display: flex;
      }
      @keyframes waFadeIn {
        from { opacity: 0; transform: translateY(14px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .wa-header {
        background: ${brandColor};
        color: #FFFFFF;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
      }
      .wa-header-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        background: #FFFFFF;
        border: 2px solid rgba(255,255,255,0.3);
      }
      .wa-header-info {
        flex: 1;
      }
      .wa-header-title {
        font-weight: 700;
        font-size: 15px;
        line-height: 1.2;
        margin: 0;
        color: #FFFFFF;
      }
      .wa-header-subtitle {
        font-size: 12px;
        opacity: 0.9;
        margin-top: 3px;
        color: #FFFFFF;
      }
      .wa-close-btn {
        background: transparent;
        border: none;
        color: #FFFFFF;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        opacity: 0.8;
      }
      .wa-close-btn:hover {
        opacity: 1;
      }
      .wa-body {
        padding: 16px;
        background: #ECE5DD;
        background-image: radial-gradient(#d3c7b8 1px, transparent 1px);
        background-size: 16px 16px;
        max-height: 380px;
        overflow-y: auto;
      }
      .wa-bubble {
        background: #FFFFFF;
        padding: 12px 14px;
        border-radius: 4px 14px 14px 14px;
        font-size: 13.5px;
        color: #111827;
        line-height: 1.45;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        margin-bottom: 12px;
        position: relative;
      }
      .wa-bubble-time {
        font-size: 10px;
        color: #9CA3AF;
        text-align: right;
        margin-top: 4px;
      }
      .wa-department-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
      }
      .wa-department-card {
        background: #FFFFFF;
        border-radius: 10px;
        padding: 10px 12px;
        cursor: pointer;
        border: 1px solid #E5E7EB;
        transition: all 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-decoration: none;
      }
      .wa-department-card:hover {
        border-color: ${brandColor};
        background: #F9FAFB;
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      }
      .wa-dept-name {
        font-size: 13px;
        font-weight: 600;
        color: #1F2937;
      }
      .wa-dept-desc {
        font-size: 11px;
        color: #6B7280;
        margin-top: 2px;
      }
      .wa-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }
      .wa-chip {
        font-size: 12px;
        background: #FFFFFF;
        border: 1px solid #D1D5DB;
        color: #374151;
        padding: 6px 10px;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.15s ease;
        text-decoration: none;
        display: inline-block;
      }
      .wa-chip:hover {
        background: ${brandColor};
        color: #FFFFFF;
        border-color: ${brandColor};
      }
      .wa-footer {
        padding: 12px 14px;
        background: #FFFFFF;
        border-top: 1px solid #F3F4F6;
        display: flex;
        gap: 8px;
      }
      .wa-input {
        flex: 1;
        border: 1px solid #E5E7EB;
        border-radius: 20px;
        padding: 8px 14px;
        font-size: 13px;
        outline: none;
      }
      .wa-input:focus {
        border-color: ${brandColor};
      }
      .wa-send-btn {
        background: ${brandColor};
        color: #FFFFFF;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease;
      }
      .wa-send-btn:hover {
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(style);

    // Build DOM
    var container = document.createElement('div');
    container.id = 'wa-widget-container-' + brandId;
    container.className = 'wa-widget-root';

    // HTML Template
    var html = `
      <div class="wa-chat-window" id="wa-window-${brandId}">
        <div class="wa-header">
          <img class="wa-header-avatar" src="${avatarUrl}" alt="${brandName}" />
          <div class="wa-header-info">
            <div class="wa-header-title">${brandName}</div>
            <div class="wa-header-subtitle">${tagline}</div>
          </div>
          <button class="wa-close-btn" id="wa-close-${brandId}">&times;</button>
        </div>

        <div class="wa-body">
          <div class="wa-bubble">
            ${welcomeGreeting}
            <div class="wa-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          ${departments && departments.length ? `
            <div style="font-size: 11px; font-weight: 700; color: #4B5563; text-transform: uppercase; margin-top: 8px; margin-bottom: 4px; letter-spacing: 0.5px;">Select Department:</div>
            <div class="wa-department-list">
              ${departments.map(function(dept) {
                var deptMsg = encodeURIComponent("Hello! I am reaching out to " + dept.title + " via " + window.location.hostname);
                return `
                  <a class="wa-department-card" href="https://wa.me/${dept.phone}?text=${deptMsg}" target="_blank" rel="noopener">
                    <div>
                      <div class="wa-dept-name">${dept.title}</div>
                      <div class="wa-dept-desc">${dept.description}</div>
                      <div style="font-size: 10px; color: ${brandColor}; font-weight: 600; margin-top: 3px;">${dept.displayPhone}</div>
                    </div>
                    <span style="color: #9CA3AF; font-size: 18px;">&rsaquo;</span>
                  </a>
                `;
              }).join('')}
            </div>
          ` : ''}

          ${quickReplies && quickReplies.length ? `
            <div style="font-size: 11px; font-weight: 700; color: #4B5563; text-transform: uppercase; margin-top: 12px; margin-bottom: 6px; letter-spacing: 0.5px;">Quick Options:</div>
            <div class="wa-quick-replies">
              ${quickReplies.map(function(qr) {
                var qrText = encodeURIComponent("Hi, I would like to inquire about: " + qr.title);
                return `<a class="wa-chip" href="https://wa.me/${primaryPhone}?text=${qrText}" target="_blank" rel="noopener">${qr.title}</a>`;
              }).join('')}
            </div>
          ` : ''}
        </div>

        <div class="wa-footer">
          <input type="text" class="wa-input" id="wa-input-${brandId}" placeholder="Type message to chat on WhatsApp..." />
          <button class="wa-send-btn" id="wa-send-${brandId}" title="Open WhatsApp">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <button class="wa-launcher-btn" id="wa-launcher-${brandId}" title="Chat on WhatsApp">
        <span class="wa-badge-pulse"></span>
        <svg viewBox="0 0 32 32">
          <path d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.658.766 5.14 2.088 7.234L3.1 29.5l6.452-1.458A13.438 13.438 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5zm7.886 19.387c-.328.92-1.636 1.76-2.27 1.874-.608.109-1.393.155-2.25-.122a18.23 18.23 0 0 1-5.698-3.52 16.033 16.033 0 0 1-3.69-4.595c-.417-.7-.442-1.353-.122-1.928.293-.526.837-.84 1.258-.84.205 0 .39.014.542.023.442.02.664.048.958.749.369.88 1.268 3.088 1.378 3.313.111.226.185.49.037.787-.148.297-.222.483-.442.743-.222.26-.466.58-.665.779-.222.222-.454.463-.195.908.26.444 1.157 1.906 2.486 3.09 1.71 1.524 3.151 1.996 3.595 2.218.444.222.703.185.962-.111.26-.297 1.11-1.296 1.406-1.74.296-.445.592-.37.999-.223.407.149 2.59 1.222 3.034 1.444.444.222.74.333.851.518.11.186.11 1.074-.218 1.994z"/>
        </svg>
      </button>
    `;

    container.innerHTML = html;
    document.body.appendChild(container);

    // Event listeners
    var launcher = document.getElementById('wa-launcher-' + brandId);
    var chatWindow = document.getElementById('wa-window-' + brandId);
    var closeBtn = document.getElementById('wa-close-' + brandId);
    var inputField = document.getElementById('wa-input-' + brandId);
    var sendBtn = document.getElementById('wa-send-' + brandId);

    function toggleChat() {
      chatWindow.classList.toggle('wa-open');
      if (chatWindow.classList.contains('wa-open')) {
        inputField.focus();
      }
    }

    function sendMessage() {
      var userText = inputField.value.trim();
      var messageToSend = userText ? userText : prefillMessage;
      var url = 'https://wa.me/' + primaryPhone + '?text=' + encodeURIComponent(messageToSend);
      window.open(url, '_blank');
      inputField.value = '';
      chatWindow.classList.remove('wa-open');
    }

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Expose globally
  window.initWhatsAppWidget = initWhatsAppWidget;

  // Auto-initialize if config attribute or global brand found
  if (window.WA_BRAND_CONFIG) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initWhatsAppWidget(window.WA_BRAND_CONFIG);
      });
    } else {
      initWhatsAppWidget(window.WA_BRAND_CONFIG);
    }
  }
})(window, document);
