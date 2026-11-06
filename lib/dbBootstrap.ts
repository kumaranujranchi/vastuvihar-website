import { getCloudflareContext } from '@opennextjs/cloudflare';

let schemaEnsured = false;
let schemaPromise: Promise<void> | null = null;

export const INIT_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "budget" TEXT,
    "project" TEXT,
    "address" TEXT,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "ipAddress" TEXT,
    "country" TEXT,
    "userAgent" TEXT,
    "noticeVersion" TEXT,
    "noticeLanguage" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsentAt" DATETIME,
    "marketingWithdrawnAt" DATETIME,
    "adChannel" TEXT,
    "adUtmSource" TEXT,
    "adUtmMedium" TEXT,
    "adUtmCampaign" TEXT,
    "legalHoldReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "JobVacancy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "location" TEXT NOT NULL DEFAULT 'Ranchi, JH',
    "type" TEXT NOT NULL DEFAULT 'Full - Time',
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "experience" TEXT,
    "coverLetter" TEXT,
    "resumePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "noticeVersion" TEXT,
    "noticeLanguage" TEXT,
    "legalHoldReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "ChatSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "title" TEXT DEFAULT 'New Chat',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Uncategorized',
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "imagePath" TEXT,
    "imageAlt" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "author" TEXT DEFAULT 'Vastu Vihar',
    "readingTime" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "noticeVersion" TEXT,
    "noticeLanguage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ConsentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneKey" TEXT,
    "emailKey" TEXT,
    "browserKey" TEXT,
    "recordType" TEXT,
    "recordId" TEXT,
    "purpose" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "noticeVersion" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "VisitorEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "browserKey" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pagePath" TEXT,
    "referrer" TEXT,
    "adChannel" TEXT,
    "adUtmSource" TEXT,
    "adUtmMedium" TEXT,
    "adUtmCampaign" TEXT,
    "cookiesObserved" TEXT,
    "noticeVersion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "noticeVersion" TEXT,
    "noticeLanguage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "MarketingSuppression" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RateLimitHit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bucket" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "failedLogins" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "AdminSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PrivacyRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "phone" TEXT,
    "email" TEXT,
    "fullName" TEXT NOT NULL,
    "details" TEXT,
    "rejectionReason" TEXT,
    "resolutionNotes" TEXT,
    "assignedToId" TEXT,
    "dueAt" DATETIME NOT NULL,
    "resolvedAt" DATETIME,
    "noticeVersion" TEXT,
    "noticeLanguage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PrivacyRequest_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "AdminUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PrivacyRequestEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorEmail" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrivacyRequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PrivacyRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BreachIncident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DETECTED',
    "affectedCount" INTEGER,
    "dataCategories" TEXT NOT NULL,
    "detectedAt" DATETIME NOT NULL,
    "reportedDpbAt" DATETIME,
    "notifiedUsersAt" DATETIME,
    "containedAt" DATETIME,
    "remedialAction" TEXT,
    "leadInvestigator" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "RetentionPolicy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "purpose" TEXT,
    "retainDays" INTEGER NOT NULL,
    "archiveFirst" BOOLEAN NOT NULL DEFAULT true,
    "action" TEXT NOT NULL DEFAULT 'DELETE',
    "legalBasis" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "RetentionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "policyId" TEXT,
    "entityType" TEXT NOT NULL,
    "recordsProcessed" INTEGER NOT NULL,
    "recordsArchived" INTEGER NOT NULL DEFAULT 0,
    "recordsDeleted" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "executedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RetentionLog_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "RetentionPolicy" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PrivacySetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "album" TEXT NOT NULL,
    "builtInName" TEXT,
    "storageKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX IF NOT EXISTS "Lead_source_idx" ON "Lead"("source");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "Lead_phone_idx" ON "Lead"("phone");
CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead"("email");
CREATE INDEX IF NOT EXISTS "Lead_marketingConsent_idx" ON "Lead"("marketingConsent");
CREATE INDEX IF NOT EXISTS "JobVacancy_isActive_idx" ON "JobVacancy"("isActive");
CREATE INDEX IF NOT EXISTS "JobVacancy_createdAt_idx" ON "JobVacancy"("createdAt");
CREATE INDEX IF NOT EXISTS "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");
CREATE INDEX IF NOT EXISTS "JobApplication_jobTitle_idx" ON "JobApplication"("jobTitle");
CREATE INDEX IF NOT EXISTS "JobApplication_email_idx" ON "JobApplication"("email");
CREATE INDEX IF NOT EXISTS "JobApplication_phone_idx" ON "JobApplication"("phone");
CREATE INDEX IF NOT EXISTS "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");
CREATE INDEX IF NOT EXISTS "BlogPost_slug_idx" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt");
CREATE INDEX IF NOT EXISTS "Comment_authorEmail_idx" ON "Comment"("authorEmail");
CREATE INDEX IF NOT EXISTS "ConsentRecord_phoneKey_idx" ON "ConsentRecord"("phoneKey");
CREATE INDEX IF NOT EXISTS "ConsentRecord_emailKey_idx" ON "ConsentRecord"("emailKey");
CREATE INDEX IF NOT EXISTS "ConsentRecord_browserKey_idx" ON "ConsentRecord"("browserKey");
CREATE INDEX IF NOT EXISTS "ConsentRecord_purpose_action_idx" ON "ConsentRecord"("purpose", "action");
CREATE INDEX IF NOT EXISTS "ConsentRecord_recordType_recordId_idx" ON "ConsentRecord"("recordType", "recordId");
CREATE INDEX IF NOT EXISTS "ConsentRecord_createdAt_idx" ON "ConsentRecord"("createdAt");
CREATE INDEX IF NOT EXISTS "VisitorEvent_browserKey_idx" ON "VisitorEvent"("browserKey");
CREATE INDEX IF NOT EXISTS "VisitorEvent_category_idx" ON "VisitorEvent"("category");
CREATE INDEX IF NOT EXISTS "VisitorEvent_eventName_idx" ON "VisitorEvent"("eventName");
CREATE INDEX IF NOT EXISTS "VisitorEvent_createdAt_idx" ON "VisitorEvent"("createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_email_idx" ON "NewsletterSubscriber"("email");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_createdAt_idx" ON "NewsletterSubscriber"("createdAt");
CREATE INDEX IF NOT EXISTS "RateLimitHit_bucket_keyHash_createdAt_idx" ON "RateLimitHit"("bucket", "keyHash", "createdAt");
CREATE INDEX IF NOT EXISTS "RateLimitHit_createdAt_idx" ON "RateLimitHit"("createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX IF NOT EXISTS "AdminUser_email_idx" ON "AdminUser"("email");
CREATE INDEX IF NOT EXISTS "AdminUser_role_idx" ON "AdminUser"("role");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");
CREATE INDEX IF NOT EXISTS "AdminSession_userId_idx" ON "AdminSession"("userId");
CREATE INDEX IF NOT EXISTS "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");
CREATE INDEX IF NOT EXISTS "AuditLog_actorEmail_idx" ON "AuditLog"("actorEmail");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "PrivacyRequest_status_idx" ON "PrivacyRequest"("status");
CREATE INDEX IF NOT EXISTS "PrivacyRequest_phone_idx" ON "PrivacyRequest"("phone");
CREATE INDEX IF NOT EXISTS "PrivacyRequest_email_idx" ON "PrivacyRequest"("email");
CREATE INDEX IF NOT EXISTS "PrivacyRequest_dueAt_idx" ON "PrivacyRequest"("dueAt");
CREATE INDEX IF NOT EXISTS "PrivacyRequest_createdAt_idx" ON "PrivacyRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "PrivacyRequestEvent_requestId_idx" ON "PrivacyRequestEvent"("requestId");
CREATE INDEX IF NOT EXISTS "PrivacyRequestEvent_createdAt_idx" ON "PrivacyRequestEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "BreachIncident_status_idx" ON "BreachIncident"("status");
CREATE INDEX IF NOT EXISTS "BreachIncident_severity_idx" ON "BreachIncident"("severity");
CREATE INDEX IF NOT EXISTS "BreachIncident_detectedAt_idx" ON "BreachIncident"("detectedAt");
CREATE INDEX IF NOT EXISTS "RetentionPolicy_entityType_idx" ON "RetentionPolicy"("entityType");
CREATE INDEX IF NOT EXISTS "RetentionPolicy_isActive_idx" ON "RetentionPolicy"("isActive");
CREATE INDEX IF NOT EXISTS "RetentionLog_policyId_idx" ON "RetentionLog"("policyId");
CREATE INDEX IF NOT EXISTS "RetentionLog_executedAt_idx" ON "RetentionLog"("executedAt");
CREATE INDEX IF NOT EXISTS "GalleryImage_album_createdAt_idx" ON "GalleryImage"("album", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "GalleryImage_album_builtInName_key" ON "GalleryImage"("album", "builtInName");

INSERT INTO "AdminUser" ("id", "email", "name", "passwordHash", "role", "isActive", "failedLogins", "createdAt", "updatedAt")
SELECT 'b180ac8e-d005-4397-89a9-fbd006d7a031', 'info@vastuvihar.org', 'Vastu Vihar Admin', 'scrypt$dmFzdHV2aWhhcmFkbWluMQ==$dJKD/p/FwuPD/LF88Xk9waDuH4MAIeQKpRc5px4RuXL0LkVML83wnuAHN7Yjf5L7B1XYdvWkrVjMdgRJ28G+NA==', 'SUPER_ADMIN', 1, 0, datetime('now'), datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM "AdminUser" WHERE "email" = 'info@vastuvihar.org');
`;

export async function ensureDatabaseReady(): Promise<void> {
  if (schemaEnsured) return;
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    try {
      let cf: any = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getCloudflareContext } = require('@opennextjs/cloudflare');
        cf = getCloudflareContext();
      } catch {
        // Not running on Cloudflare Workers (AWS Lightsail / Node.js)
        schemaEnsured = true;
        return;
      }
      const db = cf?.env?.DB;
      if (!db || typeof db.prepare !== 'function') {
        schemaEnsured = true;
        return;
      }

      const check = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Lead'").first();
      if (!check) {
        console.log('[dbBootstrap] Lead table missing, auto-initializing database schema statement by statement...');
        try {
          await db.prepare("PRAGMA foreign_keys = OFF;").run();
        } catch {}

        const statements = INIT_SCHEMA_SQL.split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        for (const stmt of statements) {
          try {
            await db.prepare(stmt).run();
          } catch (stmtErr: any) {
            console.error('[dbBootstrap] statement error:', stmt.slice(0, 40), stmtErr?.message);
          }
        }
        console.log('[dbBootstrap] Database schema auto-initialized successfully.');
      }
      const verify = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Lead'").first();
      if (verify) {
        schemaEnsured = true;
      }
    } catch (err) {
      console.error('[dbBootstrap] Failed to ensure database schema:', err);
    } finally {
      schemaPromise = null;
    }
  })();

  await schemaPromise;
}
