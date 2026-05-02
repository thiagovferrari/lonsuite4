import { supabase } from './supabase';

const BUCKET_NAME = 'assets-storage';
const STORAGE_TIMEOUT_MS = 10000;

async function withStorageTimeout<T>(promise: PromiseLike<T>, label: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(`${label} demorou para responder.`)), STORAGE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

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

  try {
    const { error } = await withStorageTimeout(
      supabase.storage.from(BUCKET_NAME).upload(id, blob, { upsert: true, contentType: blob.type }),
      'Upload do arquivo no Supabase',
    );

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(id);
    return publicUrl;
  } catch (error) {
    console.warn('[Lon Suite] Supabase Storage indisponível; mantendo arquivo localmente.', error);
    return data;
  }
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
  try {
    const { error } = await withStorageTimeout(
      supabase.storage.from(BUCKET_NAME).remove([id]),
      'Exclusão do arquivo no Supabase',
    );
    if (error) console.error('Failed to delete attachment:', error);
  } catch (error) {
    console.warn('[Lon Suite] Não foi possível remover arquivo no Supabase agora:', error);
  }
};
