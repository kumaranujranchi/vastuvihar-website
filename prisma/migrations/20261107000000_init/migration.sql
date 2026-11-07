-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
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
    "marketingConsentAt" TIMESTAMP(3),
    "marketingWithdrawnAt" TIMESTAMP(3),
    "adChannel" TEXT,
    "adUtmSource" TEXT,
    "adUtmMedium" TEXT,
    "adUtmCampaign" TEXT,
    "legalHoldReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobVacancy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "location" TEXT NOT NULL DEFAULT 'Ranchi, JH',
    "type" TEXT NOT NULL DEFAULT 'Full - Time',
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobVacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "noticeVersion" TEXT,
    "noticeLanguage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorEvent" (
    "id" TEXT NOT NULL,
    "browserKey" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "path" TEXT,
    "cookies" TEXT,
    "adChannel" TEXT,
    "adUtmSource" TEXT,
    "adUtmMedium" TEXT,
    "adUtmCampaign" TEXT,
    "provider" TEXT,
    "eventName" TEXT,
    "noticeVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBSCRIBED',
    "noticeVersion" TEXT NOT NULL,
    "noticeLanguage" TEXT NOT NULL DEFAULT 'en',
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingSuppression" (
    "key" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingSuppression_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "failedLogins" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyRequest" (
    "id" TEXT NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "requesterName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "details" TEXT NOT NULL,
    "requestedChange" TEXT,
    "nomineeName" TEXT,
    "nomineeContact" TEXT,
    "nomineeRelation" TEXT,
    "actingAs" TEXT NOT NULL DEFAULT 'SELF',
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verifyMethod" TEXT,
    "verifiedChannels" TEXT,
    "outcome" TEXT,
    "retentionNote" TEXT,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyRequestEvent" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivacyRequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreachIncident" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DETECTED',
    "severity" TEXT NOT NULL DEFAULT 'UNASSESSED',
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "occurredAt" TIMESTAMP(3),
    "nature" TEXT,
    "scope" TEXT,
    "affectedDataTypes" TEXT,
    "affectedCount" INTEGER,
    "containmentActions" TEXT,
    "remediationActions" TEXT,
    "likelyConsequences" TEXT,
    "ownerEmail" TEXT,
    "boardDueAt" TIMESTAMP(3),
    "boardIntimatedAt" TIMESTAMP(3),
    "boardReportedAt" TIMESTAMP(3),
    "boardReference" TEXT,
    "principalsNotifiedAt" TIMESTAMP(3),
    "principalsNotifiedCount" INTEGER,
    "notificationNotes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreachIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetentionPolicy" (
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "retentionDays" INTEGER,
    "action" TEXT NOT NULL DEFAULT 'DELETE',
    "legalBasis" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetentionPolicy_pkey" PRIMARY KEY ("category")
);

-- CreateTable
CREATE TABLE "RetentionLog" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "affected" INTEGER NOT NULL,
    "dryRun" BOOLEAN NOT NULL,
    "trigger" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetentionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "builtInName" TEXT,
    "storageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacySetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacySetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "JobVacancy_isActive_idx" ON "JobVacancy"("isActive");

-- CreateIndex
CREATE INDEX "JobVacancy_createdAt_idx" ON "JobVacancy"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_jobTitle_idx" ON "JobApplication"("jobTitle");

-- CreateIndex
CREATE INDEX "JobApplication_email_idx" ON "JobApplication"("email");

-- CreateIndex
CREATE INDEX "JobApplication_phone_idx" ON "JobApplication"("phone");

-- CreateIndex
CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_authorEmail_idx" ON "Comment"("authorEmail");

-- CreateIndex
CREATE INDEX "ConsentRecord_phoneKey_idx" ON "ConsentRecord"("phoneKey");

-- CreateIndex
CREATE INDEX "ConsentRecord_emailKey_idx" ON "ConsentRecord"("emailKey");

-- CreateIndex
CREATE INDEX "ConsentRecord_browserKey_idx" ON "ConsentRecord"("browserKey");

-- CreateIndex
CREATE INDEX "ConsentRecord_purpose_idx" ON "ConsentRecord"("purpose");

-- CreateIndex
CREATE INDEX "ConsentRecord_createdAt_idx" ON "ConsentRecord"("createdAt");

-- CreateIndex
CREATE INDEX "VisitorEvent_browserKey_idx" ON "VisitorEvent"("browserKey");

-- CreateIndex
CREATE INDEX "VisitorEvent_kind_idx" ON "VisitorEvent"("kind");

-- CreateIndex
CREATE INDEX "VisitorEvent_adChannel_idx" ON "VisitorEvent"("adChannel");

-- CreateIndex
CREATE INDEX "VisitorEvent_createdAt_idx" ON "VisitorEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");

-- CreateIndex
CREATE INDEX "RateLimitHit_bucket_keyHash_createdAt_idx" ON "RateLimitHit"("bucket", "keyHash", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitHit_createdAt_idx" ON "RateLimitHit"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacyRequest_ticketNo_key" ON "PrivacyRequest"("ticketNo");

-- CreateIndex
CREATE INDEX "PrivacyRequest_status_idx" ON "PrivacyRequest"("status");

-- CreateIndex
CREATE INDEX "PrivacyRequest_type_idx" ON "PrivacyRequest"("type");

-- CreateIndex
CREATE INDEX "PrivacyRequest_dueAt_idx" ON "PrivacyRequest"("dueAt");

-- CreateIndex
CREATE INDEX "PrivacyRequest_createdAt_idx" ON "PrivacyRequest"("createdAt");

-- CreateIndex
CREATE INDEX "PrivacyRequestEvent_requestId_idx" ON "PrivacyRequestEvent"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "BreachIncident_reference_key" ON "BreachIncident"("reference");

-- CreateIndex
CREATE INDEX "BreachIncident_status_idx" ON "BreachIncident"("status");

-- CreateIndex
CREATE INDEX "BreachIncident_detectedAt_idx" ON "BreachIncident"("detectedAt");

-- CreateIndex
CREATE INDEX "RetentionLog_runId_idx" ON "RetentionLog"("runId");

-- CreateIndex
CREATE INDEX "RetentionLog_createdAt_idx" ON "RetentionLog"("createdAt");

-- CreateIndex
CREATE INDEX "GalleryImage_album_createdAt_idx" ON "GalleryImage"("album", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_album_builtInName_key" ON "GalleryImage"("album", "builtInName");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacyRequestEvent" ADD CONSTRAINT "PrivacyRequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PrivacyRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

