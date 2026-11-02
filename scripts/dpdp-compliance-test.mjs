// End-to-end compliance checks against a running server.
// It creates and erases test records, so NEVER point it at production data.
//
//   BASE_URL=http://localhost:3100 TEST_ADMIN_EMAIL=... TEST_ADMIN_PASSWORD=... \
//   DATABASE_URL=file:/path/to/throwaway.db RETENTION_CRON_SECRET=... \
//   node scripts/dpdp-compliance-test.mjs [report.md]
import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const BASE = process.env.BASE_URL || 'http://localhost:3100';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(BASE)) {
  console.error('Refusing to run: this suite erases records and creates accounts, so it only runs against localhost.');
  process.exit(2);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD (a SUPER_ADMIN on a throwaway database).');
  process.exit(2);
}

const prisma = new PrismaClient();
const results = [];
let ipCounter = 10;
const uniqueIp = () => `203.0.113.${ipCounter++ % 250}`;
const run = Date.now().toString().slice(-7);

async function check(area, name, fn) {
  try {
    await fn();
    results.push({ area, name, pass: true });
    console.log(`PASS  [${area}] ${name}`);
  } catch (error) {
    results.push({ area, name, pass: false, detail: error.message });
    console.log(`FAIL  [${area}] ${name}\n      ${error.message}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function equal(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

async function http(path, { method = 'GET', body, cookie, headers = {}, ip, form, redirect = 'manual' } = {}) {
  // The site uses trailingSlash, and browsers follow that redirect for API calls.
  const url = path.startsWith('/api/') ? path.replace(/^([^?]*?)\/?(\?|$)/, '$1/$2') : path;
  const response = await fetch(`${BASE}${url}`, {
    method,
    redirect,
    headers: {
      'x-forwarded-for': ip || uniqueIp(),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Pages and files are not JSON.
  }
  return { status: response.status, headers: response.headers, text, json };
}

async function login(email, password) {
  const response = await http('/api/admin/auth', { method: 'POST', body: { email, password } });
  const setCookie = response.headers.get('set-cookie') || '';
  const match = setCookie.match(/vv_admin_session=[^;]+/);
  return { status: response.status, cookie: match ? match[0] : null };
}

const leadBody = (phone, extra = {}) => ({
  fullName: 'Test Person',
  phone,
  email: `${phone}@example.test`,
  city: 'Patna',
  budget: '₹ 10 - 16 Lac',
  project: 'Test Project',
  message: 'Please call me',
  source: 'project_enquiry_section',
  consentPrimary: true,
  noticeLanguage: 'en',
  ...extra,
});

const PDF = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n');

function applicationForm(phone, { consent = true, file = PDF, name = 'resume.pdf' } = {}) {
  const form = new FormData();
  form.append('fullName', 'Test Applicant');
  form.append('email', `${phone}@example.test`);
  form.append('phone', phone);
  form.append('jobTitle', 'Site Engineer');
  if (consent) form.append('consentPrimary', 'true');
  form.append('resume', new Blob([file]), name);
  return form;
}

const phoneA = `98${run}01`;
const phoneB = `98${run}02`;
const phoneC = `98${run}03`;
const phoneD = `98${run}04`;
const phoneE = `98${run}05`;

const admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
if (!admin.cookie) {
  console.error(`Could not sign in as the test admin (HTTP ${admin.status}).`);
  process.exit(2);
}
const cookie = admin.cookie;

const findLead = async (phone) => {
  const { json } = await http(`/api/admin/leads?search=${phone}`, { cookie });
  return json.leads[0];
};

// ---------------------------------------------------------------- pages & notices
for (const path of ['/', '/contact/', '/projects/', '/careers/', '/careers/apply/', '/privacy-policy/', '/privacy-rights/', '/terms-and-conditions/', '/blog/']) {
  await check('Regression', `${path} loads`, async () => equal((await http(path)).status, 200, 'status'));
}

await check('Notices', 'Contact form shows a notice and unticked consent boxes, with Hindi available', async () => {
  const { text } = await http('/contact/');
  expect(text.includes('name="consentPrimary"'), 'primary consent box missing');
  expect(text.includes('name="consentMarketing"'), 'marketing consent box missing');
  const boxes = text.match(/<input[^>]*name="consent(Primary|Marketing)"[^>]*>/g) || [];
  expect(boxes.length === 2 && boxes.every((box) => !/\schecked/.test(box)), 'a consent box is pre-ticked');
  expect(text.includes('हिन्दी'), 'Hindi option missing');
  expect(text.includes('/privacy-policy/'), 'policy link missing');
});

await check('Notices', 'Footer links to the policy and rights page, and the rights page names the privacy contact', async () => {
  const { text } = await http('/privacy-rights/');
  expect(text.includes('/privacy-policy'), 'policy link missing');
  expect(text.includes('privacy@vastuvihar.org'), 'privacy contact missing');
  expect(text.includes('complaint.officer@vastuvihar.org'), 'escalation contact missing');
});

await check('Notices', 'Policy no longer claims MFA or analytics the site does not have', async () => {
  const { text } = await http('/privacy-policy/');
  expect(!/multi-factor/i.test(text), 'policy still claims MFA');
  expect(!/Analytics &amp; Performance Cookies/.test(text), 'policy still lists analytics cookies');
  expect(text.includes('does not use analytics'), 'no-analytics statement missing');
});

await check('Tracking', 'No third-party frame or tracking script in the server-rendered pages', async () => {
  for (const path of ['/', '/contact/', '/projects/']) {
    const { text } = await http(path);
    expect(!/<iframe/i.test(text), `${path} renders an iframe before consent`);
    expect(!/googletagmanager|google-analytics|connect\.facebook|clarity\.ms|hotjar/i.test(text), `${path} loads a tracker`);
  }
});

// ---------------------------------------------------------------- consent
await check('Consent', 'An enquiry without consent is rejected and nothing is stored', async () => {
  const response = await http('/api/leads', { method: 'POST', body: leadBody(phoneA, { consentPrimary: false }) });
  equal(response.status, 400, 'status');
  expect(!(await findLead(phoneA)), 'lead was stored');
});

await check('Consent', 'An enquiry with consent succeeds without marketing consent', async () => {
  equal((await http('/api/leads', { method: 'POST', body: leadBody(phoneA) })).status, 201, 'status');
  const lead = await findLead(phoneA);
  expect(lead, 'lead missing');
  equal(lead.marketingConsent, false, 'marketingConsent');
});

await check('Data minimisation', 'Form fields are stored, and IP and browser details are not', async () => {
  const lead = await prisma.lead.findFirst({ where: { phone: phoneA } });
  equal(lead.city, 'Patna', 'city');
  equal(lead.project, 'Test Project', 'project');
  equal(lead.source, 'project_enquiry_section', 'source');
  equal(lead.ipAddress, null, 'ipAddress');
  equal(lead.userAgent, null, 'userAgent');
  equal(lead.country, null, 'country');
});

await check('Data minimisation', 'Only name and phone are mandatory on an enquiry', async () => {
  const response = await http('/api/leads', {
    method: 'POST',
    body: { fullName: 'Min Person', phone: phoneE, consentPrimary: true },
  });
  equal(response.status, 201, 'status');
});

await check('Consent', 'The consent record holds purpose, version, language and time, in hashed form', async () => {
  const lead = await prisma.lead.findFirst({ where: { phone: phoneA } });
  const record = await prisma.consentRecord.findFirst({ where: { recordId: lead.id } });
  expect(record, 'no consent record');
  equal(record.purpose, 'enquiry_response', 'purpose');
  equal(record.action, 'GRANTED', 'action');
  expect(record.noticeVersion, 'version missing');
  equal(record.language, 'en', 'language');
  expect(record.createdAt, 'time missing');
  expect(!JSON.stringify(record).includes(phoneA), 'phone stored in plain text');
});

await check('Marketing', 'Marketing consent is separate and recorded on its own', async () => {
  equal((await http('/api/leads', { method: 'POST', body: leadBody(phoneB, { consentMarketing: true }) })).status, 201, 'status');
  const lead = await findLead(phoneB);
  equal(lead.marketingConsent, true, 'marketingConsent');
  const records = await prisma.consentRecord.findMany({ where: { recordId: lead.id } });
  equal(records.length, 2, 'consent records');
  expect(records.some((r) => r.purpose === 'marketing_communications'), 'no marketing record');
});

await check('Marketing', 'Opt-out updates the record, adds a suppression and logs a withdrawal', async () => {
  const response = await http('/api/privacy/marketing-opt-out', { method: 'POST', body: { contact: phoneB } });
  equal(response.status, 200, 'status');
  const lead = await findLead(phoneB);
  equal(lead.marketingConsent, false, 'marketingConsent');
  expect(lead.marketingWithdrawnAt, 'withdrawal time missing');
  expect((await prisma.marketingSuppression.count()) >= 2, 'phone and linked email not suppressed');
  const withdrawn = await prisma.consentRecord.count({ where: { purpose: 'marketing_communications', action: 'WITHDRAWN' } });
  expect(withdrawn >= 1, 'no withdrawal record');
});

await check('Marketing', 'Opt-out gives the same answer for an unknown contact', async () => {
  const known = await http('/api/privacy/marketing-opt-out', { method: 'POST', body: { contact: phoneB } });
  const unknown = await http('/api/privacy/marketing-opt-out', { method: 'POST', body: { contact: `97${run}99` } });
  equal(unknown.status, known.status, 'status');
  equal(unknown.json.message, known.json.message, 'message');
});

const consentId = `${run}`.padEnd(32, 'a');
await check('Cookies', 'Each cookie category is logged separately, without contact data', async () => {
  const body = { browserId: consentId, choices: { media: true, analytics: false, advertising: true }, source: 'cookie_banner' };
  equal((await http('/api/privacy/cookie-consent', { method: 'POST', body })).status, 201, 'status');
  const rows = await prisma.consentRecord.findMany({ where: { recordType: 'browser' }, orderBy: { createdAt: 'desc' }, take: 3 });
  const actionFor = (purpose) => rows.find((row) => row.purpose === purpose)?.action;
  equal(actionFor('third_party_media'), 'GRANTED', 'media');
  equal(actionFor('analytics_cookies'), 'WITHDRAWN', 'analytics');
  equal(actionFor('remarketing_cookies'), 'GRANTED', 'advertising');
  for (const row of rows) {
    equal(row.phoneKey, null, 'phoneKey');
    equal(row.emailKey, null, 'emailKey');
    expect(row.browserKey && !row.browserKey.includes(consentId), 'browser ID not hashed');
  }
});

await check('Cookies', 'A malformed ID or an empty choice is refused', async () => {
  const post = (body) => http('/api/privacy/cookie-consent', { method: 'POST', body });
  equal((await post({ browserId: 'not-hex', choices: { media: true } })).status, 400, 'ID');
  equal((await post({ browserId: consentId, choices: {} })).status, 400, 'empty');
  equal((await post({ browserId: consentId, choices: { media: 'yes' } })).status, 400, 'not boolean');
});

await check('Cookies', 'The cookie log finds one visitor by consent ID, and its download is audited', async () => {
  const { json, status } = await http(`/api/admin/privacy/cookies?consentId=${consentId}`, { cookie });
  equal(status, 200, 'status');
  equal(json.total, 3, 'rows for this visitor');
  expect(json.summary.some((row) => row.purpose === 'analytics_cookies' && row.action === 'WITHDRAWN'), 'summary');
  expect(!JSON.stringify(json.rows).includes(consentId), 'raw ID returned');
  const csv = await http(`/api/admin/privacy/cookies?consentId=${consentId}&format=csv`, { cookie });
  equal(csv.status, 200, 'csv status');
  expect(csv.text.includes('remarketing_cookies'), 'csv content');
  expect(await prisma.auditLog.findFirst({ where: { action: 'cookie_log.exported' } }), 'export not audited');
});

await check('Cookies', 'The log rejects anyone who is not signed in', async () => {
  equal((await http('/api/admin/privacy/cookies')).status, 401, 'cookie log');
  equal((await http('/api/admin/newsletter')).status, 401, 'newsletter');
});

await check('Tracking', 'With no tag IDs set, the security policy allows no tracker hosts', async () => {
  const csp = (await http('/')).headers.get('content-security-policy') || '';
  expect(csp.includes("default-src 'self'"), 'policy missing');
  expect(!/googletagmanager|google-analytics|facebook|doubleclick/.test(csp), 'tracker host allowed');
});

// ---------------------------------------------------------------- newsletter
const subscribe = (email, extra = {}) =>
  http('/api/newsletter', { method: 'POST', body: { email, consentPrimary: 'true', noticeLanguage: 'en', ...extra } });
const subscriberEmail = `news.${run}@example.test`;

await check('Newsletter', 'Signing up needs the consent box, and is recorded with hashed proof', async () => {
  equal((await subscribe(subscriberEmail, { consentPrimary: '' })).status, 400, 'no consent');
  equal(await prisma.newsletterSubscriber.count({ where: { email: subscriberEmail } }), 0, 'stored without consent');
  equal((await subscribe(subscriberEmail)).status, 200, 'status');
  const stored = await prisma.newsletterSubscriber.findUnique({ where: { email: subscriberEmail } });
  equal(stored.status, 'SUBSCRIBED', 'subscriber status');
  const proof = await prisma.consentRecord.findFirst({ where: { recordId: stored.id, purpose: 'newsletter' } });
  equal(proof.action, 'GRANTED', 'ledger');
  expect(proof.emailKey && !JSON.stringify(proof).includes(subscriberEmail), 'email in the ledger');
});

await check('Newsletter', 'A second sign-up neither duplicates the entry nor adds to the ledger', async () => {
  const stored = await prisma.newsletterSubscriber.findUnique({ where: { email: subscriberEmail } });
  equal((await subscribe(subscriberEmail)).status, 200, 'status');
  equal(await prisma.consentRecord.count({ where: { recordId: stored.id } }), 1, 'ledger rows');
});

await check('Newsletter', 'The admin list and download show subscribers', async () => {
  const list = await http('/api/admin/newsletter?status=SUBSCRIBED', { cookie });
  equal(list.status, 200, 'status');
  expect(list.json.subscribers.some((row) => row.email === subscriberEmail), 'not listed');
  const csv = await http('/api/admin/newsletter?format=csv', { cookie });
  expect(csv.text.includes(subscriberEmail), 'not in download');
});

await check('Newsletter', 'Stop Marketing unsubscribes, drops them from the download, and a new tick cannot undo it', async () => {
  equal((await http('/api/privacy/marketing-opt-out', { method: 'POST', body: { contact: subscriberEmail } })).status, 200, 'opt-out');
  const stored = await prisma.newsletterSubscriber.findUnique({ where: { email: subscriberEmail } });
  equal(stored.status, 'UNSUBSCRIBED', 'status');
  expect(stored.unsubscribedAt, 'time not recorded');
  const proof = await prisma.consentRecord.findFirst({ where: { recordId: stored.id, purpose: 'newsletter', action: 'WITHDRAWN' } });
  expect(proof, 'withdrawal not logged');
  const csv = await http('/api/admin/newsletter?format=csv', { cookie });
  expect(!csv.text.includes(subscriberEmail), 'still in download');
  equal((await subscribe(subscriberEmail)).status, 200, 'resubscribe answers normally');
  equal((await prisma.newsletterSubscriber.findUnique({ where: { email: subscriberEmail } })).status, 'UNSUBSCRIBED', 'resubscribed');
});

// ---------------------------------------------------------------- applications & resumes
let resumeUrl;
await check('Forms', 'An application without consent is rejected', async () => {
  equal((await http('/api/careers/apply', { method: 'POST', form: applicationForm(phoneC, { consent: false }) })).status, 400, 'status');
});

await check('Security', 'A file disguised as a PDF is rejected', async () => {
  const form = applicationForm(phoneC, { file: Buffer.from('<script>alert(1)</script>') });
  equal((await http('/api/careers/apply', { method: 'POST', form })).status, 400, 'status');
});

await check('Security', 'A resume over 5MB is rejected', async () => {
  const big = Buffer.concat([PDF, Buffer.alloc(6 * 1024 * 1024)]);
  const response = await http('/api/careers/apply', { method: 'POST', form: applicationForm(phoneC, { file: big }) });
  expect([400, 413].includes(response.status), `status ${response.status}`);
});

await check('Forms', 'A valid application is stored with a private, nameless resume path', async () => {
  equal((await http('/api/careers/apply', { method: 'POST', form: applicationForm(phoneC) })).status, 201, 'status');
  const stored = await prisma.jobApplication.findFirst({ where: { phone: phoneC } });
  expect(stored.resumePath.startsWith('private:'), 'not in private storage');
  expect(!/test|applicant/i.test(stored.resumePath), 'file name reveals the applicant');
  const { json } = await http(`/api/admin/applications?search=${phoneC}`, { cookie });
  resumeUrl = json.applications[0].resumePath;
  expect(resumeUrl.startsWith('/api/admin/applications/'), 'staff response exposes the stored path');
});

await check('Security', 'Resumes cannot be fetched from the public folder or without signing in', async () => {
  for (const path of ['/uploads/resumes/anything.pdf', '/uploads/%72esumes/anything.pdf', '/UPLOADS/Resumes/anything.pdf']) {
    equal((await http(path)).status, 404, path);
  }
  equal((await http(resumeUrl)).status, 401, 'anonymous download');
});

await check('Security', 'Authorised resume download works, forces a download and is audited', async () => {
  const response = await http(resumeUrl, { cookie });
  equal(response.status, 200, 'status');
  expect(/attachment/.test(response.headers.get('content-disposition') || ''), 'not an attachment');
  const logged = await prisma.auditLog.count({ where: { action: 'application.resume_downloaded' } });
  expect(logged >= 1, 'download not audited');
});

// ---------------------------------------------------------------- blog & comments
let postSlug;
let postId;
await check('Security', 'Blog HTML is sanitised when saved', async () => {
  const form = new FormData();
  form.append('title', `Test post ${run}`);
  form.append('content', '<p>Safe</p><script>alert(1)</script><img src="x" onerror="alert(2)"><a href="javascript:alert(3)">x</a>');
  const response = await http('/api/admin/blogs', { method: 'POST', form, cookie });
  equal(response.status, 200, 'status');
  postSlug = response.json.blog.slug;
  postId = response.json.blog.id;
  const content = response.json.blog.content;
  expect(!/<script|onerror|javascript:/i.test(content), `unsafe HTML kept: ${content}`);
  expect(content.includes('<p>Safe</p>'), 'safe HTML removed');
});

await check('Security', 'Unsafe blog HTML already in the database is cleaned on render', async () => {
  await prisma.blogPost.update({ where: { id: postId }, data: { content: '<p>Old</p><script>window.__x=1</script>' } });
  const { text } = await http(`/blog/${postSlug}/`);
  expect(text.includes('<p>Old</p>'), 'content missing');
  expect(!text.includes('window.__x=1'), 'script rendered');
});

const commentName = `Commenter ${run}`;
await check('Forms', 'A comment needs consent, and stays hidden until approved', async () => {
  const base = { postId, authorName: commentName, authorEmail: `${phoneA}@example.test`, content: 'Nice post' };
  equal((await http('/api/comments', { method: 'POST', body: base })).status, 400, 'without consent');
  const created = await http('/api/comments', { method: 'POST', body: { ...base, consentPrimary: true } });
  equal(created.status, 201, 'with consent');
  expect(!JSON.stringify(created.json).includes('example.test'), 'response echoes the email');
  expect(!(await http(`/blog/${postSlug}/`)).text.includes(commentName), 'published before approval');
});

await check('Admin', 'Approving a comment publishes it, without exposing the email', async () => {
  const { json } = await http('/api/admin/privacy/comments', { cookie });
  const comment = json.comments.find((row) => row.authorName === commentName);
  equal((await http('/api/admin/privacy/comments', { method: 'PATCH', body: { id: comment.id, isApproved: true }, cookie })).status, 200, 'status');
  const { text } = await http(`/blog/${postSlug}/`);
  expect(text.includes(commentName), 'not published');
  expect(!text.includes(`${phoneA}@example.test`), 'email published');
});

// ---------------------------------------------------------------- access control
await check('Security', 'Old public endpoints are gone', async () => {
  equal((await http('/api/leads')).status, 405, 'GET /api/leads');
  equal((await http('/api/careers/apply')).status, 405, 'GET /api/careers/apply');
  equal((await http('/api/chat', { method: 'POST', body: { message: 'hi' } })).status, 404, '/api/chat');
});

const protectedRoutes = [
  ['GET', '/api/admin/leads'],
  ['GET', '/api/admin/leads/export'],
  ['DELETE', '/api/admin/leads?id=x'],
  ['GET', '/api/admin/applications'],
  ['GET', '/api/admin/vacancies'],
  ['GET', '/api/admin/blogs'],
  ['POST', '/api/admin/blogs'],
  ['DELETE', '/api/admin/blogs?id=x'],
  ['POST', '/api/admin/blogs/upload'],
  ['GET', '/api/admin/privacy/requests'],
  ['GET', '/api/admin/privacy/records?view=audit'],
  ['GET', '/api/admin/privacy/comments'],
  ['GET', '/api/admin/privacy/breaches'],
  ['GET', '/api/admin/privacy/retention'],
  ['POST', '/api/admin/privacy/holds'],
  ['GET', '/api/admin/users'],
];
await check('Security', `All ${protectedRoutes.length} admin endpoints refuse anonymous callers`, async () => {
  for (const [method, path] of protectedRoutes) {
    equal((await http(path, { method })).status, 401, `${method} ${path}`);
  }
});

await check('Security', 'The old hard-coded admin password no longer works', async () => {
  const response = await http('/api/admin/auth', { method: 'POST', body: { password: 'vastu@admin2025' } });
  equal(response.status, 401, 'status');
  const stale = Buffer.from('vastu@admin2025').toString('base64');
  equal((await http('/api/admin/leads', { cookie: `vv_admin_token=${stale}` })).status, 401, 'old cookie');
});

const TEST_PASSWORD = `Test-Password-${run}!`;
const roleCookies = {};
for (const role of ['SALES', 'HR', 'CONTENT', 'PRIVACY_OFFICER']) {
  await check('RBAC', `A ${role} account can be created and sign in`, async () => {
    const email = `${role.toLowerCase()}.${run}@example.test`;
    equal((await http('/api/admin/users', { method: 'POST', body: { email, name: role, role, password: TEST_PASSWORD }, cookie })).status, 201, 'create');
    const session = await login(email, TEST_PASSWORD);
    expect(session.cookie, 'no session');
    roleCookies[role] = session.cookie;
  });
}

const matrix = [
  ['SALES', 'GET', '/api/admin/leads', 200],
  ['SALES', 'GET', '/api/admin/applications', 403],
  ['SALES', 'GET', '/api/admin/privacy/requests', 403],
  ['SALES', 'GET', '/api/admin/users', 403],
  ['SALES', 'GET', '/api/admin/newsletter', 403],
  ['SALES', 'GET', '/api/admin/privacy/cookies', 403],
  ['CONTENT', 'GET', '/api/admin/newsletter', 200],
  ['CONTENT', 'GET', '/api/admin/privacy/cookies', 403],
  ['PRIVACY_OFFICER', 'GET', '/api/admin/newsletter', 200],
  ['PRIVACY_OFFICER', 'GET', '/api/admin/privacy/cookies', 200],
  ['HR', 'GET', '/api/admin/applications', 200],
  ['HR', 'GET', '/api/admin/leads', 403],
  ['HR', 'GET', '/api/admin/leads/export', 403],
  ['CONTENT', 'GET', '/api/admin/blogs', 200],
  ['CONTENT', 'GET', '/api/admin/leads', 403],
  ['CONTENT', 'GET', '/api/admin/privacy/records?view=audit', 403],
  ['PRIVACY_OFFICER', 'GET', '/api/admin/privacy/requests', 200],
  ['PRIVACY_OFFICER', 'GET', '/api/admin/privacy/breaches', 200],
  ['PRIVACY_OFFICER', 'GET', '/api/admin/users', 403],
  ['PRIVACY_OFFICER', 'GET', '/api/admin/leads/export', 403],
];
await check('RBAC', `Permission matrix holds across ${matrix.length} role and endpoint pairs`, async () => {
  for (const [role, method, path, expected] of matrix) {
    equal((await http(path, { method, cookie: roleCookies[role] })).status, expected, `${role} ${path}`);
  }
});

await check('RBAC', 'Disabling an account ends its session immediately', async () => {
  const { json } = await http('/api/admin/users', { cookie });
  const sales = json.users.find((user) => user.role === 'SALES');
  equal((await http('/api/admin/users', { method: 'PATCH', body: { id: sales.id, isActive: false }, cookie })).status, 200, 'disable');
  equal((await http('/api/admin/leads', { cookie: roleCookies.SALES })).status, 401, 'old session');
});

await check('Security', 'Five wrong passwords lock the account, even for the right password', async () => {
  const email = `lock.${run}@example.test`;
  await http('/api/admin/users', { method: 'POST', body: { email, name: 'Lock', role: 'CONTENT', password: TEST_PASSWORD }, cookie });
  for (let attempt = 0; attempt < 5; attempt++) {
    equal((await login(email, 'wrong-password-value')).status, 401, 'wrong password');
  }
  const locked = await login(email, TEST_PASSWORD);
  equal(locked.status, 401, 'locked');
  equal(locked.cookie, null, 'session while locked');
});

await check('Security', 'Login errors do not reveal whether an account exists', async () => {
  const unknown = await http('/api/admin/auth', { method: 'POST', body: { email: 'nobody@example.test', password: 'x'.repeat(12) } });
  const known = await http('/api/admin/auth', { method: 'POST', body: { email: ADMIN_EMAIL, password: 'x'.repeat(12) } });
  equal(unknown.status, known.status, 'status');
  equal(unknown.json.error, known.json.error, 'message');
});

await check('Security', 'Session cookie is HttpOnly and SameSite, and sign-out invalidates it on the server', async () => {
  const response = await http('/api/admin/auth', { method: 'POST', body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } });
  const header = response.headers.get('set-cookie') || '';
  expect(/HttpOnly/i.test(header), 'not HttpOnly');
  expect(/SameSite=lax/i.test(header), 'no SameSite');
  const session = header.match(/vv_admin_session=[^;]+/)[0];
  equal((await http('/api/admin/auth', { method: 'DELETE', cookie: session })).status, 200, 'logout');
  equal((await http('/api/admin/leads', { cookie: session })).status, 401, 'after logout');
});

await check('Security', 'Cross-site POSTs are rejected on public and admin endpoints', async () => {
  const headers = { Origin: 'https://evil.example' };
  equal((await http('/api/leads', { method: 'POST', body: leadBody(phoneD), headers })).status, 403, 'public');
  equal((await http('/api/admin/privacy/holds', { method: 'POST', body: {}, headers, cookie })).status, 403, 'admin');
});

await check('Security', 'Blog uploads refuse SVG and files that are not images', async () => {
  const svg = new FormData();
  svg.append('file', new Blob(['<svg onload="alert(1)"/>']), 'x.svg');
  equal((await http('/api/admin/blogs/upload', { method: 'POST', form: svg, cookie })).status, 400, 'svg');
  const fake = new FormData();
  fake.append('file', new Blob(['<html>']), 'x.png');
  equal((await http('/api/admin/blogs/upload', { method: 'POST', form: fake, cookie })).status, 400, 'fake png');
});

await check('Security', 'Security headers are present and the framework header is hidden', async () => {
  const { headers } = await http('/');
  const csp = headers.get('content-security-policy') || '';
  expect(csp.includes("frame-ancestors 'none'"), 'CSP frame-ancestors');
  expect(csp.includes("object-src 'none'"), 'CSP object-src');
  expect((headers.get('strict-transport-security') || '').includes('max-age='), 'HSTS');
  equal(headers.get('x-frame-options'), 'DENY', 'X-Frame-Options');
  equal(headers.get('x-content-type-options'), 'nosniff', 'nosniff');
  expect(headers.get('referrer-policy'), 'Referrer-Policy');
  equal(headers.get('x-powered-by'), null, 'X-Powered-By');
});

await check('Security', 'HTTP requests redirect to HTTPS behind a proxy', async () => {
  // Needs a second server started with FORCE_HTTPS=1, addressed by HTTPS_TEST_URL.
  const target = process.env.HTTPS_TEST_URL;
  if (!target) throw new Error('HTTPS_TEST_URL not set, so this was not tested');
  const response = await fetch(`${target}/contact/`, { redirect: 'manual', headers: { 'x-forwarded-proto': 'http' } });
  equal(response.status, 308, 'status');
  expect((response.headers.get('location') || '').startsWith('https://'), 'location');
});

await check('Security', 'Admin pages redirect when signed out and are marked noindex', async () => {
  const response = await http('/admin/');
  expect([307, 308].includes(response.status), `status ${response.status}`);
  expect((response.headers.get('location') || '').includes('/admin/login'), 'location');
  expect((await http('/admin/login/')).headers.get('x-robots-tag')?.includes('noindex'), 'noindex');
});

await check('Security', 'Bad input is rejected', async () => {
  equal((await http('/api/leads', { method: 'POST', body: leadBody('12ab') })).status, 400, 'phone');
  equal((await http('/api/leads', { method: 'POST', body: leadBody(phoneD, { email: 'not-an-email' }) })).status, 400, 'email');
  const lead = await findLead(phoneA);
  equal((await http('/api/admin/leads', { method: 'PATCH', body: { id: lead.id, status: 'HACKED' }, cookie })).status, 400, 'status');
});

await check('Security', 'A spoofed source value is not stored', async () => {
  equal((await http('/api/leads', { method: 'POST', body: leadBody(phoneD, { source: '<b>evil</b>' }) })).status, 201, 'status');
  equal((await findLead(phoneD)).source, 'contact_section', 'source');
});

await check('Security', 'CSV export neutralises spreadsheet formulas, omits IP and is audited', async () => {
  const phone = `96${run}06`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone, { fullName: '=HYPERLINK("http://evil")' }) });
  const { text, status } = await http('/api/admin/leads/export', { cookie });
  equal(status, 200, 'status');
  expect(text.includes(`"'=HYPERLINK`), 'formula not neutralised');
  expect(!/IP Address/i.test(text.split('\n')[0]), 'IP column present');
  expect((await prisma.auditLog.count({ where: { action: 'lead.exported' } })) >= 1, 'export not audited');
});

await check('Security', 'Repeated enquiries from one address are rate limited', async () => {
  const ip = '198.51.100.7';
  let last = 0;
  for (let attempt = 0; attempt < 6; attempt++) {
    last = (await http('/api/leads', { method: 'POST', ip, body: leadBody(`95${run}${attempt}0`) })).status;
  }
  equal(last, 429, 'sixth attempt');
});

// ---------------------------------------------------------------- rights workflow
const raise = async (body) => (await http('/api/privacy/requests', { method: 'POST', body })).json;
const act = (id, action, extra = {}) => {
  // Most checks confirm every channel on the request. The binding check sets its own.
  const channels = action === 'VERIFY' && extra.method && !extra.channels ? ['email', 'phone'] : extra.channels;
  return http(`/api/admin/privacy/requests/${id}`, { method: 'POST', cookie, body: { action, ...extra, channels } });
};
const requestId = async (ticketNo) => (await prisma.privacyRequest.findUnique({ where: { ticketNo } })).id;

let accessTicket;
let accessId;
await check('Access', 'A request gets a unique ticket and a response deadline', async () => {
  const created = await raise({ type: 'ACCESS', requesterName: 'Test Person', phone: phoneA, details: 'Please send my data' });
  expect(/^DPR-\d{4}-[0-9A-F]{8}$/.test(created.ticketNo), `ticket ${created.ticketNo}`);
  expect(new Date(created.dueAt) > new Date(), 'deadline');
  accessTicket = created.ticketNo;
  accessId = await requestId(accessTicket);
});

await check('Access', 'A request needs a contact detail', async () => {
  equal((await http('/api/privacy/requests', { method: 'POST', body: { type: 'ACCESS', requesterName: 'X', details: 'Y' } })).status, 400, 'status');
});

await check('Access', 'Status lookup needs the matching contact and reveals no personal data', async () => {
  const wrong = await http('/api/privacy/requests', { method: 'PUT', body: { ticketNo: accessTicket, contact: '9000000000' } });
  equal(wrong.status, 404, 'wrong contact');
  const right = await http('/api/privacy/requests', { method: 'PUT', body: { ticketNo: accessTicket, contact: phoneA } });
  equal(right.status, 200, 'right contact');
  equal(right.json.status, 'RECEIVED', 'status');
  expect(!JSON.stringify(right.json).includes(phoneA), 'contact echoed');
});

await check('Access', 'Staff cannot read or change data before identity is verified', async () => {
  for (const action of ['GENERATE_ACCESS_SUMMARY', 'APPLY_ERASURE', 'APPLY_CORRECTION', 'WITHDRAW_CONSENT']) {
    equal((await act(accessId, action, { fullName: 'X' })).status, 409, action);
  }
  const detail = await http(`/api/admin/privacy/requests/${accessId}`, { cookie });
  equal(detail.json.records.length, 0, 'records before verification');
});

await check('Access', 'Verification needs a recorded method, and a summary then covers data, consent and recipients', async () => {
  equal((await act(accessId, 'VERIFY', {})).status, 400, 'no method');
  equal((await act(accessId, 'VERIFY', { method: 'Called the number on file' })).status, 200, 'verify');
  const { json } = await act(accessId, 'GENERATE_ACCESS_SUMMARY');
  const summary = json.result;
  expect(summary.personalData.enquiries.length >= 1, 'no enquiries');
  equal(summary.personalData.enquiries[0].phone, phoneA, 'phone');
  expect(summary.consentHistory.length >= 1, 'no consent history');
  expect(summary.sharedWith.length >= 1, 'no recipients');
  expect(summary.processingActivities.length >= 1, 'no activities');
});

await check('Access', 'Every step is recorded on the request, and closing needs an outcome', async () => {
  equal((await act(accessId, 'RESOLVE', {})).status, 400, 'no outcome');
  equal((await act(accessId, 'RESOLVE', { note: 'Summary sent by email' })).status, 200, 'resolve');
  const { json } = await http(`/api/admin/privacy/requests/${accessId}`, { cookie });
  const actions = json.request.events.map((event) => event.action);
  for (const expected of ['RECEIVED', 'IDENTITY_VERIFIED', 'ACCESS_SUMMARY_GENERATED', 'RESOLVED']) {
    expect(actions.includes(expected), `missing ${expected}`);
  }
  equal(json.request.status, 'RESOLVED', 'status');
});

await check('Correction', 'A verified correction updates every store and keeps the consent ledger linked', async () => {
  const newPhone = `94${run}07`;
  const before = await prisma.consentRecord.count({ where: { recordId: (await findLead(phoneB)).id } });
  const created = await raise({ type: 'CORRECTION', requesterName: 'Test', phone: phoneB, details: 'Wrong number', newName: 'Right Name', newPhone });
  const id = await requestId(created.ticketNo);
  const stored = await prisma.privacyRequest.findUnique({ where: { id } });
  expect(stored.requestedChange.includes(newPhone), 'requested change not stored');
  await act(id, 'VERIFY', { method: 'Email on file' });
  const { json, status } = await act(id, 'APPLY_CORRECTION', { fullName: 'Right Name', phone: newPhone });
  equal(status, 200, 'status');
  expect(json.result.leads >= 1, 'no leads updated');
  const lead = await findLead(newPhone);
  equal(lead.fullName, 'Right Name', 'name');
  const summary = await raise({ type: 'ACCESS', requesterName: 'Test', phone: newPhone, details: 'Show me' });
  const summaryId = await requestId(summary.ticketNo);
  await act(summaryId, 'VERIFY', { method: 'Email on file' });
  const after = await act(summaryId, 'GENERATE_ACCESS_SUMMARY');
  expect(after.json.result.consentHistory.length >= before, 'consent history lost');
  const logged = await prisma.auditLog.findFirst({ where: { action: 'privacy_request.correction_applied', entityId: id } });
  expect(logged && !logged.metadata.includes(newPhone), 'audit entry missing or holds the phone number');
});

await check('Withdrawal', 'Consent withdrawal stops marketing, records each purpose and closes open enquiries', async () => {
  const phone = `93${run}08`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone, { consentMarketing: true }) });
  const created = await raise({ type: 'CONSENT_WITHDRAWAL', requesterName: 'Test', phone, details: 'Stop using my data' });
  const id = await requestId(created.ticketNo);
  await act(id, 'VERIFY', { method: 'Called the number on file' });
  const { json, status } = await act(id, 'WITHDRAW_CONSENT');
  equal(status, 200, 'status');
  expect(json.result.purposesWithdrawn.includes('enquiry_response'), 'enquiry purpose not withdrawn');
  const lead = await findLead(phone);
  equal(lead.marketingConsent, false, 'marketingConsent');
  equal(lead.status, 'CLOSED', 'lead status');
});

