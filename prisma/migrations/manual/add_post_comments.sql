-- Add PostComment table for commenting on blog posts
-- Run this with: npx prisma db push (when database is available)
-- Or manually with: psql -d growshare -f thisfile.sql

CREATE TABLE IF NOT EXISTS "PostComment" (
  id TEXT PRIMARY KEY,
  "postId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "UserPost"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "PostComment_postId_idx" ON "PostComment"("postId");
CREATE INDEX IF NOT EXISTS "PostComment_authorId_idx" ON "PostComment"("authorId");
CREATE INDEX IF NOT EXISTS "PostComment_createdAt_idx" ON "PostComment"("createdAt");
