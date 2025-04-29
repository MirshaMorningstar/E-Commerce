
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { toast } from "@/components/ui/use-toast";
import { updateProfile } from '@/services/authService';
import { isUserAdmin } from '@/services/adminService';
import { UserCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.user_metadata?.phone_number || '');
  const [address, setAddress] = useState(user?.user_metadata?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: () => isUserAdmin(user),
    enabled: !!user && isAuthenticated,
  });
  
  // If user is not authenticated, redirect to login
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  if (isLoading || !isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="w-48 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      if (user) {
        await updateProfile(user.id, {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          address,
          avatar_url: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random`
        });
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your profile.",
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
  
  // Get initials for avatar fallback
  const getInitials = () => {
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Account</h1>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-sage-600 hover:bg-sage-700"
              >
                Admin Dashboard
              </Button>
            )}
          </div>
          
          <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg bg-sage-600 text-white">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {firstName || user?.user_metadata?.first_name || ''} {lastName || user?.user_metadata?.last_name || ''}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
              {isAdmin && (
                <div className="mt-2">
                  <span className="px-2 py-0.5 bg-sage-100 text-sage-800 rounded-full text-xs font-medium">Admin</span>
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2 lg:w-1/2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
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
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={user?.email || ''}
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Shipping Address</Label>
                      <Input 
                        id="address" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input 
                        id="avatarUrl" 
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to generate an avatar based on your name
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your previous orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-muted p-3">
                      <UserCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No Orders Yet</h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      You haven't placed any orders yet.
                      <br />
                      Start shopping to see your orders here.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/shop')}
                    >
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/track-order')}
                    className="w-full"
                  >
                    Track Order Status
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
