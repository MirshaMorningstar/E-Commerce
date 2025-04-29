
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';
import { uploadFile } from './storageService';

export type ProfileData = {
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
  avatar_url?: string;
};

export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    toast({
      title: 'Error',
      description: 'Failed to load profile information',
      variant: 'destructive',
    });
    return null;
  }
};

export const updateProfile = async (userId: string, profileData: ProfileData) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) throw error;
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to update profile',
      variant: 'destructive',
    });
    return false;
  }
};

export const uploadProfilePicture = async (userId: string, file: File) => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file using the storage service
    const avatarUrl = await uploadFile('profiles', filePath, file);
    
    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    toast({
      title: 'Profile Picture Updated',
      description: 'Your profile picture has been updated successfully',
    });
    
    return avatarUrl;
  } catch (error: any) {
    // If there's an error, try using the fallback to UI Avatars
    console.error('Error uploading profile picture:', error);
    
    // Get user details to create a fallback avatar
    const { data: userData } = await supabase.auth.getUser();
    const name = userData?.user?.user_metadata?.name || 'User';
    
    const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    
    // Update the profile with the fallback avatar
    await supabase
      .from('profiles')
      .update({ avatar_url: fallbackAvatarUrl })
      .eq('id', userId);
    
    toast({
      title: 'Profile Picture Error',
      description: 'Failed to upload profile picture. A default avatar has been set.',
      variant: 'destructive',
    });
    
    return fallbackAvatarUrl;
  }
};