await check('Erasure', 'Erasure removes enquiries, applications, resumes, comments and the newsletter entry, and keeps only hashed consent', async () => {
  const phone = phoneC;
  const email = `${phone}@example.test`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  equal((await subscribe(email)).status, 200, 'subscribe');
  await http('/api/comments', { method: 'POST', body: { postId, authorName: 'Erase Me', authorEmail: email, content: 'Remove', consentPrimary: true } });
  const created = await raise({ type: 'ERASURE', requesterName: 'Test', email, phone, details: 'Erase me' });
  const id = await requestId(created.ticketNo);
  await act(id, 'VERIFY', { method: 'Email on file' });
  const { json, status } = await act(id, 'APPLY_ERASURE');
  equal(status, 200, 'status');
  equal(json.result.erased.leads, 1, 'leads');
  equal(json.result.erased.applications, 1, 'applications');
  equal(json.result.erased.comments, 1, 'comments');
  equal(json.result.erased.newsletter, 1, 'newsletter');
  equal(await prisma.newsletterSubscriber.count({ where: { email } }), 0, 'newsletter entry remains');
  expect(!(await findLead(phone)), 'lead remains');
  equal(await prisma.jobApplication.count({ where: { phone } }), 0, 'application remains');
  equal((await http(resumeUrl, { cookie })).status, 404, 'resume remains');
  const consents = await prisma.consentRecord.findMany();
  expect(!JSON.stringify(consents).includes(phone), 'phone in consent ledger');
  expect(consents.length > 0, 'ledger lost');
  const events = await prisma.privacyRequestEvent.findMany({ where: { requestId: id, action: 'ERASURE_APPLIED' } });
  equal(events.length, 1, 'erasure not recorded');
});

