import { supabase } from './supabase';

const BUCKET_NAME = 'assets-storage';

/**
 * Saves attachment data to Supabase Storage.
 * @param id The unique attachment ID (used as file path)
 * @param data The base64 string or Blob data
 */
export const saveAttachmentData = async (id: string, data: string): Promise<string> => {
    try {
        // Convert base64 to Blob if needed
        let blob: Blob;
        if (data.startsWith('data:')) {
            const response = await fetch(data);
            blob = await response.blob();
        } else {
            blob = new Blob([data], { type: 'application/octet-stream' });
        }

        const fileName = `${id}`;
        
        // Upload to Supabase
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, blob, {
                upsert: true,
                contentType: blob.type
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Failed to save to Supabase Storage:', error);
        throw error;
    }
};

/**
 * Retrieves attachment data URL from Supabase.
 * @param id The unique attachment ID
 */
export const getAttachmentData = async (id: string): Promise<string | null> => {
    try {
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(id);
        
        // Check if file exists by trying to fetch headers? 
        // Or just return the URL and let the UI handle errors.
        return publicUrl || null;
    } catch (error) {
        console.warn(`Failed to retrieve attachment ${id} from Supabase:`, error);
        return null;
    }
};

/**
 * Removes attachment data from Supabase Storage.
 * @param id The unique attachment ID
 */
export const deleteAttachmentData = async (id: string): Promise<void> => {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([id]);
            
        if (error) throw error;
    } catch (error) {
        console.error('Failed to delete from Supabase Storage:', error);
    }
};

/**
 * Placeholder for clearing (not recommended for cloud buckets directly without careful bulk delete).
 */
export const clearAllAttachments = async (): Promise<void> => {
    console.warn('Clear all attachments not implemented for Supabase storage in this version for safety.');
};
