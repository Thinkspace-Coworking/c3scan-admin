-- Migration: Create mail_item_staging table for flexible data ingestion
-- This table has no foreign key constraints to allow flexible data from mobile app
-- A post-processing service will move data to mail_item table after validation

CREATE TABLE IF NOT EXISTS mail_item_staging (
    staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identifiers (no foreign key constraints)
    operator_id UUID NOT NULL,
    location_id UUID,
    company_id TEXT,                    -- Company identifier (flexible)
    company_name TEXT,                  -- Company name for reference
    
    -- Mailbox info (PMB as string, not UUID - will be resolved by post-processor)
    mailbox_pmb TEXT,                   -- e.g., "1614", "Suite 200"
    
    -- Scan metadata
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    scanned_by_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_processing',  -- pending_processing, processed, failed
    
    -- Image info
    envelope_image TEXT NOT NULL,       -- Storage path to image
    
    -- OCR/Matching data
    ocr_text TEXT,
    ocr_confidence DOUBLE PRECISION DEFAULT 0,
    match_confidence DOUBLE PRECISION DEFAULT 0,
    match_method TEXT,                  -- 'fuzzy_ocr', 'manual_search', 'scan'
    
    -- Package info
    package_type TEXT,                  -- 'standard', 'large', 'oversized'
    carrier TEXT,
    tracking_number TEXT,
    
    -- Client tracking
    client_scan_id TEXT,                -- ID from mobile app
    image_hash TEXT,                    -- For duplicate detection
    app_version TEXT,
    
    -- Processing metadata
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_mail_item_id UUID,        -- Link to final mail_item when processed
    processing_error TEXT,              -- Error message if processing failed
    
    -- Raw payload for debugging
    raw_payload JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_mail_item_staging_status ON mail_item_staging(status);
CREATE INDEX IF NOT EXISTS idx_mail_item_staging_operator ON mail_item_staging(operator_id);
CREATE INDEX IF NOT EXISTS idx_mail_item_staging_mailbox_pmb ON mail_item_staging(mailbox_pmb);
CREATE INDEX IF NOT EXISTS idx_mail_item_staging_received_at ON mail_item_staging(received_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mail_item_staging_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mail_item_staging_updated_at ON mail_item_staging;
CREATE TRIGGER trg_mail_item_staging_updated_at
    BEFORE UPDATE ON mail_item_staging
    FOR EACH ROW
    EXECUTE FUNCTION update_mail_item_staging_updated_at();

-- Comment explaining the purpose
COMMENT ON TABLE mail_item_staging IS 'Staging table for mail items from mobile app. Post-processor moves validated items to mail_item table.';