await check('Erasure', 'A legal hold keeps the record, and the outcome records the exception', async () => {
  const phone = `92${run}09`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  const lead = await findLead(phone);
  equal((await http('/api/admin/privacy/holds', { method: 'POST', cookie, body: { recordType: 'lead', id: lead.id, reason: 'Booking record: statutory retention' } })).status, 200, 'hold');
  equal((await http(`/api/admin/leads?id=${lead.id}`, { method: 'DELETE', cookie })).status, 409, 'direct delete');
  const created = await raise({ type: 'ERASURE', requesterName: 'Test', phone, details: 'Erase me' });
  const id = await requestId(created.ticketNo);
  await act(id, 'VERIFY', { method: 'Email on file' });
  const { json } = await act(id, 'APPLY_ERASURE');
  equal(json.result.erased.leads, 0, 'erased');
  equal(json.result.retained.leads.length, 1, 'retained');
  expect(await findLead(phone), 'held lead was erased');
  const stored = await prisma.privacyRequest.findUnique({ where: { id } });
  expect(stored.retentionNote?.includes('statutory retention'), 'exception not recorded');
});

await check('Identity', 'Verifying one contact never reaches records under the other', async () => {
  const victim = `89${run}20`;
  await http('/api/leads', { method: 'POST', body: leadBody(victim) });
  const created = await raise({ type: 'ERASURE', requesterName: 'Attacker', email: `attacker${run}@example.test`, phone: victim, details: 'Erase' });
  const id = await requestId(created.ticketNo);
  equal((await act(id, 'VERIFY', { method: 'Email reply' , channels: [] })).status, 400, 'no channel selected');
  equal((await act(id, 'VERIFY', { method: 'Email reply', channels: ['email'] })).status, 200, 'verify email only');
  const { json } = await act(id, 'APPLY_ERASURE');
  equal(json.result.erased.leads, 0, 'victim lead erased');
  expect(await findLead(victim), 'victim lead missing');
});

