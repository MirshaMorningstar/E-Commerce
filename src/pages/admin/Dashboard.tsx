
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/services/productService';
import { getAllCustomers, getAllOrders } from '@/services/adminService';
import { Spinner } from '@/components/ui/spinner';
import { Package, Users, ShoppingBag, TrendingUp, Truck, RefreshCcw } from 'lucide-react';

const AdminDashboard = () => {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAllProducts
  });
  
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: getAllCustomers
  });
  
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders
  });
  
  const isLoading = productsLoading || customersLoading || ordersLoading;
  
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Calculate metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const outOfStockProducts = products?.filter(product => product.stock <= 0).length || 0;
  
  const statCards = [
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: Package,
      color: "text-blue-500"
    },
    {
      title: "Total Customers",
      value: customers?.length || 0,
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Total Orders",
      value: orders?.length || 0,
      icon: ShoppingBag,
      color: "text-purple-500"
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-amber-500"
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Truck,
      color: "text-red-500"
    },
    {
      title: "Out of Stock",
      value: outOfStockProducts,
      icon: RefreshCcw,
      color: "text-orange-500"
    }
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders?.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Order #{order.id.substring(0, 8)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="font-medium">${order.total_amount?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products?.filter(p => p.stock <= 10 && p.stock > 0)
                .slice(0, 5)
                .map(product => (
                <div key={product.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Product";
                      }}
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className={`font-medium ${
                    product.stock <= 5 ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {product.stock} in stock
                  </div>
                </div>
              ))}
              
              {products?.filter(p => p.stock <= 10 && p.stock > 0).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No low stock products
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
