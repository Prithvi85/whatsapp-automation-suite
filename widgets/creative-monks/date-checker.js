/**
 * Creative Monks (www.creativemonks.in)
 * Wedding Date Availability & Department Switcher Connector
 */
(function () {
  'use strict';

  var WEDDING_PHONE = '917003797652';    // Line 1: Wedding & Pre-Wedding Shoots
  var COMMERCIAL_PHONE = '919038516799'; // Line 2: Commercial & Support

  window.openCMDateChecker = function () {
    var existingModal = document.getElementById('cm-date-modal');
    if (existingModal) {
      existingModal.style.display = 'flex';
      return;
    }

    var modal = document.createElement('div');
    modal.id = 'cm-date-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(31, 36, 33, 0.8);
      backdrop-filter: blur(4px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 480px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: cmModalIn 0.25s ease;">
        <div style="background: #D9534F; padding: 20px 24px; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">Creative Monks Photography</h3>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Check Wedding Date & Package Availability</p>
          </div>
          <button id="cm-modal-close" style="background: transparent; border: none; color: #FFFFFF; font-size: 24px; cursor: pointer;">&times;</button>
        </div>

        <form id="cm-date-form" style="padding: 24px;">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Couple / Contact Name *</label>
            <input type="text" id="cm-name" required placeholder="e.g. Sneha & Rohan / Joy" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px;" />
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 14px;">
            <div style="flex: 1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Event Date *</label>
              <input type="date" id="cm-date" required style="width: 100%; box-sizing: border-box; padding: 9px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px;" />
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">City / Venue</label>
              <input type="text" id="cm-city" placeholder="e.g. Kolkata / Destination" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px;" />
            </div>
          </div>

          <div style="margin-bottom: 18px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Shoot Category</label>
            <select id="cm-category" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; background: #FFF;">
              <option value="Wedding & Reception (Line 1)">Wedding & Reception Coverage</option>
              <option value="Pre-Wedding Cinematic Shoot (Line 1)">Pre-Wedding Cinematic Shoot</option>
              <option value="Rice Ceremony / Baby Shoot (Line 1)">Annaprashan / Rice Ceremony / Baby Shoot</option>
              <option value="Commercial / Fashion Shoot (Line 2)">Commercial / Fashion / Brand Shoot</option>
            </select>
          </div>

          <button type="submit" style="width: 100%; background: #D9534F; color: #FFFFFF; border: none; border-radius: 8px; padding: 12px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Check Date & Get Pricing on WhatsApp</span>
            &rarr;
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cm-modal-close').addEventListener('click', function () {
      modal.style.display = 'none';
    });

    document.getElementById('cm-date-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cm-name').value;
      var date = document.getElementById('cm-date').value;
      var city = document.getElementById('cm-city').value || 'Kolkata';
      var category = document.getElementById('cm-category').value;

      // Smart routing: Commercial queries go to Line 2 (9038516799), weddings to Line 1 (7003797652)
      var targetPhone = category.indexOf('Line 2') !== -1 ? COMMERCIAL_PHONE : WEDDING_PHONE;

      var text = `Hello Creative Monks Team,\nI would like to check availability and package rates:\n\n` +
        `• Name: ${name}\n` +
        `• Shoot Category: ${category}\n` +
        `• Event Date: ${date}\n` +
        `• Venue / City: ${city}\n\n` +
        `Please let me know if this slot is open and share your rate card.`;

      var waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      modal.style.display = 'none';
    });
  };
})();