await check('Identity', 'Numbers sharing the same last digits are different people, and format variants are the same person', async () => {
  const local = `8${run}21`;
  const foreign = `+1${local}`;
  await http('/api/leads', { method: 'POST', body: leadBody(foreign, { email: undefined }) });
  await http('/api/leads', { method: 'POST', body: leadBody(local, { email: undefined }) });
  await prisma.jobApplication.create({ data: { fullName: 'Legacy', email: `legacy${run}@example.test`, phone: `+91 ${local.slice(0, 5)} ${local.slice(5)}`, jobTitle: 'Engineer' } });

  const created = await raise({ type: 'ERASURE', requesterName: 'Test', phone: `0${local}`, details: 'Erase' });
  const id = await requestId(created.ticketNo);
  await act(id, 'VERIFY', { method: 'Called', channels: ['phone'] });
  const { json } = await act(id, 'APPLY_ERASURE');
  equal(json.result.erased.leads, 1, 'leads erased');
  equal(json.result.erased.applications, 1, 'legacy-format application erased');
  expect(await prisma.lead.findFirst({ where: { phone: foreign } }), 'foreign number erased');
});

await check('Identity', 'Data actions apply only to the matching request type, and closed requests are locked', async () => {
  const phone = `87${run}22`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  const created = await raise({ type: 'ACCESS', requesterName: 'Test', phone, details: 'Show me' });
  const id = await requestId(created.ticketNo);
  await act(id, 'VERIFY', { method: 'Called' });
  equal((await act(id, 'APPLY_ERASURE')).status, 409, 'erasure on an access request');
  equal((await act(id, 'APPLY_CORRECTION', { fullName: 'X' })).status, 409, 'correction on an access request');
  expect(await findLead(phone), 'lead erased');
  await act(id, 'RESOLVE', { note: 'Done' });
  equal((await act(id, 'GENERATE_ACCESS_SUMMARY')).status, 409, 'action on a closed request');
  equal((await act(id, 'SET_STATUS', { status: 'IN_PROGRESS' })).status, 409, 'reopening');
});

