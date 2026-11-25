/**
 * PS DigiLabs (www.psdigilabs.in)
 * Instant Project Quote & WhatsApp Lead Dispatcher
 */
(function () {
  'use strict';

  var PS_PHONE = '916289482083'; // PS DigiLabs WhatsApp

  window.openPSQuoteModal = function () {
    var existingModal = document.getElementById('ps-quote-modal');
    if (existingModal) {
      existingModal.style.display = 'flex';
      return;
    }

    var modal = document.createElement('div');
    modal.id = 'ps-quote-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 460px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: psModalIn 0.25s ease;">
        <div style="background: #0066FF; padding: 20px 24px; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">PS DigiLabs Project Estimator</h3>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Get instant project scope & connect on WhatsApp</p>
          </div>
          <button id="ps-modal-close" style="background: transparent; border: none; color: #FFFFFF; font-size: 24px; cursor: pointer;">&times;</button>
        </div>

        <form id="ps-quote-form" style="padding: 24px;">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Your Name / Company *</label>
            <input type="text" id="ps-name" required placeholder="e.g. John Doe / TechCorp" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px;" />
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Required Service *</label>
            <select id="ps-service" required style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; background: #FFF;">
              <option value="Custom Website / E-commerce">Custom Website / E-Commerce Development</option>
              <option value="Mobile App (iOS/Android)">Mobile App Development (React Native / Flutter)</option>
              <option value="Performance SEO & Google Ads">SEO & Performance Marketing Funnels</option>
              <option value="WhatsApp / CRM Automation">WhatsApp Cloud API & Custom Automation</option>
              <option value="Full Digital Transformation">Complete Digital Transformation Suite</option>
            </select>
          </div>

          <div style="margin-bottom: 18px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Estimated Timeline</label>
            <select id="ps-timeline" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; background: #FFF;">
              <option value="Urgent (Within 2-3 Weeks)">Urgent (Within 2-3 Weeks)</option>
              <option value="Standard (1-2 Months)">Standard (1-2 Months)</option>
              <option value="Planning / Research Phase">Planning / Research Phase</option>
            </select>
          </div>

          <button type="submit" style="width: 100%; background: #0066FF; color: #FFFFFF; border: none; border-radius: 8px; padding: 12px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Generate Quote on WhatsApp (+91 62894 82083)</span>
            &rarr;
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('ps-modal-close').addEventListener('click', function () {
      modal.style.display = 'none';
    });

    document.getElementById('ps-quote-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('ps-name').value;
      var service = document.getElementById('ps-service').value;
      var timeline = document.getElementById('ps-timeline').value;

      var text = `Hello PS DigiLabs,\nI am requesting a project estimate from psdigilabs.in:\n\n` +
        `• Name/Company: ${name}\n` +
        `• Required Service: ${service}\n` +
        `• Desired Timeline: ${timeline}\n\n` +
        `Please share your portfolio, scope breakdown, and best quotation.`;

      var waUrl = `https://wa.me/${PS_PHONE}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      modal.style.display = 'none';
    });
  };
})();
