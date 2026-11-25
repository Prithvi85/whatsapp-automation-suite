/**
 * Unit & HTTP Integration Tests for PS DigiLabs Automated Website/SEO Audit Module
 */

const assert = require('assert');
const http = require('http');
const siteAuditService = require('../server/services/siteAuditService');
const psFlow = require('../server/flows/psDigiLabsFlow');
const app = require('../server/index');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Running Site Audit Engine & API Integration Tests');
  console.log('====================================================\n');

  // 1. URL extraction
  assert.strictEqual(
    siteAuditService.extractUrlFromText('Please audit https://acme-store.com/shop for sales'),
    'https://acme-store.com/shop'
  );
  assert.strictEqual(
    siteAuditService.extractUrlFromText('check www.psdigilabs.in please'),
    'www.psdigilabs.in'
  );
  assert.strictEqual(
    siteAuditService.extractUrlFromText('no url here just screenshot.png'),
    null
  );
  console.log('✅ [PASS] URL extraction from WhatsApp text');

  // 2. SSRF & validation checks
  assert.strictEqual(
    siteAuditService.normalizeAndValidateUrl('example.com'),
    'https://example.com/'
  );
  for (const blocked of ['http://localhost:3000', 'http://127.0.0.1', 'http://192.168.1.10', 'http://10.0.0.5', 'ftp://example.com']) {
    assert.throws(() => siteAuditService.normalizeAndValidateUrl(blocked));
  }
  console.log('✅ [PASS] SSRF & URL validation guards');

  // 3. Deterministic audit on unoptimized site (including XSS payload & special chars in title)
  const unoptimizedHtml = `
    <html>
      <head>
        <title>Hi & "Test" <script>alert(1)</script></title>
      </head>
      <body>
        <img src="hero.jpg">
        <img src="banner.jpg">
      </body>
    </html>
  `;

  const weakAudit = await siteAuditService.runAudit('http://weak-demo.example.com', {
    goal: 'E-Commerce Sales',
    skipExternal: true,
    mockFetch: async (url) => ({
      status: 200,
      finalUrl: url,
      loadTimeMs: 2450,
      headers: {},
      html: unoptimizedHtml
    })
  });

  assert.ok(weakAudit.scores.overall < 65, `Expected score < 65, got ${weakAudit.scores.overall}`);
  assert.strictEqual(weakAudit.offer.priceUsd, 199);
  assert.ok(weakAudit.quickFixes.metaPatchHtml.includes('application/ld+json'));
  const waText = siteAuditService.formatWhatsAppAuditSummary(weakAudit);
  assert.ok(waText.includes('USD $199'));
  assert.ok(waText.includes(weakAudit.reportUrl));
  console.log(`✅ [PASS] Weak site audit scored ${weakAudit.scores.overall}/100 & selected $199 overhaul`);

  // 4. Deterministic audit on well-optimized site
  const strongHtml = `
    <html>
      <head>
        <title>Acme Solutions | Fast Enterprise Software Development</title>
        <meta name="description" content="Acme Solutions builds reliable enterprise web applications with rapid deployment and dedicated 24/7 engineering support for global teams.">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="canonical" href="https://strong-demo.example.com/">
        <meta property="og:title" content="Acme Solutions">
        <meta property="og:description" content="Enterprise software">
        <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Acme"}</script>
        <script src="https://www.googletagmanager.com/gtag/js"></script>
      </head>
      <body>
        <h1>Enterprise Web Engineering</h1>
        <form><input type="email"></form>
        <a href="https://wa.me/916289482083">Chat on WhatsApp</a>
        <img src="team.jpg" alt="Engineering team" loading="lazy">
      </body>
    </html>
  `;

  const strongAudit = await siteAuditService.runAudit('https://strong-demo.example.com', {
    goal: 'Leads',
    skipExternal: true,
    mockFetch: async (url) => ({
      status: 200,
      finalUrl: url,
      loadTimeMs: 320,
      headers: { 'content-encoding': 'br', 'strict-transport-security': 'max-age=31536000' },
      html: strongHtml
    })
  });

  assert.ok(strongAudit.scores.overall >= 90, `Expected score >= 90, got ${strongAudit.scores.overall}`);
  assert.strictEqual(strongAudit.offer.priceUsd, 99);
  console.log(`✅ [PASS] Strong site audit scored ${strongAudit.scores.overall}/100`);

  // 5. Flow graceful handling of blocked private URL
  const blockedFlowReply = await psFlow.handleInbound('audit http://127.0.0.1:8080', '', '919999999999', 'Tester');
  assert.ok(blockedFlowReply.text.includes('Could Not Complete Automated Audit'));
  console.log('✅ [PASS] PS DigiLabs flow safely handles blocked/private URLs');

  // 6. HTTP integration test for /api/audit and HTML report escaping
  await new Promise((resolve, reject) => {
    const server = app.listen(3098, async () => {
      try {
        const listRes = await fetch('http://localhost:3098/api/audit');
        const listJson = await listRes.json();
        assert.strictEqual(listRes.status, 200);
        assert.ok(listJson.success && listJson.count >= 2);

        const reportRes = await fetch(`http://localhost:3098/api/audit/report/${weakAudit.id}`);
        const reportHtml = await reportRes.text();
        assert.strictEqual(reportRes.status, 200);
        assert.ok(!reportHtml.includes('<script>alert(1)</script>'), 'XSS tag must not appear unescaped in HTML report');
        assert.ok(reportHtml.includes('Hi &amp; &quot;Test&quot;'), 'Special HTML chars must be escaped in HTML report');

        const badPost = await fetch('http://localhost:3098/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'http://127.0.0.1' })
        });
        assert.strictEqual(badPost.status, 400);

        console.log('✅ [PASS] HTTP /api/audit & XSS-safe HTML report rendering verified');
        server.close(resolve);
      } catch (err) {
        server.close(() => reject(err));
      }
    });
  });

  console.log('\n🎉 ALL SITE AUDIT TESTS PASSED!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
