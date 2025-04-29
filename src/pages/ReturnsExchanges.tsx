
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const ReturnsExchanges = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Returns & Exchanges Policy</h1>
            <p className="text-gray-600">Everything you need to know about our returns and exchanges process</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How Returns Work</CardTitle>
              <CardDescription>
                Our simple 3-step process for returns and exchanges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4">
                  <div className="bg-sage-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-sage-700">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Request a Return</h3>
                  <p className="text-sm text-gray-500">
                    Submit your return request through your account or order tracking page.
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-sage-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-sage-700">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Package Your Items</h3>
                  <p className="text-sm text-gray-500">
                    Pack the items securely using the original packaging if possible.
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-sage-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-sage-700">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Ship or Drop Off</h3>
                  <p className="text-sm text-gray-500">
                    Ship using the prepaid label or drop off at a designated return location.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/track-order">
                  <Button>Start a Return</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose">
                    <p>At EcoGlow, we want you to be completely satisfied with your purchase. If you're not happy with your order for any reason, we're here to help.</p>
                    
                    <h3 className="text-lg font-medium mt-4">Return Eligibility</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Returns are accepted within 30 days of delivery.</li>
                      <li>Products must be in their original condition and packaging.</li>
                      <li>Items must be unused, unworn, and with all tags attached.</li>
                      <li>For hygiene reasons, certain products (makeup, lip products, etc.) cannot be returned if opened or used.</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4">Non-Returnable Items</h3>
                    <p>The following items cannot be returned:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Gift cards</li>
                      <li>Downloadable products</li>
                      <li>Personal care items that have been opened or used</li>
                      <li>Clearance items marked as final sale</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4">Return Processing Time</h3>
                    <p>Once we receive your return:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Returns are typically processed within 5-7 business days.</li>
                      <li>Refunds are issued to the original payment method used for purchase.</li>
                      <li>You'll receive an email confirmation when your return has been processed.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Exchange Policy</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose">
                    <p>If you'd like to exchange an item for a different size, color, or product, we make it easy.</p>
                    
                    <h3 className="text-lg font-medium mt-4">How to Request an Exchange</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Log into your account and navigate to the order you want to exchange.</li>
                      <li>Select "Request Exchange" and follow the instructions.</li>
                      <li>Alternatively, start a return and place a new order for the item you want instead.</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4">Exchange Processing</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Exchanges are processed as a return and a new order.</li>
                      <li>If there's a price difference, we'll charge or refund the difference.</li>
                      <li>Once your returned item is received, your exchange will be shipped.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="return-cost">
                  <AccordionTrigger>Do I have to pay for return shipping?</AccordionTrigger>
                  <AccordionContent>
                    <p>For standard returns, customers are responsible for return shipping costs unless the item arrived damaged or defective. If you received a damaged or defective item, we'll provide a prepaid return label.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="return-time">
                  <AccordionTrigger>How long do I have to return an item?</AccordionTrigger>
                  <AccordionContent>
                    <p>You have 30 days from the delivery date to initiate a return. After this period, returns may be accepted on a case-by-case basis at our discretion.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="partial-return">
                  <AccordionTrigger>Can I return just part of my order?</AccordionTrigger>
                  <AccordionContent>
                    <p>Yes, you can return individual items from your order. You'll be refunded for only the items you return that meet our return policy guidelines.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="refund-time">
                  <AccordionTrigger>How long will it take to get my refund?</AccordionTrigger>
                  <AccordionContent>
                    <p>After we receive and process your return (typically 5-7 business days), your refund will be issued to your original payment method. It may take an additional 3-10 business days for the funds to appear in your account, depending on your bank or credit card issuer.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="gift-return">
                  <AccordionTrigger>How do I return a gift?</AccordionTrigger>
                  <AccordionContent>
                    <p>If you received an item as a gift, you can return it for store credit or an exchange. You'll need the order number from the gift receipt or packing slip. If you don't have this information, please contact our customer service team for assistance.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="wrong-item">
                  <AccordionTrigger>I received the wrong item. What should I do?</AccordionTrigger>
                  <AccordionContent>
                    <p>If you received the wrong item, please contact our customer service team immediately. We'll send you the correct item and provide a prepaid return label for the incorrect item.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-sage-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">Need More Help?</h2>
              <p className="mb-4">If you have any questions about our return policy or need assistance with a return, our customer service team is here to help.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/contact">
                  <Button variant="outline" className="w-full">Contact Support</Button>
                </Link>
                <Link to="/track-order">
                  <Button className="w-full">Start a Return</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnsExchanges;
