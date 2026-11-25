/**
 * Automated Website, Technical SEO & CRO Audit Routes for PS DigiLabs
 */

const express = require('express');
const router = express.Router();
const siteAuditService = require('../services/siteAuditService');
const leadStore = require('../services/leadStore');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAuditReportHtml(audit) {
  const scoreColor = audit.scores.overall >= 80 ? '#10b981' : audit.scores.overall >= 60 ? '#f59e0b' : '#ef4444';
  const findingsHtml = audit.findings
    .map((f) => {
      const badgeColor = f.severity === 'critical' ? '#ef4444' : f.severity === 'warning' ? '#f59e0b' : '#10b981';
      return `
        <div class="finding">
          <div class="finding-head">
            <span class="badge" style="background:${badgeColor}">${escapeHtml(f.severity.toUpperCase())}</span>
            <span class="cat">${escapeHtml(f.category)}</span>
          </div>
          <h3>${escapeHtml(f.title)}</h3>
          <p class="detail">${escapeHtml(f.detail)}</p>
          <p class="impact"><strong>Impact:</strong> ${escapeHtml(f.impact)}</p>
        </div>
      `;
    })
    .join('');

  const actionsHtml = (audit.aiSummary.topActions || [])
    .map((a) => `<li>${escapeHtml(a)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PS DigiLabs Website Audit — ${escapeHtml(audit.domain)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b1120; color: #e2e8f0; margin: 0; padding: 32px 16px; line-height: 1.5; }
    .wrap { max-width: 900px; margin: 0 auto; }
    .card { background: #111827; border: 1px solid #1e293b; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .brand { color: #38bdf8; font-weight: 700; letter-spacing: 0.04em; font-size: 13px; text-transform: uppercase; }
    h1 { margin: 6px 0 4px; font-size: 26px; color: #f8fafc; }
    .meta { color: #94a3b8; font-size: 14px; }
    .score-ring { width: 108px; height: 108px; border-radius: 50%; border: 6px solid ${scoreColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; }
    .score-ring strong { font-size: 32px; color: #fff; line-height: 1; }
    .score-ring span { font-size: 12px; color: #94a3b8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 16px; }
    .metric { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; }
    .metric .label { font-size: 12px; color: #94a3b8; }
    .metric .val { font-size: 22px; font-weight: 700; color: #f8fafc; margin-top: 4px; }
    .finding { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
    .finding-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .badge { font-size: 11px; font-weight: 700; color: #fff; padding: 2px 8px; border-radius: 999px; }
    .cat { font-size: 12px; color: #94a3b8; }
    .finding h3 { margin: 0 0 4px; font-size: 16px; color: #f1f5f9; }
    .detail { margin: 0 0 4px; color: #cbd5e1; font-size: 14px; }
    .impact { margin: 0; color: #94a3b8; font-size: 13px; }
    pre { background: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 10px; overflow-x: auto; font-size: 12px; color: #7dd3fc; }
    .cta-box { background: linear-gradient(135deg, #0f172a, #172554); border: 1px solid #2563eb; }
    .btn { display: inline-block; background: #0066ff; color: #fff; text-decoration: none; font-weight: 600; padding: 12px 20px; border-radius: 10px; margin-top: 10px; margin-right: 10px; }
    .btn-outline { background: transparent; border: 1px solid #38bdf8; color: #38bdf8; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card header">
      <div>
        <div class="brand">PS DigiLabs • Automated Site &amp; CRO Audit</div>
        <h1>${escapeHtml(audit.domain)}</h1>
        <div class="meta">Target: ${escapeHtml(audit.finalUrl)} &bull; Goal: ${escapeHtml(audit.goal)} &bull; ${escapeHtml(audit.createdAt)}</div>
      </div>
      <div class="score-ring">
        <strong>${audit.scores.overall}</strong>
        <span>/ 100</span>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-top:0">Score Breakdown</h2>
      <div class="grid">
        <div class="metric"><div class="label">Speed &amp; Security</div><div class="val">${audit.scores.securityAndSpeed}/100</div></div>
        <div class="metric"><div class="label">Technical SEO</div><div class="val">${audit.scores.technicalSeo}/100</div></div>
        <div class="metric"><div class="label">Mobile &amp; UX</div><div class="val">${audit.scores.mobileAndUx}/100</div></div>
        <div class="metric"><div class="label">Conversion CRO</div><div class="val">${audit.scores.conversionCro}/100</div></div>
      </div>
      <p style="margin-top:16px;color:#cbd5e1"><strong>Executive Summary (${escapeHtml(audit.aiSummary.provider)}):</strong> ${escapeHtml(audit.aiSummary.headline)}</p>
      <ul>${actionsHtml}</ul>
    </div>

    <div class="card">
      <h2 style="margin-top:0">Verified Technical &amp; Conversion Findings</h2>
      ${findingsHtml}
    </div>

    <div class="card">
      <h2 style="margin-top:0">Free Ready-to-Paste SEO &amp; Schema Patch</h2>
      <p class="meta">Drop this starter block into your <code>&lt;head&gt;</code> to fix missing meta tags, Open Graph previews, and JSON-LD entity schema:</p>
      <pre><code>${escapeHtml(audit.quickFixes.metaPatchHtml)}</code></pre>
    </div>

    <div class="card cta-box" id="checkout">
      <h2 style="margin-top:0">Want PS DigiLabs to Implement All Fixes for You?</h2>
      <p><strong>${escapeHtml(audit.offer.tierName)}</strong> — Turnaround: <strong>${escapeHtml(audit.offer.turnaround)}</strong> &bull; <strong>USD $${audit.offer.priceUsd}</strong></p>
      <p style="color:#cbd5e1">${escapeHtml(audit.offer.summary)}</p>
      <a class="btn" href="${escapeHtml(audit.offer.checkoutUrl)}">Deploy Fixes Now (USD $${audit.offer.priceUsd})</a>
      <a class="btn btn-outline" href="https://wa.me/916289482083?text=${encodeURIComponent(`Hi PS DigiLabs, I reviewed audit ${audit.id} for ${audit.domain} and want to discuss implementing the fixes.`)}">Chat on WhatsApp</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * POST /api/audit
 * Run an instant automated website + SEO + CRO audit
 */
router.post('/', async (req, res) => {
  try {
    const { url, goal, name, phone, email } = req.body || {};
    if (!url) {
      return res.status(400).json({ success: false, error: 'Missing required field: url' });
    }

    const audit = await siteAuditService.runAudit(url, {
      goal: goal || 'Leads & Conversions',
      requester: { name: name || '', phone: phone || '', email: email || '' }
    });

    leadStore.addLead({
      brandId: 'ps-digilabs',
      brandName: 'PS DigiLabs',
      customerName: name || `Audit Lead (${audit.domain})`,
      phone: phone || '',
      email: email || '',
      service: 'Automated Website & SEO Audit',
      auditId: audit.id,
      message: `Audited ${audit.finalUrl} | Score: ${audit.scores.overall}/100 | Report: ${audit.reportUrl}`,
      source: 'Automated Audit API',
      channel: 'Web / API Audit'
    });

    res.status(201).json({ success: true, audit });
  } catch (err) {
    const isValidation = /Invalid URL|required|public internet domain|Only http/i.test(err.message);
    res.status(isValidation ? 400 : 502).json({
      success: false,
      error: err.message || 'Failed to audit target URL'
    });
  }
});

/**
 * GET /api/audit
 * List recent audits
 */
router.get('/', (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const audits = siteAuditService.listAudits(limit);
  res.json({ success: true, count: audits.length, audits });
});

/**
 * GET /api/audit/report/:id
 * Interactive HTML report with free quick-fix patch & USD checkout CTA
 */
router.get('/report/:id', (req, res) => {
  const audit = siteAuditService.getAuditById(req.params.id);
  if (!audit) {
    return res.status(404).send('<h1>Audit report not found</h1>');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderAuditReportHtml(audit));
});

/**
 * GET /api/audit/:id
 * Fetch audit JSON by ID
 */
router.get('/:id', (req, res) => {
  const audit = siteAuditService.getAuditById(req.params.id);
  if (!audit) {
    return res.status(404).json({ success: false, error: 'Audit not found' });
  }
  res.json({ success: true, audit });
});

module.exports = router;
