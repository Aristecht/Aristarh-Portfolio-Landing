DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'RefreshToken'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'refresh_tokens'
  ) THEN
    ALTER TABLE "RefreshToken" RENAME TO "refresh_tokens";
  END IF;
END $$;

ALTER TABLE IF EXISTS "refresh_tokens"
  DROP COLUMN IF EXISTS "token";