await check('Marketing', 'A form tick cannot undo an opt-out', async () => {
  const phone = `86${run}23`;
  await http('/api/privacy/marketing-opt-out', { method: 'POST', body: { contact: phone } });
  equal((await http('/api/leads', { method: 'POST', body: leadBody(phone, { consentMarketing: true }) })).status, 201, 'enquiry');
  equal((await findLead(phone)).marketingConsent, false, 'marketing re-enabled');
  const lead = await prisma.lead.findFirst({ where: { phone } });
  equal(await prisma.consentRecord.count({ where: { recordId: lead.id, purpose: 'marketing_communications' } }), 0, 'false consent record');
});

await check('Marketing', 'Opting out by email also covers the phone on the same enquiry', async () => {
  const phone = `85${run}24`;
  const email = `${phone}@example.test`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone, { consentMarketing: true }) });
  await http('/api/privacy/marketing-opt-out', { method: 'POST', body: { contact: email } });
  equal((await findLead(phone)).marketingConsent, false, 'marketing still on');
  await http('/api/leads', { method: 'POST', body: leadBody(phone, { consentMarketing: true }), ip: uniqueIp() });
  await prisma.lead.updateMany({ where: { phone }, data: { createdAt: new Date(Date.now() - 600000) } });
  await http('/api/leads', { method: 'POST', body: leadBody(phone, { consentMarketing: true, email: undefined }) });
  const leads = await prisma.lead.findMany({ where: { phone } });
  expect(leads.every((lead) => !lead.marketingConsent), 'phone was not suppressed');
});

