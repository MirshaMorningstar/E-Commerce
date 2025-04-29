
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCustomers } from '@/services/adminService';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: getAllCustomers
  });
  
  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailOpen(true);
  };
  
  // Filter customers based on search query
  const filteredCustomers = customers?.filter(customer => 
    (customer.first_name && customer.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.last_name && customer.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.phone_number && customer.phone_number.includes(searchQuery)) ||
    (customer.address && customer.address.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];
  
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Helper to get initials from name
  const getInitials = (customer: any) => {
    const first = customer.first_name?.charAt(0) || '';
    const last = customer.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Management</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={customer.avatar_url} />
                      <AvatarFallback>{getInitials(customer)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {customer.first_name || ''} {customer.last_name || ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.id.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.phone_number || 'Not provided'}</TableCell>
                <TableCell>{customer.address || 'Not provided'}</TableCell>
                <TableCell>
                  {customer.user_roles && customer.user_roles.role === 'admin' ? (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Customer
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Customer Details Dialog */}
      <Dialog open={isCustomerDetailOpen} onOpenChange={setIsCustomerDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Detailed information about the customer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedCustomer.avatar_url} />
                  <AvatarFallback className="text-lg">{getInitials(selectedCustomer)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer ID</h3>
                  <p>{selectedCustomer.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{selectedCustomer.first_name || ''} {selectedCustomer.last_name || ''}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                  <p>{selectedCustomer.phone_number || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p>{selectedCustomer.address || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Registered On</h3>
                  <p>{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                  <p>
                    {selectedCustomer.user_roles && selectedCustomer.user_roles.role === 'admin'
                      ? 'Administrator'
                      : 'Customer'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsCustomerDetailOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
