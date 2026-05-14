-- Add course_type column to leads table for commission slab calculation
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS course_type TEXT DEFAULT '3_months'
  CHECK (course_type IN ('3_months', '4_months', '6_months', '11_months_diploma'));

-- Backfill existing leads with the default slab
UPDATE leads SET course_type = '3_months' WHERE course_type IS NULL;
