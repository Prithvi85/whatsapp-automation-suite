/**
 * PS DigiLabs (www.psdigilabs.in)
 * Embeddable Instant Website, SEO & CRO Audit Widget
 * Supports both modal trigger (window.openPSAuditModal) and inline mount (<div id="ps-audit-widget"></div>)
 */
(function () {
  'use strict';

  var currentScript = document.currentScript;
  var configuredBase =
    (currentScript && currentScript.getAttribute('data-api-base')) ||
    window.PS_AUDIT_API_BASE ||
    '';

  function getApiBase() {
    if (configuredBase) return configuredBase.replace(/\/$/, '');
    if (window.location && /^https?:/.test(window.location.protocol)) {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildWidgetHtml(isModal) {
    return `
      <div style="background:#0F172A;color:#F8FAFC;border:1px solid #1E293B;border-radius:16px;width:100%;max-width:${isModal ? '520px' : '100%'};overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.35);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="background:linear-gradient(135deg,#0066FF,#1D4ED8);padding:18px 22px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;opacity:0.9;">PS DigiLabs • Free 15-Sec Audit</div>
            <h3 style="margin:4px 0 0;font-size:18px;font-weight:700;color:#FFF;">Instant Website, SEO &amp; CRO Scanner</h3>
          </div>
          ${isModal ? '<button type="button" class="ps-audit-close" style="background:transparent;border:none;color:#FFF;font-size:24px;cursor:pointer;line-height:1;">&times;</button>' : ''}
        </div>
        <form class="ps-audit-form" style="padding:20px 22px;">
          <div style="margin-bottom:12px;">
            <label style="display:block;font-size:12px;font-weight:600;color:#CBD5E1;margin-bottom:5px;">Website URL *</label>
            <input type="text" class="ps-audit-url" required placeholder="https://yourcompany.com" style="width:100%;box-sizing:border-box;padding:10px 12px;background:#020617;color:#F8FAFC;border:1px solid #334155;border-radius:8px;font-size:14px;" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#CBD5E1;margin-bottom:5px;">Primary Goal</label>
              <select class="ps-audit-goal" style="width:100%;box-sizing:border-box;padding:10px 10px;background:#020617;color:#F8FAFC;border:1px solid #334155;border-radius:8px;font-size:13px;">
                <option value="Leads & Conversions">Leads &amp; Conversions</option>
                <option value="E-Commerce Sales">E-Commerce Sales</option>
                <option value="Organic Traffic & SEO">Organic Traffic &amp; SEO</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#CBD5E1;margin-bottom:5px;">Email (Optional)</label>
              <input type="email" class="ps-audit-email" placeholder="you@company.com" style="width:100%;box-sizing:border-box;padding:10px 12px;background:#020617;color:#F8FAFC;border:1px solid #334155;border-radius:8px;font-size:13px;" />
            </div>
          </div>
          <button type="submit" class="ps-audit-submit" style="width:100%;background:#0066FF;color:#FFF;border:none;border-radius:8px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;">
            Scan My Website Now &rarr;
          </button>
          <div class="ps-audit-result" style="display:none;margin-top:16px;padding:14px;background:#020617;border:1px solid #1E293B;border-radius:10px;"></div>
        </form>
      </div>
    `;
  }

  function bindWidgetBehavior(container, isModal) {
    if (isModal) {
      var closeBtn = container.querySelector('.ps-audit-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          container.style.display = 'none';
        });
      }
    }

    var form = container.querySelector('.ps-audit-form');
    var resultBox = container.querySelector('.ps-audit-result');
    var submitBtn = container.querySelector('.ps-audit-submit');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var url = container.querySelector('.ps-audit-url').value.trim();
      var goal = container.querySelector('.ps-audit-goal').value;
      var email = container.querySelector('.ps-audit-email').value.trim();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Scanning Speed, SEO & CRO...';
      resultBox.style.display = 'none';

      try {
        var res = await fetch(getApiBase() + '/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url, goal: goal, email: email })
        });
        var json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Audit failed');
        }

        var a = json.audit;
        var scoreColor = a.scores.overall >= 80 ? '#10B981' : a.scores.overall >= 60 ? '#F59E0B' : '#EF4444';
        var topIssues = (a.findings || []).filter(function (f) { return f.severity !== 'pass'; }).slice(0, 3);

        resultBox.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
              <div style="font-size:12px;color:#94A3B8;">Verified Audit for</div>
              <strong style="font-size:15px;color:#FFF;">${escapeHtml(a.domain)}</strong>
            </div>
            <div style="font-size:22px;font-weight:800;color:${scoreColor};">${a.scores.overall}/100</div>
          </div>
          <div style="font-size:12.5px;color:#CBD5E1;margin-bottom:10px;">${escapeHtml(a.aiSummary.headline)}</div>
          <ul style="margin:0 0 12px;padding-left:18px;font-size:12px;color:#94A3B8;">
            ${topIssues.map(function (f) {
              return '<li style="margin-bottom:4px;"><strong style="color:#E2E8F0;">' + escapeHtml(f.title) + '</strong> — ' + escapeHtml(f.impact) + '</li>';
            }).join('')}
          </ul>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a href="${escapeHtml(a.reportUrl)}" target="_blank" style="flex:1;text-align:center;background:#1E293B;color:#38BDF8;text-decoration:none;padding:9px 12px;border-radius:8px;font-size:12.5px;font-weight:700;">View Full Report &amp; Patch</a>
            <a href="${escapeHtml(a.offer.checkoutUrl)}" target="_blank" style="flex:1;text-align:center;background:#10B981;color:#020617;text-decoration:none;padding:9px 12px;border-radius:8px;font-size:12.5px;font-weight:800;">Fix For USD $${a.offer.priceUsd}</a>
          </div>
        `;
        resultBox.style.display = 'block';
      } catch (err) {
        resultBox.innerHTML = `<div style="color:#F87171;font-size:13px;">Could not scan URL: ${escapeHtml(err.message)}</div>`;
        resultBox.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Scan My Website Now →';
      }
    });
  }

  window.openPSAuditModal = function () {
    var existing = document.getElementById('ps-audit-modal');
    if (existing) {
      existing.style.display = 'flex';
      return;
    }

    var modal = document.createElement('div');
    modal.id = 'ps-audit-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.78);backdrop-filter:blur(4px);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = buildWidgetHtml(true);
    document.body.appendChild(modal);
    bindWidgetBehavior(modal, true);
  };

  function autoMountInline() {
    var target = document.getElementById('ps-audit-widget');
    if (target && !target.dataset.mounted) {
      target.dataset.mounted = 'true';
      target.innerHTML = buildWidgetHtml(false);
      bindWidgetBehavior(target, false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMountInline);
  } else {
    autoMountInline();
  }
})();
