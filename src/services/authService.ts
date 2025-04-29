
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
        first_name: newUser.name,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`
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

// Update profile with metadata
export const updateProfile = async (userId: string, profile: ProfileUpdate): Promise<any> => {
  try {
    // Update user metadata instead of profiles table
    const { data, error } = await supabase.auth.updateUser({
      data: profile
    });
      
    if (error) {
      console.error("Profile update error:", error);
      throw error;
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
    
    return data.user.user_metadata;
  } catch (error: any) {
    toast({
      title: "Profile Update Failed",
      description: error.message || "An error occurred while updating your profile",
      variant: "destructive"
    });
    throw error;
  }
};
