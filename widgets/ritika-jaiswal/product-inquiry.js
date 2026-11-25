/**
 * Ritika Jaiswal Fashion (www.ritikajaiswalfashion.com)
 * Product Page "Inquire on WhatsApp" & Bespoke Appointment Connector
 */
(function () {
  'use strict';

  var RITIKA_WHATSAPP = '91923759949'; // Ritika Jaiswal WhatsApp

  // Function to attach WhatsApp Inquiry Button to product containers
  function injectProductInquiryButton() {
    // Detect product title, price, and image from common e-commerce selectors
    var productTitleEl = document.querySelector('h1.product-title, .product__title, .product_title, h1');
    var priceEl = document.querySelector('.price, .product-price, .woocommerce-Price-amount');
    var productTitle = productTitleEl ? productTitleEl.innerText.trim() : document.title;
    var price = priceEl ? priceEl.innerText.trim() : '';

    var targetContainer = document.querySelector('form.cart, .product-form, .product-actions, .product-details');

    if (!targetContainer || document.getElementById('rj-wa-inquire-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'rj-wa-inquire-btn';
    btn.type = 'button';
    btn.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: #1A1A1A;
      color: #B89058;
      border: 1px solid #B89058;
      padding: 14px 20px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 12px;
      transition: all 0.25s ease;
      font-family: inherit;
    `;
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#B89058">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
      </svg>
      Inquire Custom Sizing & Bridal Consultation
    `;

    btn.addEventListener('mouseenter', function() {
      btn.style.background = '#B89058';
      btn.style.color = '#FFFFFF';
      btn.querySelector('svg').setAttribute('fill', '#FFFFFF');
    });

    btn.addEventListener('mouseleave', function() {
      btn.style.background = '#1A1A1A';
      btn.style.color = '#B89058';
      btn.querySelector('svg').setAttribute('fill', '#B89058');
    });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var message = `Hello Ritika Jaiswal Atelier,\nI am interested in this couture piece:\n` +
        `• Design: ${productTitle}\n` +
        (price ? `• Price: ${price}\n` : '') +
        `• Link: ${window.location.href}\n\n` +
        `Could you please share custom sizing, lead time, and booking availability at Camac Street?`;

      var waUrl = `https://wa.me/${RITIKA_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });

    targetContainer.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectProductInquiryButton);
  } else {
    injectProductInquiryButton();
  }
})();
