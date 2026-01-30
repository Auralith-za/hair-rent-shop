-- Migration: Add orderType column to existing Order table
-- Run this in Supabase SQL Editor if the table already exists

-- Add orderType column with default value
ALTER TABLE "Order" 
ADD COLUMN IF NOT EXISTS "orderType" TEXT DEFAULT 'REGULAR';

-- Update existing orders to have REGULAR orderType
UPDATE "Order" 
SET "orderType" = 'REGULAR' 
WHERE "orderType" IS NULL;
