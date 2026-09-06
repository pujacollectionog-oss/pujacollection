import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth/adminAuth';
import { uploadImageToSupabase } from '@/lib/supabase';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to upload files.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No image files provided for upload.' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedResults: { url: string; name: string }[] = [];

    for (const file of files) {
      if (!file || typeof file === 'string') continue;

      // 1. File size check
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds the 5MB size limit.` },
          { status: 400 }
        );
      }

      // 2. Extension check
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `File type "${ext}" is not allowed. Only JPG, PNG, WEBP, and AVIF images are permitted.` },
          { status: 400 }
        );
      }

      // 3. MIME type check
      if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid image MIME type "${file.type}".` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${safeName}`;

      // Try uploading to Supabase Storage first
      let publicUrl: string | null = null;
      try {
        publicUrl = await uploadImageToSupabase(
          buffer,
          filename,
          file.type || 'image/jpeg',
          'products'
        );
      } catch (uploadErr) {
        console.warn('Supabase upload failed, using local disk fallback:', uploadErr);
      }

      if (publicUrl) {
        uploadedResults.push({
          url: publicUrl,
          name: file.name,
        });
      } else {
        // Fallback to local filesystem
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        uploadedResults.push({
          url: `/uploads/${filename}`,
          name: file.name,
        });
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedResults,
      url: uploadedResults[0]?.url,
    });
  } catch (err: unknown) {
    console.error('File Upload Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image file to server.' },
      { status: 500 }
    );
  }
}
