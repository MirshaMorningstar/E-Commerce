
import React from 'react';
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600">Find answers to our most commonly asked questions</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">Are all your products eco-friendly?</AccordionTrigger>
              <AccordionContent>
                Yes, all EcoGlow products are made with natural, sustainable ingredients and environmentally friendly packaging. We're committed to reducing our carbon footprint and ensuring our products are as gentle on the planet as they are on your skin.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">Do you test on animals?</AccordionTrigger>
              <AccordionContent>
                Never! EcoGlow is proudly 100% cruelty-free. We never test on animals and only work with suppliers who share our commitment to ethical practices.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">How long will shipping take?</AccordionTrigger>
              <AccordionContent>
                Domestic orders typically arrive within 3-5 business days. International shipping times vary by location, usually taking 7-14 business days. You can always check your order status on our Track Order page.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 30-day satisfaction guarantee on all products. If you're not completely satisfied, you can return unused items in their original packaging for a full refund or exchange. Please see our Returns & Exchanges page for complete details.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">Are your products suitable for sensitive skin?</AccordionTrigger>
              <AccordionContent>
                Most of our products are formulated to be gentle and suitable for sensitive skin. However, everyone's skin is unique. We recommend checking the ingredients list or trying our samples first if you have specific sensitivities or allergies.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">Do you offer international shipping?</AccordionTrigger>
              <AccordionContent>
                Yes! We ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the specific shipping options for your country during checkout.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">How can I track my order?</AccordionTrigger>
              <AccordionContent>
                Once your order ships, you'll receive a confirmation email with tracking information. You can also visit our Track Order page and enter your order number and email to check your order status.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="border rounded-lg p-2">
              <AccordionTrigger className="text-left font-medium">Do you offer samples?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer sample sizes of many products. Look for the "Sample" option on product pages or check our sample kit collections to try before you commit to full-size products.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
            <Link to="/contact" className="inline-block">
              <Button>Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