await check('Security', 'A repeat enquiry looks the same as a first one', async () => {
  const phone = `84${run}25`;
  const first = await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  const second = await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  equal(second.status, first.status, 'status');
  equal(second.json.message, first.json.message, 'message');
  equal(await prisma.lead.count({ where: { phone } }), 1, 'duplicate stored');
});

await check('Grievance', 'A grievance gets its own ticket, category, deadline and queue, and can be escalated', async () => {
  const created = await raise({ type: 'GRIEVANCE', category: 'MARKETING', requesterName: 'Test', phone: phoneA, details: 'Too many calls' });
  expect(created.ticketNo.startsWith('GRV-'), `ticket ${created.ticketNo}`);
  const id = await requestId(created.ticketNo);
  const queue = await http('/api/admin/privacy/requests?view=grievances', { cookie });
  expect(queue.json.requests.some((row) => row.id === id), 'not in grievance queue');
  equal((await act(id, 'SET_STATUS', { status: 'ESCALATED' })).status, 200, 'escalate');
  equal((await act(id, 'RESOLVE', { note: 'Removed from call list' })).status, 200, 'resolve');
  const closed = await http('/api/privacy/requests', { method: 'PUT', body: { ticketNo: created.ticketNo, contact: phoneA } });
  equal(closed.json.status, 'RESOLVED', 'public status');
});

