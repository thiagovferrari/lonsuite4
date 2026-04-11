import { supabase } from './supabase';

const BUCKET_NAME = 'assets-storage';

/**
 * Uploads a base64 data URL (or raw bytes) to Supabase Storage and
 * returns the public URL.
 */
export const saveAttachmentData = async (id: string, data: string): Promise<string> => {
  let blob: Blob;
  if (data.startsWith('data:')) {
    const response = await fetch(data);
    blob = await response.blob();
  } else {
    blob = new Blob([data], { type: 'application/octet-stream' });
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(id, blob, { upsert: true, contentType: blob.type });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(id);
  return publicUrl;
};

/** Returns a public URL for a given attachment id. */
export const getAttachmentData = async (id: string): Promise<string | null> => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(id);
  return publicUrl || null;
};

/** Removes an attachment from Supabase Storage. */
export const deleteAttachmentData = async (id: string): Promise<void> => {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([id]);
  if (error) console.error('Failed to delete attachment:', error);
};
