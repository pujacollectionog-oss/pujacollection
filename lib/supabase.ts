import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ivdrxnimgpwsptdjcwgr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

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
  if (!supabase) {
    return {
      publicUrl: null,
      error: 'Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.',
    };
  }

  try {
    let { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
      });

    // If bucket doesn't exist, try creating it (works with service_role key)
    if (error && (error.message.toLowerCase().includes('bucket not found') || error.message.toLowerCase().includes('does not exist'))) {
      try {
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        if (!createBucketError) {
          // Retry upload
          const retry = await supabase.storage
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

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { publicUrl: publicUrlData.publicUrl, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unexpected storage error';
    console.error('Supabase storage unexpected error:', err);
    return { publicUrl: null, error: errorMsg };
  }
}