await check('Grievance', 'The response deadline can be configured', async () => {
  equal((await http('/api/admin/privacy/retention', { method: 'PATCH', cookie, body: { settingKey: 'grievanceResponseDays', value: 7 } })).status, 200, 'set');
  const created = await raise({ type: 'GRIEVANCE', requesterName: 'Test', phone: phoneA, details: 'Check' });
  const days = (new Date(created.dueAt) - Date.now()) / 86400000;
  expect(days > 6.9 && days < 7.1, `deadline is ${days} days`);
  await http('/api/admin/privacy/retention', { method: 'PATCH', cookie, body: { settingKey: 'grievanceResponseDays', value: 30 } });
});

await check('Nomination', 'A nomination needs the nominee details, and stores them', async () => {
  equal((await http('/api/privacy/requests', { method: 'POST', body: { type: 'NOMINATION', requesterName: 'Test', phone: phoneA, details: 'Nominate' } })).status, 400, 'missing nominee');
  const created = await raise({ type: 'NOMINATION', requesterName: 'Test', phone: phoneA, details: 'Nominate', nomineeName: 'Relative', nomineeContact: '9000000001', nomineeRelation: 'Sibling' });
  const stored = await prisma.privacyRequest.findUnique({ where: { ticketNo: created.ticketNo } });
  equal(stored.nomineeName, 'Relative', 'nominee');
});

// ---------------------------------------------------------------- breach
await check('Breach', 'An incident gets a reference and a deadline, and notifications are tracked', async () => {
  const created = await http('/api/admin/privacy/breaches', { method: 'POST', cookie, body: { title: 'Test incident' } });
  equal(created.status, 201, 'create');
  const incident = created.json.incident;
  expect(incident.reference.startsWith('BR-'), 'reference');
  const hours = (new Date(incident.boardDueAt) - new Date(incident.detectedAt)) / 3600000;
  equal(hours, 72, 'deadline hours');
  const at = new Date().toISOString();
  const updated = await http('/api/admin/privacy/breaches', {
    method: 'PATCH',
    cookie,
    body: { id: incident.id, status: 'NOTIFIED', affectedCount: 12, principalsNotifiedAt: at, principalsNotifiedCount: 12, boardReportedAt: at, boardReference: 'REF-1', containmentActions: 'Rotated keys' },
  });
  equal(updated.status, 200, 'update');
  equal(updated.json.incident.principalsNotifiedCount, 12, 'count');
  expect((await prisma.auditLog.count({ where: { action: 'breach.updated', entityId: incident.id } })) >= 1, 'not audited');
});

await check('Breach', 'Only permitted roles can open the register', async () => {
  equal((await http('/api/admin/privacy/breaches', { cookie: roleCookies.HR })).status, 403, 'HR');
  equal((await http('/api/admin/privacy/breaches', { cookie: roleCookies.PRIVACY_OFFICER })).status, 200, 'privacy officer');
});

// ---------------------------------------------------------------- retention
const retention = (body) => http('/api/admin/privacy/retention', { method: 'PATCH', cookie, body });
const runRetention = (dryRun) => http('/api/admin/privacy/retention', { method: 'POST', cookie, body: { dryRun } });
const longAgo = new Date(Date.now() - 1000 * 86400000);

await check('Retention', 'Without an approved period nothing is deleted, however old the record', async () => {
  const phone = `91${run}10`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  await prisma.lead.updateMany({ where: { phone }, data: { updatedAt: longAgo } });
  const { json } = await runRetention(false);
  expect(json.results.every((row) => row.status.startsWith('skipped')), 'a category ran');
  expect(await findLead(phone), 'record was deleted');
});

