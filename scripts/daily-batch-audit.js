/**
 * PS DigiLabs Daily Batch Prospect Auditor
 * Scans target prospect domains, filters low-scoring sites, and exports personalized USD outreach packs (JSON + CSV).
 *
 * Usage:
 *   node scripts/daily-batch-audit.js --input data/prospects.sample.csv --max-score 75 --concurrency 3
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const siteAuditService = require('../server/services/siteAuditService');

const DEFAULT_OUT_DIR = path.join(__dirname, '../data/outreach');

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseProspectsFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];

  if (filePath.endsWith('.json')) {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }

  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (filePath.endsWith('.csv')) {
    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    return lines.slice(1).map((line) => {
      const cols = parseCsvLine(line);
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = cols[idx] || '';
      });
      return {
        url: row.url || row.website || row.domain || '',
        company: row.company || row.business || '',
        contactName: row.contact_name || row.name || '',
        email: row.email || '',
        goal: row.goal || 'Leads & Conversions'
      };
    }).filter((p) => p.url);
  }

  // Plain text file (one URL/domain per line)
  return lines.map((url) => ({ url, company: '', contactName: '', email: '', goal: 'Leads & Conversions' }));
}

function escapeCsvCell(value) {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildOutreachCopy(prospect, audit) {
  const issues = audit.findings.filter((f) => f.severity !== 'pass').slice(0, 2);
  const issueBullets = issues.map((i) => `- ${i.title}: ${i.impact}`).join('\n');
  const greetingName = prospect.contactName || 'there';
  const companyLabel = prospect.company || audit.domain;

  const emailSubject = `Quick ${audit.domain} audit (${audit.scores.overall}/100) + free SEO patch`;
  const emailBody =
    `Hi ${greetingName},\n\n` +
    `I ran an automated technical & conversion check on ${audit.domain} for ${companyLabel} and noticed it scored ${audit.scores.overall}/100:\n\n` +
    `${issueBullets || '- Minor optimization opportunities detected.'}\n\n` +
    `I generated an interactive report with a free copy-paste <head> & JSON-LD schema patch for your site here:\n` +
    `${audit.reportUrl}\n\n` +
    `If you'd like PS DigiLabs to implement all fixes in ${audit.offer.turnaround}, you can deploy the ${audit.offer.tierName} (USD $${audit.offer.priceUsd}) directly from the report page.\n\n` +
    `Best regards,\nPS DigiLabs (https://www.psdigilabs.in)\n` +
    `---\nReply "unsubscribe" if you'd prefer not to receive website audit notes.`;

  return {
    emailSubject,
    emailBody,
    whatsappMessage: siteAuditService.formatWhatsAppAuditSummary(audit)
  };
}

async function runBatchAudit(prospects, options = {}) {
  const maxScore = Number.isFinite(options.maxScore) ? options.maxScore : 75;
  const concurrency = Math.max(1, Math.min(10, Number(options.concurrency) || 3));
  const outDir = options.outDir || DEFAULT_OUT_DIR;

  const results = [];
  const errors = [];
  let cursor = 0;

  async function worker() {
    while (cursor < prospects.length) {
      const idx = cursor++;
      const prospect = prospects[idx];
      try {
        const audit = await siteAuditService.runAudit(prospect.url, {
          goal: prospect.goal || 'Leads & Conversions',
          requester: {
            name: prospect.contactName || prospect.company || '',
            email: prospect.email || ''
          },
          skipExternal: Boolean(options.skipExternal),
          mockFetch: options.mockFetch
        });

        const qualified = audit.scores.overall <= maxScore;
        const outreach = qualified ? buildOutreachCopy(prospect, audit) : null;

        results.push({
          prospect,
          auditId: audit.id,
          domain: audit.domain,
          score: audit.scores.overall,
          offerUsd: audit.offer.priceUsd,
          reportUrl: audit.reportUrl,
          checkoutUrl: audit.offer.checkoutUrl,
          qualified,
          outreach
        });
      } catch (err) {
        errors.push({ url: prospect.url, error: err.message });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const qualifiedLeads = results.filter((r) => r.qualified);

  if (!options.skipWrite) {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const stamp = new Date().toISOString().slice(0, 10);
    const jsonPath = path.join(outDir, `outreach-pack-${stamp}.json`);
    const csvPath = path.join(outDir, `outreach-pack-${stamp}.csv`);

    fs.writeFileSync(jsonPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalScanned: prospects.length,
      qualifiedCount: qualifiedLeads.length,
      errorCount: errors.length,
      qualifiedLeads,
      errors
    }, null, 2));

    const csvHeader = ['domain', 'company', 'contact_name', 'email', 'score', 'offer_usd', 'report_url', 'checkout_url', 'email_subject', 'email_body'];
    const csvRows = qualifiedLeads.map((item) => [
      item.domain,
      item.prospect.company,
      item.prospect.contactName,
      item.prospect.email,
      item.score,
      item.offerUsd,
      item.reportUrl,
      item.checkoutUrl,
      item.outreach.emailSubject,
      item.outreach.emailBody
    ].map(escapeCsvCell).join(','));

    fs.writeFileSync(csvPath, [csvHeader.join(','), ...csvRows].join('\n'));
    return { results, qualifiedLeads, errors, jsonPath, csvPath };
  }

  return { results, qualifiedLeads, errors };
}

function parseCliArgs(argv) {
  const args = {
    input: path.join(__dirname, '../data/prospects.sample.csv'),
    maxScore: 75,
    concurrency: 3
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input' && argv[i + 1]) args.input = path.resolve(argv[++i]);
    if (argv[i] === '--max-score' && argv[i + 1]) args.maxScore = parseInt(argv[++i], 10);
    if (argv[i] === '--concurrency' && argv[i + 1]) args.concurrency = parseInt(argv[++i], 10);
  }
  return args;
}

if (require.main === module) {
  const args = parseCliArgs(process.argv.slice(2));
  const prospects = parseProspectsFile(args.input);
  console.log(`🔍 Scanning ${prospects.length} prospects (maxScore <= ${args.maxScore}, concurrency=${args.concurrency})...`);
  runBatchAudit(prospects, args).then((summary) => {
    console.log(`✅ Completed: ${summary.results.length} audited, ${summary.qualifiedLeads.length} qualified, ${summary.errors.length} errors`);
    if (summary.jsonPath) console.log(`📄 JSON Pack: ${summary.jsonPath}`);
    if (summary.csvPath) console.log(`📊 CSV Pack:  ${summary.csvPath}`);
  }).catch((err) => {
    console.error('❌ Batch audit failed:', err);
    process.exit(1);
  });
}

module.exports = {
  parseProspectsFile,
  buildOutreachCopy,
  runBatchAudit
};
