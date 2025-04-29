
import React from 'react';
import Layout from '@/components/Layout';
import SectionTitle from '@/components/SectionTitle';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <SectionTitle 
          title="About CosmicChic" 
          subtitle="Our story, mission, and values"
          center
        />
        
        <div className="max-w-3xl mx-auto mt-10 space-y-8">
          <div className="prose prose-lg mx-auto">
            <p>
              Welcome to CosmicChic, your premier destination for quality cosmetics and skincare products.
              Founded in 2023, our mission is to provide high-quality beauty products that enhance your natural beauty.
            </p>
            
            <h3>Our Mission</h3>
            <p>
              At CosmicChic, we believe in beauty that empowers. We're dedicated to curating products that are not only effective
              but also ethically sourced and environmentally friendly. Our goal is to help you look and feel your best while
              making conscious choices about the products you use.
            </p>
            
            <h3>Our Products</h3>
            <p>
              We carefully select each product in our collection, ensuring that they meet our high standards for quality,
              efficacy, and sustainability. From luxurious skincare to vibrant makeup, our products are designed to enhance
              your natural beauty and boost your confidence.
            </p>
            
            <h3>Our Values</h3>
            <ul>
              <li><strong>Quality:</strong> We never compromise on the quality of our products.</li>
              <li><strong>Sustainability:</strong> We prioritize environmentally friendly practices and packaging.</li>
              <li><strong>Inclusivity:</strong> Our products are designed for all skin types, tones, and beauty needs.</li>
              <li><strong>Transparency:</strong> We believe in clear, honest communication about our products and practices.</li>
              <li><strong>Customer Satisfaction:</strong> Your happiness is our ultimate goal.</li>
            </ul>
            
            <h3>Connect With Us</h3>
            <p>
              We'd love to hear from you! Follow us on social media, sign up for our newsletter, or contact our customer
              service team with any questions or feedback. Your journey to radiant beauty starts here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