await check('Retention', 'Approving a period requires a recorded basis', async () => {
  equal((await retention({ category: 'LEAD', retentionDays: 730 })).status, 400, 'no basis');
  equal((await retention({ category: 'LEAD', retentionDays: 730, legalBasis: 'Test approval' })).status, 200, 'approved');
  const { json } = await http('/api/admin/privacy/retention', { cookie });
  const policy = json.policies.find((row) => row.category === 'LEAD');
  equal(policy.retentionDays, 730, 'days');
  equal(policy.approvedBy, ADMIN_EMAIL.toLowerCase(), 'approver');
});

await check('Retention', 'Preview changes nothing, a real run deletes expired records and keeps held, recent or converted ones', async () => {
  const expired = `91${run}11`;
  const recent = `91${run}12`;
  const held = `91${run}13`;
  const converted = `91${run}14`;
  for (const phone of [expired, recent, held, converted]) {
    equal((await http('/api/leads', { method: 'POST', body: leadBody(phone) })).status, 201, 'create');
  }
  await prisma.lead.updateMany({ where: { phone: held }, data: { legalHoldReason: 'Test hold', updatedAt: longAgo } });
  await prisma.lead.updateMany({ where: { phone: converted }, data: { status: 'CONVERTED', updatedAt: longAgo } });
  await prisma.lead.updateMany({ where: { phone: expired }, data: { updatedAt: longAgo } });

  const preview = await runRetention(true);
  expect(preview.json.results.find((row) => row.category === 'LEAD').affected >= 1, 'preview count');
  expect(await findLead(expired), 'preview deleted a record');

  const live = await runRetention(false);
  expect(live.json.results.find((row) => row.category === 'LEAD').affected >= 1, 'live count');
  expect(!(await findLead(expired)), 'expired record remains');
  expect(await findLead(recent), 'recent record deleted');
  expect(await findLead(held), 'held record deleted');
  expect(await findLead(converted), 'converted record deleted without its own policy');
  expect((await prisma.retentionLog.count({ where: { runId: live.json.runId, dryRun: false, category: 'LEAD' } })) === 1, 'run not logged');
});

await check('Retention', 'Clearing old technical data respects holds and does not restart the retention clock', async () => {
  const phone = `83${run}26`;
  const held = `83${run}27`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone) });
  await http('/api/leads', { method: 'POST', body: leadBody(held) });
  const stamp = new Date(Date.now() - 400 * 86400000);
  await prisma.lead.updateMany({ where: { phone: { in: [phone, held] } }, data: { ipAddress: '203.0.113.9', createdAt: stamp, updatedAt: stamp } });
  await prisma.lead.updateMany({ where: { phone: held }, data: { legalHoldReason: 'Test hold' } });
  await retention({ category: 'LEAD_TECH_METADATA', retentionDays: 30, legalBasis: 'Test approval' });
  await retention({ category: 'LEAD', retentionDays: null });
  await runRetention(false);
  const cleared = await prisma.lead.findFirst({ where: { phone } });
  equal(cleared.ipAddress, null, 'ip not cleared');
  equal(cleared.updatedAt.getTime(), stamp.getTime(), 'clock restarted');
  equal((await prisma.lead.findFirst({ where: { phone: held } })).ipAddress, '203.0.113.9', 'held record changed');
  await retention({ category: 'LEAD_TECH_METADATA', retentionDays: null });
  await retention({ category: 'LEAD', retentionDays: 730, legalBasis: 'Test approval' });
});

await check('Retention', 'Old proof of consent is kept while its record is live', async () => {
  const phone = `82${run}28`;
  await http('/api/leads', { method: 'POST', body: leadBody(phone, { consentMarketing: true }) });
  const lead = await prisma.lead.findFirst({ where: { phone } });
  await prisma.consentRecord.updateMany({ where: { recordId: lead.id }, data: { createdAt: new Date(Date.now() - 400 * 86400000) } });
  await retention({ category: 'CONSENT_RECORD', retentionDays: 30, legalBasis: 'Test approval' });
  await runRetention(false);
  equal(await prisma.consentRecord.count({ where: { recordId: lead.id } }), 2, 'consent proof deleted');
  await retention({ category: 'CONSENT_RECORD', retentionDays: null });
});

await check('Retention', 'An expired application also loses its resume file', async () => {
  const phone = `90${run}15`;
  await http('/api/careers/apply', { method: 'POST', form: applicationForm(phone) });
  const stored = await prisma.jobApplication.findFirst({ where: { phone } });
  await prisma.jobApplication.update({ where: { id: stored.id }, data: { updatedAt: longAgo } });
  await retention({ category: 'APPLICATION', retentionDays: 365, legalBasis: 'Test approval' });
  await runRetention(false);
  equal(await prisma.jobApplication.count({ where: { id: stored.id } }), 0, 'application remains');
  equal((await http(`/api/admin/applications/${stored.id}/resume`, { cookie })).status, 404, 'resume route');
  if (process.env.PRIVATE_STORAGE_DIR) {
    const file = `${process.env.PRIVATE_STORAGE_DIR}/resumes/${stored.resumePath.replace('private:', '')}`;
    expect(!fs.existsSync(file), 'resume file remains on disk');
  }
});

await check('Retention', 'The scheduled endpoint refuses callers without the secret', async () => {
  equal((await http('/api/internal/retention', { method: 'POST' })).status, 401, 'no secret');
  equal((await http('/api/internal/retention', { method: 'POST', headers: { Authorization: 'Bearer wrong' } })).status, 401, 'wrong secret');
  if (process.env.RETENTION_CRON_SECRET) {
    const response = await http('/api/internal/retention?dryRun=1', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RETENTION_CRON_SECRET}` } });
    equal(response.status, 200, 'right secret');
  }
});

// ---------------------------------------------------------------- audit
await check('Audit', 'Administrative actions are logged without personal data', async () => {
  const entries = await prisma.auditLog.findMany();
  expect(entries.length > 10, 'too few entries');
  const dump = JSON.stringify(entries.map(({ actorEmail, ...entry }) => entry));
  for (const needle of [phoneA, phoneB, phoneC, 'Test Person', 'Please call me']) {
    expect(!dump.includes(needle), `audit log contains ${needle}`);
  }
});

await prisma.$disconnect();

// ---------------------------------------------------------------- report
const passed = results.filter((row) => row.pass).length;
const failed = results.length - passed;
console.log(`\n${passed} passed, ${failed} failed, ${results.length} total`);

const reportPath = process.argv[2];
if (reportPath) {
  const rows = results.map((row) => `| ${row.area} | ${row.name.replace(/\|/g, '/')} | ${row.pass ? 'Pass' : `**FAIL**: ${String(row.detail).replace(/\|/g, '/')}`} |`);
  fs.writeFileSync(reportPath, `| Area | Check | Result |\n|---|---|---|\n${rows.join('\n')}\n\n**${passed} passed, ${failed} failed, ${results.length} total.**\n`);
}
process.exit(failed ? 1 : 0);
