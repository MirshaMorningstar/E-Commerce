
import { toast } from "@/components/ui/use-toast";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

// Sample users for demo
const sampleUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=1'
  }
];

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const user = localStorage.getItem('user');
  return !!user;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const userData = JSON.parse(userStr);
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar
    };
  }
  return null;
};

// Login
export const login = async (credentials: UserCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = sampleUsers.find(u => u.email === credentials.email);
  
  if (!user || user.password !== credentials.password) {
    toast({
      title: "Login Failed",
      description: "Invalid email or password.",
      variant: "destructive",
    });
    throw new Error('Invalid email or password');
  }
  
  const userData: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  
  toast({
    title: "Login Successful",
    description: `Welcome back, ${user.name}!`,
  });
  
  return userData;
};

// Register
export const register = async (newUser: NewUser): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if user already exists
  const existingUser = sampleUsers.find(u => u.email === newUser.email);
  if (existingUser) {
    toast({
      title: "Registration Failed",
      description: "Email already in use.",
      variant: "destructive",
    });
    throw new Error('Email already in use');
  }
  
  // Generate avatar - ensure it's always defined
  const avatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
  
  // Create new user
  const user: User = {
    id: (sampleUsers.length + 1).toString(),
    name: newUser.name,
    email: newUser.email,
    avatar: avatarUrl
  };
  
  // In a real app, we would save this to a database
  // Fix: Ensure avatar is provided as a non-optional property when adding to sampleUsers
  sampleUsers.push({
    ...user,
    password: newUser.password,
    avatar: avatarUrl  // Explicitly provide avatar to satisfy the type requirement
  });
  
  localStorage.setItem('user', JSON.stringify(user));
  
  toast({
    title: "Registration Successful",
    description: "Your account has been created.",
  });
  
  return user;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem('user');
  toast({
    title: "Logged Out",
    description: "You have been logged out successfully.",
  });
};
