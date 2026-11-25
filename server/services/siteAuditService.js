/**
 * Automated Website, Technical SEO & Conversion Audit Service for PS DigiLabs
 * Combines deterministic HTTP/HTML/Schema checks with optional PageSpeed Insights & Gemini AI analysis.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../../data');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(AUDITS_FILE)) {
  fs.writeFileSync(AUDITS_FILE, JSON.stringify([], null, 2));
}

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^172\.(1[6-9]|2\d|3[0-1])\./
];

class SiteAuditService {
  constructor() {
    this.audits = this._loadAudits();
  }

  _loadAudits() {
    try {
      const raw = fs.readFileSync(AUDITS_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      console.error('[SiteAuditService] Failed to load audits:', err.message);
      return [];
    }
  }

  _saveAudits() {
    try {
      fs.writeFileSync(AUDITS_FILE, JSON.stringify(this.audits.slice(0, 200), null, 2));
    } catch (err) {
      console.error('[SiteAuditService] Failed to save audits:', err.message);
    }
  }

  /**
   * Extract a website URL from free-form WhatsApp text (e.g. "audit my site acme.com")
   */
  extractUrlFromText(text = '') {
    if (!text || typeof text !== 'string') return null;

    // Match explicit http(s) URLs first
    const explicitMatch = text.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/i);
    if (explicitMatch) {
      return explicitMatch[0].replace(/[.,!?;:)]+$/, '');
    }

    // Match bare domains like www.example.com or example.co.in (avoid matching prices/decimals)
    const domainMatch = text.match(/\b(?:www\.)?[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+(?:\/[^\s<>"{}|\\^`[\]]*)?/i);
    if (domainMatch) {
      const candidate = domainMatch[0].replace(/[.,!?;:)]+$/, '');
      // Ignore common file extensions accidentally typed as words
      if (/\.(png|jpg|jpeg|pdf|zip|js|css)$/i.test(candidate)) return null;
      return candidate;
    }

    return null;
  }

  /**
   * Normalize and validate public HTTP/HTTPS target URL (blocks SSRF to private hosts)
   */
  normalizeAndValidateUrl(inputUrl) {
    if (!inputUrl || typeof inputUrl !== 'string') {
      throw new Error('A valid website URL is required.');
    }

    let raw = inputUrl.trim();
    if (!/^https?:\/\//i.test(raw)) {
      raw = `https://${raw}`;
    }

    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      throw new Error(`Invalid URL format: "${inputUrl}"`);
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Only http:// and https:// URLs are supported.');
    }

    const hostname = parsed.hostname.replace(/^\[|\]$/g, '');
    if (!hostname || !hostname.includes('.') || PRIVATE_HOST_PATTERNS.some((re) => re.test(hostname))) {
      throw new Error(`Target host "${hostname}" is not a public internet domain.`);
    }

    return parsed.toString();
  }

  /**
   * Run a full website, technical SEO, and conversion audit
   */
  async runAudit(inputUrl, options = {}) {
    const targetUrl = this.normalizeAndValidateUrl(inputUrl);
    const goal = options.goal || 'Leads & Conversions';
    const requester = options.requester || {};

    const fetched = options.mockFetch
      ? await options.mockFetch(targetUrl)
      : await this._fetchPage(targetUrl);

    const parsedSignals = this._parseHtmlSignals(fetched.html, fetched.finalUrl || targetUrl);
    const findings = this._evaluateFindings(fetched, parsedSignals);
    const scores = this._computeScores(findings);
    const fixPackage = this._selectFixPackage(scores.overall, findings);
    const quickFixes = this._generateQuickFixSnippets(fetched.finalUrl || targetUrl, parsedSignals);

    // Optional AI & PageSpeed enrichments (never fail the core audit if unavailable)
    const psiData = options.skipExternal ? null : await this._fetchPageSpeedInsights(targetUrl);
    const aiSummary = options.skipExternal
      ? this._buildDeterministicSummary(parsedSignals, findings, scores, goal)
      : await this._generateAiSummary(targetUrl, parsedSignals, findings, scores, goal);

    const auditId = 'aud_' + Date.now().toString(36) + '_' + crypto.randomBytes(3).toString('hex');
    const basePublicUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
    const checkoutBase = process.env.AUDIT_CHECKOUT_URL || `${basePublicUrl}/api/audit/report/${auditId}#checkout`;

    const auditRecord = {
      id: auditId,
      createdAt: new Date().toISOString(),
      targetUrl,
      finalUrl: fetched.finalUrl || targetUrl,
      domain: new URL(fetched.finalUrl || targetUrl).hostname,
      goal,
      requester,
      metrics: {
        httpStatus: fetched.status,
        loadTimeMs: fetched.loadTimeMs,
        htmlSizeKb: Math.round((Buffer.byteLength(fetched.html || '', 'utf8') / 1024) * 10) / 10,
        isHttps: (fetched.finalUrl || targetUrl).startsWith('https://'),
        compressed: Boolean(fetched.headers['content-encoding']),
        hasHsts: Boolean(fetched.headers['strict-transport-security']),
        pageSpeed: psiData
      },
      signals: parsedSignals,
      scores,
      findings,
      quickFixes,
      aiSummary,
      offer: {
        ...fixPackage,
        checkoutUrl: checkoutBase.includes('?')
          ? `${checkoutBase}&audit_id=${auditId}`
          : `${checkoutBase}${checkoutBase.includes('#') ? '' : `?audit_id=${auditId}`}`
      },
      reportUrl: `${basePublicUrl}/api/audit/report/${auditId}`
    };

    this.audits.unshift(auditRecord);
    this._saveAudits();
    return auditRecord;
  }

  getAuditById(auditId) {
    return this.audits.find((a) => a.id === auditId) || null;
  }

  listAudits(limit = 20) {
    return this.audits.slice(0, limit);
  }

  markAuditPaid(auditId, orderInfo = {}) {
    const audit = this.getAuditById(auditId);
    if (!audit) return null;
    audit.paymentStatus = 'PAID';
    audit.paidAt = new Date().toISOString();
    audit.orderId = orderInfo.orderId || '';
    audit.paidAmountUsd = orderInfo.amountUsd || audit.offer?.priceUsd || 0;
    this._saveAudits();
    return audit;
  }

  async _fetchPage(url) {
    const start = Date.now();
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      headers: {
        'User-Agent': 'PSDigiLabs-SiteAuditBot/1.0 (+https://www.psdigilabs.in)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res.text();
    const loadTimeMs = Date.now() - start;

    const headers = {};
    res.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    return {
      status: res.status,
      finalUrl: res.url || url,
      loadTimeMs,
      headers,
      html
    };
  }

  _extractAttr(tag, attrName) {
    const re = new RegExp(`${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
    const match = tag.match(re);
    return match ? (match[1] ?? match[2] ?? match[3] ?? '').trim() : null;
  }

  _stripTags(str = '') {
    return str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  _parseHtmlSignals(html = '', finalUrl = '') {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? this._stripTags(titleMatch[1]) : '';

    const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
    let metaDescription = '';
    let viewport = '';
    let robots = '';
    const openGraph = {};

    for (const tag of metaTags) {
      const name = (this._extractAttr(tag, 'name') || '').toLowerCase();
      const property = (this._extractAttr(tag, 'property') || '').toLowerCase();
      const content = this._extractAttr(tag, 'content') || '';

      if (name === 'description' && !metaDescription) metaDescription = content;
      if (name === 'viewport' && !viewport) viewport = content;
      if (name === 'robots' && !robots) robots = content;
      if (property.startsWith('og:')) openGraph[property] = content;
    }

    const linkTags = html.match(/<link\b[^>]*>/gi) || [];
    let canonical = '';
    for (const tag of linkTags) {
      const rel = (this._extractAttr(tag, 'rel') || '').toLowerCase();
      if (rel.split(/\s+/).includes('canonical')) {
        canonical = this._extractAttr(tag, 'href') || '';
        break;
      }
    }

    const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
    const h1Texts = h1Matches.map((h) => this._stripTags(h)).filter(Boolean);
    const h2Count = (html.match(/<h2\b[^>]*>/gi) || []).length;

    const imgTags = html.match(/<img\b[^>]*>/gi) || [];
    let imagesMissingAlt = 0;
    let imagesWithoutLazy = 0;
    for (const img of imgTags) {
      const alt = this._extractAttr(img, 'alt');
      if (alt === null || alt === '') imagesMissingAlt++;
      const loading = (this._extractAttr(img, 'loading') || '').toLowerCase();
      if (loading !== 'lazy') imagesWithoutLazy++;
    }

    const ldJsonBlocks = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    const schemaTypes = [];
    for (const block of ldJsonBlocks) {
      const inner = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
      try {
        const parsed = JSON.parse(inner);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (item && item['@type']) {
            schemaTypes.push(Array.isArray(item['@type']) ? item['@type'].join(', ') : String(item['@type']));
          }
        }
      } catch {
        schemaTypes.push('Invalid JSON-LD');
      }
    }

    const formCount = (html.match(/<form\b[^>]*>/gi) || []).length;
    const hasWhatsAppLink = /(?:wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/)/i.test(html);
    const hasTelOrMailto = /(?:href=["'](?:tel:|mailto:))/i.test(html);
    const hasAnalytics = /(?:googletagmanager\.com|gtag\(|google-analytics\.com|connect\.facebook\.net|fbq\()/i.test(html);

    return {
      finalUrl,
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      hasViewport: Boolean(viewport),
      robots,
      canonical,
      hasOpenGraph: Boolean(openGraph['og:title'] && openGraph['og:description']),
      openGraphCount: Object.keys(openGraph).length,
      h1Count: h1Matches.length,
      primaryH1: h1Texts[0] || '',
      h2Count,
      totalImages: imgTags.length,
      imagesMissingAlt,
      imagesWithoutLazy,
      schemaCount: ldJsonBlocks.length,
      schemaTypes,
      formCount,
      hasWhatsAppLink,
      hasTelOrMailto,
      hasAnalytics
    };
  }

  _evaluateFindings(fetched, signals) {
    const findings = [];
    const add = (category, severity, title, detail, impact) => {
      findings.push({ category, severity, title, detail, impact });
    };

    // Performance & Security
    const isHttps = (fetched.finalUrl || '').startsWith('https://');
    if (isHttps) {
      add('Security & Speed', 'pass', 'HTTPS encryption enabled', 'Site resolves over HTTPS.', 'Protects trust and avoids browser warnings.');
    } else {
      add('Security & Speed', 'critical', 'Missing HTTPS SSL redirect', 'Site does not force HTTPS.', 'Hurts search rankings and triggers "Not Secure" warnings.');
    }

    if (fetched.loadTimeMs <= 900) {
      add('Security & Speed', 'pass', `Fast server response (${fetched.loadTimeMs}ms)`, 'HTML document fetched quickly.', 'Supports strong Core Web Vitals.');
    } else if (fetched.loadTimeMs <= 2000) {
      add('Security & Speed', 'warning', `Moderate TTFB (${fetched.loadTimeMs}ms)`, 'Initial document fetch took over 900ms.', 'Adding edge caching/CDN can cut bounce rates.');
    } else {
      add('Security & Speed', 'critical', `Slow server response (${fetched.loadTimeMs}ms)`, 'Initial HTML fetch exceeded 2 seconds.', 'Slow pages lose paid ad clicks before rendering.');
    }

    if (!fetched.headers['content-encoding']) {
      add('Security & Speed', 'warning', 'No Gzip/Brotli compression header detected', 'Transfer size may be larger than needed.', 'Enabling Brotli/Gzip cuts payload size by 60-75%.');
    }

    // Technical SEO
    if (!signals.title) {
      add('Technical SEO', 'critical', 'Missing <title> tag', 'No page title found in HTML head.', 'Search engines cannot display a proper headline.');
    } else if (signals.titleLength < 30 || signals.titleLength > 65) {
      add('Technical SEO', 'warning', `Title length suboptimal (${signals.titleLength} chars)`, `"${signals.title}" should ideally be 35-60 characters.`, 'Improves Google SERP click-through rate.');
    } else {
      add('Technical SEO', 'pass', `Well-sized title tag (${signals.titleLength} chars)`, `"${signals.title}" fits search snippets cleanly.`, 'Maximizes SERP visibility.');
    }

    if (!signals.metaDescription) {
      add('Technical SEO', 'critical', 'Missing meta description', 'No <meta name="description"> tag detected.', 'Google auto-generates snippets, reducing CTR.');
    } else if (signals.metaDescriptionLength < 70 || signals.metaDescriptionLength > 165) {
      add('Technical SEO', 'warning', `Meta description length (${signals.metaDescriptionLength} chars)`, 'Ideal length is 110-155 characters with a clear CTA.', 'Sharper snippets lift organic traffic.');
    } else {
      add('Technical SEO', 'pass', 'Meta description present and well-sized', `${signals.metaDescriptionLength} characters detected.`, 'Supports higher click-through rates.');
    }

    if (!signals.canonical) {
      add('Technical SEO', 'warning', 'Missing canonical link tag', 'No <link rel="canonical"> found.', 'Prevents duplicate URL indexing issues.');
    }

    if (signals.h1Count === 0) {
      add('Technical SEO', 'critical', 'Missing H1 heading', 'No <h1> element found on page.', 'Weakens topical relevance for search crawlers.');
    } else if (signals.h1Count > 1) {
      add('Technical SEO', 'warning', `Multiple H1 headings (${signals.h1Count})`, 'Best practice is one clear primary <h1> per page.', 'Clarifies page hierarchy for SEO and screen readers.');
    } else {
      add('Technical SEO', 'pass', 'Single clear H1 heading present', `H1: "${signals.primaryH1.slice(0, 70)}"`, 'Clean semantic structure.');
    }

    if (signals.schemaCount === 0) {
      add('Technical SEO', 'warning', 'No JSON-LD structured data', 'Missing Organization/Product/LocalBusiness schema.', 'Adding schema unlocks rich results and AI search citations.');
    } else {
      add('Technical SEO', 'pass', `Structured data detected (${signals.schemaTypes.join(', ')})`, `${signals.schemaCount} JSON-LD block(s) found.`, 'Helps Google & AI engines understand your entity.');
    }

    // Mobile & Accessibility
    if (!signals.hasViewport) {
      add('Mobile & UX', 'critical', 'Missing mobile viewport meta tag', 'Page may render zoomed-out on mobile phones.', 'Critical fix for mobile-first indexing.');
    } else {
      add('Mobile & UX', 'pass', 'Mobile viewport configured', 'Responsive viewport meta tag detected.', 'Required for mobile usability.');
    }

    if (signals.totalImages > 0 && signals.imagesMissingAlt > 0) {
      add('Mobile & UX', 'warning', `${signals.imagesMissingAlt}/${signals.totalImages} images missing alt text`, 'Image alt attributes help accessibility and Image SEO.', 'Quick automated remediation available.');
    }

    if (!signals.hasOpenGraph) {
      add('Mobile & UX', 'warning', 'Incomplete Open Graph social tags', 'Links shared on WhatsApp/LinkedIn may lack rich previews.', 'Adding OG tags boosts social and WhatsApp click-through.');
    }

    // Conversion Readiness
    if (signals.formCount === 0 && !signals.hasWhatsAppLink && !signals.hasTelOrMailto) {
      add('Conversion CRO', 'critical', 'No clear lead-capture mechanism detected', 'Found 0 HTML forms, 0 WhatsApp links, and 0 tel/mailto CTAs.', 'Visitors have no frictionless way to convert immediately.');
    } else if (!signals.hasWhatsAppLink) {
      add('Conversion CRO', 'warning', 'No instant WhatsApp / chat conversion trigger', `Detected ${signals.formCount} form(s), but no instant WhatsApp CTA.`, 'Adding a WhatsApp concierge widget typically lifts mobile lead capture.');
    } else {
      add('Conversion CRO', 'pass', 'Direct lead-capture & WhatsApp CTA detected', `Forms: ${signals.formCount}, WhatsApp CTA: Yes`, 'Strong foundation for instant lead response.');
    }

    if (!signals.hasAnalytics) {
      add('Conversion CRO', 'warning', 'No GA4 / Meta Pixel tracking script detected', 'Could not detect Google Tag or Meta Pixel in initial HTML.', 'Without conversion tracking, ad spend cannot be optimized.');
    }

    return findings;
  }

  _computeScores(findings) {
    let score = 100;
    const categoryPenalties = {
      'Security & Speed': 0,
      'Technical SEO': 0,
      'Mobile & UX': 0,
      'Conversion CRO': 0
    };

    for (const f of findings) {
      const penalty = f.severity === 'critical' ? 16 : f.severity === 'warning' ? 7 : 0;
      score -= penalty;
      if (categoryPenalties[f.category] !== undefined) {
        categoryPenalties[f.category] += penalty;
      }
    }

    const clamp = (n) => Math.max(15, Math.min(100, Math.round(n)));
    return {
      overall: clamp(score),
      securityAndSpeed: clamp(100 - categoryPenalties['Security & Speed']),
      technicalSeo: clamp(100 - categoryPenalties['Technical SEO']),
      mobileAndUx: clamp(100 - categoryPenalties['Mobile & UX']),
      conversionCro: clamp(100 - categoryPenalties['Conversion CRO'])
    };
  }

  _selectFixPackage(overallScore, findings) {
    const criticalCount = findings.filter((f) => f.severity === 'critical').length;
    if (overallScore < 65 || criticalCount >= 3) {
      return {
        tierName: 'PS DigiLabs Growth & CRO Overhaul',
        priceUsd: 199,
        turnaround: '48 hours',
        summary: 'Full technical SEO patch, schema injection, image/speed optimization, and high-converting WhatsApp lead-capture integration.'
      };
    }
    return {
      tierName: 'PS DigiLabs Quick-Fix Sprint',
      priceUsd: 99,
      turnaround: '24 hours',
      summary: 'Ready-to-deploy meta/OG/JSON-LD patch, alt-text & heading cleanup, and conversion tracking verification.'
    };
  }

  _generateQuickFixSnippets(finalUrl, signals) {
    let domainName = 'Your Brand';
    try {
      domainName = new URL(finalUrl).hostname.replace(/^www\./, '');
    } catch {
      // keep default
    }

    const brandLabel = domainName.split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const suggestedTitle = signals.title && signals.titleLength >= 30 && signals.titleLength <= 60
      ? signals.title
      : `${brandLabel} | High-Converting Digital Solutions & Services`;

    const suggestedDesc = signals.metaDescription && signals.metaDescriptionLength >= 70 && signals.metaDescriptionLength <= 160
      ? signals.metaDescription
      : `Discover ${brandLabel}. Fast, mobile-ready solutions built to convert visitors into customers. Request a quote or chat directly with our team today.`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brandLabel,
      url: finalUrl,
      sameAs: []
    };

    const metaPatchHtml = [
      `<title>${suggestedTitle}</title>`,
      `<meta name="description" content="${suggestedDesc}">`,
      `<link rel="canonical" href="${finalUrl}">`,
      `<meta property="og:title" content="${suggestedTitle}">`,
      `<meta property="og:description" content="${suggestedDesc}">`,
      `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`
    ].join('\n');

    return {
      metaPatchHtml,
      jsonLd
    };
  }

  async _fetchPageSpeedInsights(targetUrl) {
    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey && process.env.ENABLE_PAGESPEED !== 'true') {
      return null;
    }

    try {
      const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
      endpoint.searchParams.set('url', targetUrl);
      endpoint.searchParams.set('strategy', 'mobile');
      endpoint.searchParams.append('category', 'performance');
      endpoint.searchParams.append('category', 'seo');
      if (apiKey) endpoint.searchParams.set('key', apiKey);

      const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(15000) });
      if (!res.ok) return null;
      const json = await res.json();
      const cats = json.lighthouseResult?.categories || {};
      const audits = json.lighthouseResult?.audits || {};

      return {
        performanceScore: cats.performance ? Math.round(cats.performance.score * 100) : null,
        seoScore: cats.seo ? Math.round(cats.seo.score * 100) : null,
        lcp: audits['largest-contentful-paint']?.displayValue || null,
        cls: audits['cumulative-layout-shift']?.displayValue || null
      };
    } catch {
      return null;
    }
  }

  _buildDeterministicSummary(signals, findings, scores, goal) {
    const issues = findings.filter((f) => f.severity !== 'pass').slice(0, 3);
    const topActions = issues.map((i, idx) => `${idx + 1}. ${i.title} — ${i.impact}`);
    return {
      provider: 'PS DigiLabs Deterministic Engine',
      headline: `Scored ${scores.overall}/100 for "${goal}". ${issues.length ? `Fixing ${issues.length} high-impact bottlenecks can immediately lift conversions.` : 'Strong technical baseline detected.'}`,
      topActions
    };
  }

  async _generateAiSummary(targetUrl, signals, findings, scores, goal) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return this._buildDeterministicSummary(signals, findings, scores, goal);
    }

    try {
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const compactContext = {
        url: targetUrl,
        goal,
        scores,
        issues: findings.filter((f) => f.severity !== 'pass').map((f) => ({ severity: f.severity, title: f.title, detail: f.detail }))
      };

      const prompt = `You are a senior Technical SEO & CRO consultant at PS DigiLabs. Given this verified website audit JSON, return STRICT JSON only with keys "headline" (1 concise sentence) and "topActions" (array of 3 short, specific action items referencing only verified issues in the JSON).\n\n${JSON.stringify(compactContext)}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!res.ok) {
        return this._buildDeterministicSummary(signals, findings, scores, goal);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(rawText);

      if (parsed.headline && Array.isArray(parsed.topActions)) {
        return {
          provider: `Gemini (${model})`,
          headline: parsed.headline,
          topActions: parsed.topActions.slice(0, 3)
        };
      }
    } catch {
      // Fallback cleanly to deterministic summary
    }

    return this._buildDeterministicSummary(signals, findings, scores, goal);
  }

  /**
   * Format concise WhatsApp message with score, top bottlenecks, report link, and USD checkout CTA
   */
  formatWhatsAppAuditSummary(audit) {
    const criticalAndWarn = audit.findings.filter((f) => f.severity !== 'pass').slice(0, 3);
    const issueLines = criticalAndWarn.length
      ? criticalAndWarn.map((f) => `${f.severity === 'critical' ? '🔴' : '🟡'} *${f.title}* — ${f.impact}`).join('\n')
      : '🟢 No major technical blockers found!';

    return (
      `📊 *Instant Website & SEO Audit: ${audit.domain}*\n\n` +
      `🏆 *Overall Health Score:* *${audit.scores.overall}/100*\n` +
      `• Speed & Security: ${audit.scores.securityAndSpeed}/100 (${audit.metrics.loadTimeMs}ms TTFB)\n` +
      `• Technical SEO: ${audit.scores.technicalSeo}/100\n` +
      `• Mobile & UX: ${audit.scores.mobileAndUx}/100\n` +
      `• Conversion CRO: ${audit.scores.conversionCro}/100\n\n` +
      `🔍 *Top Bottlenecks Found:*\n${issueLines}\n\n` +
      `💡 *Summary:* ${audit.aiSummary.headline}\n\n` +
      `📄 *Full Interactive Report + Copy-Paste Fix Patch:*\n${audit.reportUrl}\n\n` +
      `⚡ *Want PS DigiLabs to implement all fixes in ${audit.offer.turnaround}?*\n` +
      `${audit.offer.tierName} — *USD $${audit.offer.priceUsd}*:\n${audit.offer.checkoutUrl}`
    );
  }
}

module.exports = new SiteAuditService();
