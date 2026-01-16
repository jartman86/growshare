-- AlterEnum
ALTER TYPE "ReviewType" ADD VALUE 'TOOL';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "toolId" TEXT;

-- CreateIndex
CREATE INDEX "Review_toolId_idx" ON "Review"("toolId");
