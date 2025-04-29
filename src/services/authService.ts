
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export type UserCredentials = {
  email: string;
  password: string;
};

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type ProfileUpdate = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  address?: string;
  phone_number?: string;
};

// Check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Login
export const login = async (credentials: UserCredentials): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  
  if (error) {
    toast({
      title: "Login Failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Login Successful",
    description: "Welcome back!",
  });
  
  return data.user;
};

// Register
export const register = async (newUser: NewUser): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email: newUser.email,
    password: newUser.password,
    options: {
      data: {
        name: newUser.name,
      }
    }
  });
  
  if (error) {
    toast({
      title: "Registration Failed",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
  
  // Ensure profile table has required columns
  try {
    await supabase.rpc('add_missing_profile_columns');
  } catch (error) {
    console.error("Failed to ensure profile columns:", error);
  }
  
  // Update profile with user's name
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: newUser.name,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`
    })
    .eq('id', data.user?.id);
  
  if (profileError) {
    console.error("Error updating profile:", profileError);
  }
  
  toast({
    title: "Registration Successful",
    description: "Your account has been created. Please verify your email if required.",
  });
  
  return data.user;
};

// Logout
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error signing out:", error.message);
    return;
  }
  
  toast({
    title: "Logged Out",
    description: "You have been logged out successfully.",
  });
};

// Update profile with robust error handling
export const updateProfile = async (userId: string, profile: ProfileUpdate): Promise<any> => {
  try {
    // First ensure the columns exist
    try {
      await supabase.rpc('add_missing_profile_columns');
    } catch (error) {
      console.warn("Could not ensure profile columns exist:", error);
    }
    
    // Attempt full update
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select();
      
    if (error) {
      console.error("Profile update error:", error);
      
      // If failed, try updating only basic fields
      if (profile.first_name || profile.last_name || profile.avatar_url) {
        const basicProfile = {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        };
        
        const { data: basicData, error: basicError } = await supabase
          .from('profiles')
          .update(basicProfile)
          .eq('id', userId)
          .select();
          
        if (basicError) throw basicError;
        
        toast({
          title: "Basic Profile Updated",
          description: "Only basic information was updated. Extended fields couldn't be saved."
        });
        
        return basicData;
      }
      
      throw error;
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Profile Update Failed",
      description: error.message || "An error occurred while updating your profile",
      variant: "destructive"
    });
    throw error;
  }
};
