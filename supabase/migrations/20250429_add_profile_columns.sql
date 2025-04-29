
-- Create a function that will add the missing columns if they don't exist
CREATE OR REPLACE FUNCTION public.add_missing_profile_columns()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if address column exists, if not add it
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'address'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN address TEXT;
  END IF;
  
  -- Check if phone_number column exists, if not add it
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;
  END IF;

  RETURN;
END;
$$;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION public.add_missing_profile_columns() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_missing_profile_columns() TO anon;
GRANT EXECUTE ON FUNCTION public.add_missing_profile_columns() TO service_role;
