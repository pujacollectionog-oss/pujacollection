import 'server-only';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ivdrxnimgpwsptdjcwgr.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZHJ4bmltZ3B3c3B0ZGpjd2dyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY4NjcxNywiZXhwIjoyMTA0MjYyNzE3fQ.IxWh0zoTG4INxEceYexMzd38MsBxlJELyyrtT_Cgo4k';

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export const supabase = getSupabaseAdminClient();

export interface SupabaseUploadResult {
  publicUrl: string | null;
  error?: string | null;
}

/**
 * Uploads a file buffer directly to a Supabase Storage bucket.
 * Automatically tries to create the bucket as public if it doesn't exist.
 * Returns { publicUrl, error }.
 */
export async function uploadImageToSupabase(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  bucketName = 'products'
): Promise<SupabaseUploadResult> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return {
      publicUrl: null,
      error: 'Supabase client could not be initialized.',
    };
  }

  try {
    let { data, error } = await client.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
      });

    // If bucket doesn't exist, try creating it (works with service_role key)
    if (
      error &&
      (error.message.toLowerCase().includes('bucket not found') ||
        error.message.toLowerCase().includes('does not exist'))
    ) {
      try {
        const { error: createBucketError } = await client.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        if (!createBucketError) {
          // Retry upload
          const retry = await client.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
              contentType,
              upsert: true,
            });
          data = retry.data;
          error = retry.error;
        }
      } catch (bucketCreateErr) {
        console.warn('Could not auto-create bucket:', bucketCreateErr);
      }
    }

    if (error) {
      console.error('Supabase storage upload error:', error.message);
      return { publicUrl: null, error: error.message };
    }

    if (!data?.path) {
      return { publicUrl: null, error: 'Upload returned no file path.' };
    }

    const { data: publicUrlData } = client.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { publicUrl: publicUrlData.publicUrl, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unexpected storage error';
    console.error('Supabase storage unexpected error:', err);
    return { publicUrl: null, error: errorMsg };
  }
}
