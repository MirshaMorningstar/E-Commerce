
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: April 29, 2025</p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <p>
                  At EcoGlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
                <p>We collect information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Register on our website</li>
                  <li>Place an order</li>
                  <li>Sign up for our newsletter</li>
                  <li>Contact us with inquiries</li>
                  <li>Participate in promotions or surveys</li>
                </ul>
                
                <p>The personal information we may collect includes:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Mailing address</li>
                  <li>Phone number</li>
                  <li>Payment information (we do not store complete credit card information)</li>
                  <li>Order history</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
                <p>We may use the information we collect for various purposes, including to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and updates</li>
                  <li>Respond to your questions and requests</li>
                  <li>Improve our products and services</li>
                  <li>Send periodic emails about new products, special offers, or other information</li>
                  <li>Administer contests, promotions, surveys or other site features</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Third-Party Disclosure</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described below:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Service providers who assist us in operating our website, conducting our business, or providing services to you</li>
                  <li>Trusted third parties who agree to keep this information confidential</li>
                  <li>When required by law to comply with a legal process</li>
                  <li>To protect our rights or property, and when we believe disclosure is necessary</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Data Security</h2>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use secure socket layer technology (SSL) for processing payments, and we do not store your full credit card information on our servers.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Your Rights</h2>
                <p>You have certain rights regarding your personal information, including:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>The right to access personal information we hold about you</li>
                  <li>The right to request correction of your personal information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to opt-out of marketing communications</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through our Contact page.
                </p>
              </div>
              
              <div className="mt-10 text-center">
                <Link to="/contact">
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

export default PrivacyPolicy;
