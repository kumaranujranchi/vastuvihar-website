-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "album" TEXT NOT NULL,
    "builtInName" TEXT,
    "storageKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "GalleryImage_album_createdAt_idx" ON "GalleryImage"("album", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_album_builtInName_key" ON "GalleryImage"("album", "builtInName");
