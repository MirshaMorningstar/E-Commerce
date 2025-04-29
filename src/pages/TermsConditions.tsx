
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TermsConditions = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Last updated: April 29, 2025</p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <p>
                  Welcome to EcoGlow! These terms and conditions outline the rules and regulations for the use of our website and services.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">1. Terms</h2>
                <p>
                  By accessing this website, you agree to be bound by these terms and conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials on EcoGlow's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software contained on EcoGlow's website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">3. Disclaimer</h2>
                <p>
                  The materials on EcoGlow's website are provided on an 'as is' basis. EcoGlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">4. Limitations</h2>
                <p>
                  In no event shall EcoGlow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EcoGlow's website, even if EcoGlow or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">5. Accuracy of Materials</h2>
                <p>
                  The materials appearing on EcoGlow's website could include technical, typographical, or photographic errors. EcoGlow does not warrant that any of the materials on its website are accurate, complete, or current. EcoGlow may make changes to the materials contained on its website at any time without notice.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">6. Links</h2>
                <p>
                  EcoGlow has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EcoGlow of the site. Use of any such linked website is at the user's own risk.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">7. Modifications</h2>
                <p>
                  EcoGlow may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms and conditions.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">8. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">9. Purchases</h2>
                <p>
                  All purchases through our site are governed by our Shipping Policy and Returns & Exchanges Policy, which are incorporated into these Terms.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
                <Link to="/shipping-policy">
                  <Button variant="outline">Shipping Policy</Button>
                </Link>
                <Link to="/returns-exchanges">
                  <Button variant="outline">Returns & Exchanges</Button>
                </Link>
                <Link to="/privacy-policy">
                  <Button variant="outline">Privacy Policy</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditions;
