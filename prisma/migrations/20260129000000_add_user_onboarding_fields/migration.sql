-- Add onboarding fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "interests" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "experienceLevel" TEXT;
