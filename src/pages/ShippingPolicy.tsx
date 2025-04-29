
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ShippingPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Shipping Policy</h1>
            <p className="text-gray-600">Everything you need to know about our shipping process</p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Domestic Shipping</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">Standard Shipping (3-5 business days)</h3>
                  <p className="text-gray-600">
                    Free on orders over $50 
                    <br />$5.99 for orders under $50
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Express Shipping (1-2 business days)</h3>
                  <p className="text-gray-600">
                    $12.99 for all orders
                    <br />Free on orders over $100
                  </p>
                </div>
                
                <div className="text-sm text-gray-500 italic">
                  <p>* Delivery timeframes are estimates and begin from the date of shipping, not the date of order.</p>
                  <p>* Delivery to remote areas may take additional time.</p>
                </div>
              </div>
              
              <div className="border-t my-6 pt-6">
                <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Standard International (7-14 business days)</h3>
                    <p className="text-gray-600">
                      $15.99 for orders under $100
                      <br />$9.99 for orders over $100
                      <br />Free on orders over $200
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Express International (3-5 business days)</h3>
                    <p className="text-gray-600">
                      $29.99 for all orders
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-500 italic">
                    <p>* International delivery times may vary depending on customs processing in your country.</p>
                    <p>* Import duties and taxes are not included in the shipping cost and are the responsibility of the customer.</p>
                    <p>* Not all products can be shipped to all countries due to regulatory restrictions.</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t my-6 pt-6">
                <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
                <p className="text-gray-600 mb-4">
                  Once your order ships, you'll receive a confirmation email with tracking information. You can also check your order status on our Track Order page.
                </p>
                <Link to="/track-order" className="inline-block">
                  <Button variant="outline">Track Your Order</Button>
                </Link>
              </div>
              
              <div className="border-t my-6 pt-6">
                <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
                <p className="text-gray-600 mb-2">
                  Due to shipping regulations and restrictions, some products cannot be shipped to certain international locations. During checkout, only eligible products will be available for your shipping address.
                </p>
                <p className="text-gray-600">
                  If you have any questions about shipping to your location, please don't hesitate to contact us.
                </p>
              </div>
              
              <div className="border-t my-6 pt-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our shipping policy or need assistance with your order, our customer support team is here to help.
                </p>
                <Link to="/contact" className="inline-block">
                  <Button>Contact Us</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;
