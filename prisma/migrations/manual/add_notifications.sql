-- Add Notification System and Activity Types
-- Migration: add_notifications
-- Date: 2024-01-14

-- Add missing ActivityType values
DO $$ BEGIN
    ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_CREATED';
    ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_APPROVED';
    ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_REJECTED';
    ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_CANCELLED';
    ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'REVIEW_CREATED';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create NotificationType enum
DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM (
        'BOOKING_REQUEST',
        'BOOKING_APPROVED',
        'BOOKING_REJECTED',
        'BOOKING_CANCELLED',
        'NEW_MESSAGE',
        'NEW_REVIEW',
        'PAYMENT_RECEIVED',
        'PLOT_VIEWED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify table was created
SELECT 'Notification table created successfully' AS status
FROM information_schema.tables
WHERE table_name = 'Notification';
