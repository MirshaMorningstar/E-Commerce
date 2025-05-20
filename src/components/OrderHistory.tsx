
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders, updateOrderStatus } from '@/services/productService';
import { format } from 'date-fns';
import { Eye, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Directly query the orders table for the current user
      const { data: userOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Loaded user orders:", userOrders); // Debug logging
      setOrders(userOrders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      setUpdatingOrderStatus(orderId);
      
      // Update order status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update the orders list locally
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const canBeCancelled = (status: string) => {
    return ['pending', 'processing'].includes(status.toLowerCase());
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Your Orders</h3>
      
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="w-1/3 h-5 bg-gray-200 rounded"></div>
                <div className="w-24 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded mb-1"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <div>
                    <span className="font-medium text-gray-500">Order ID:</span>{' '}
                    <span className="font-mono">{order.id.slice(0, 8)}</span>
                  </div>
                  <Badge className={`border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>{' '}
                    {formatDate(order.created_at)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total:</span>{' '}
                    {formatPrice(order.total_amount)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/track-order?id=${order.id}`)}
                  >
                    <Eye size={14} className="mr-1" /> View Details
                  </Button>
                  
                  {canBeCancelled(order.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={updatingOrderStatus === order.id}
                    >
                      <X size={14} className="mr-1" /> 
                      {updatingOrderStatus === order.id ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Button asChild className="mt-4">
            <a href="/shop">Start Shopping</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
