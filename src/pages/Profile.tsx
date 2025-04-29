
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Package, PackageX, FileText } from 'lucide-react';
import { updateProfile as updateUserProfile } from '@/services/authService';

// Updated UserProfile type to use with users table
type UserProfile = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
};

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState(""); // Kept for UI consistency but not stored
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        if (!user) return;
        
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError.message);
          toast({
            title: "Error",
            description: "Failed to load profile information",
            variant: "destructive",
          });
          return;
        }
        
        // Get user metadata
        const metadata = userData.user.user_metadata || {};
        
        // Set default profile values
        const userProfile: UserProfile = {
          first_name: metadata.first_name || "",
          last_name: metadata.last_name || "",
          avatar_url: metadata.avatar_url || "",
          phone_number: metadata.phone_number || ""
        };
        
        setProfile(userProfile);
        setFirstName(userProfile.first_name || "");
        setLastName(userProfile.last_name || "");
        setPhoneNumber(userProfile.phone_number || "");
        
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      }
    };
    
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [user, isAuthenticated, isLoading, navigate, toast]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Use the authService updateProfile function
      const updatedProfile = await updateUserProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });
      
      // Update local profile state
      if (updatedProfile) {
        setProfile({
          first_name: firstName,
          last_name: lastName,
          avatar_url: profile?.avatar_url || '',
          phone_number: phoneNumber
        });
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully."
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Loading profile...</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url} alt={firstName} />
                      <AvatarFallback>{firstName?.charAt(0)}{lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user?.email || ""}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Shipping Address</Label>
                      <Input 
                        id="address" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Address is stored locally for your convenience</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : "Update Profile"}
                      </Button>
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>
                    Track and manage your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link to="/track-order" className="block">
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="flex items-center gap-4 p-4">
                          <Package className="h-8 w-8 text-sage-600" />
                          <div>
                            <h3 className="font-medium">Track Your Orders</h3>
                            <p className="text-sm text-muted-foreground">Check status and delivery updates</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>
                    Products you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/wishlist" className="block">
                    <Button className="w-full">Go to Wishlist</Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="returns">
              <Card>
                <CardHeader>
                  <CardTitle>Returns & Exchanges</CardTitle>
                  <CardDescription>
                    Manage your returns and exchanges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link to="/returns-exchanges" className="block">
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="flex items-center gap-4 p-4">
                          <PackageX className="h-8 w-8 text-sage-600" />
                          <div>
                            <h3 className="font-medium">Returns Policy</h3>
                            <p className="text-sm text-muted-foreground">View our returns and exchanges policy</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link to="/track-order" className="block">
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="flex items-center gap-4 p-4">
                          <FileText className="h-8 w-8 text-sage-600" />
                          <div>
                            <h3 className="font-medium">Start a Return</h3>
                            <p className="text-sm text-muted-foreground">Initiate a return or exchange</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
