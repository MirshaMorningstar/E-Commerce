
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string, isPublic: boolean = false) => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic
      });
      
      if (error) throw error;
      console.log(`Created bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
};

export const uploadFile = async (bucket: string, filePath: string, file: File) => {
  try {
    await createBucketIfNotExists(bucket, true);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
