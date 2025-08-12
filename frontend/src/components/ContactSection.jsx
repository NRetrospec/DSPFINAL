import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting Galo Logistics. We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "(561) 555-0123",
      subtext: "Monday - Friday, 8AM - 6PM"
    },
    {
      icon: Mail,
      title: "Email", 
      details: "info@galologistics.com",
      subtext: "We respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Service Area",
      details: "Boca Raton to West Palm Beach",
      subtext: "Complete Palm Beach County coverage"
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: "Monday - Sunday",
      subtext: "6AM - 9PM delivery window"
    }
  ];

  const faqs = [
    {
      question: "What areas do you service?",
      answer: "We provide delivery services throughout Palm Beach County, including Boca Raton, Delray Beach, Boynton Beach, Lake Worth, Wellington, and West Palm Beach. If you're unsure if we serve your area, please contact us!"
    },
    {
      question: "What are your delivery hours?",
      answer: "Our delivery window is from 6AM to 9PM, Monday through Sunday. Most deliveries are completed between 10AM and 8PM, but we work extended hours during peak seasons to ensure all packages are delivered on time."
    },
    {
      question: "How can I track my package?",
      answer: "All packages are tracked through Amazon's tracking system. You'll receive notifications with tracking information when your package is out for delivery. You can also track your package directly through your Amazon account or the Amazon app."
    },
    {
      question: "What if I'm not home for delivery?",
      answer: "We follow Amazon's delivery protocols. If you're not home, we'll attempt to deliver to a safe location on your property or follow any specific delivery instructions you've provided. For packages requiring a signature, we'll attempt redelivery or leave a notice."
    },
    {
      question: "Do you handle special delivery requests?",
      answer: "Yes! We accommodate special delivery instructions whenever possible. You can add delivery notes in your Amazon account, or contact us directly for specific requirements. We're committed to making sure your packages are delivered safely and conveniently."
    },
    {
      question: "How do I report an issue with my delivery?",
      answer: "If you experience any issues with your delivery, please contact us immediately at (561) 555-0123 or email info@galologistics.com. We take all delivery concerns seriously and will work quickly to resolve any problems."
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our services? Need to report a delivery issue? 
            We're here to help and always happy to hear from our community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-navy-900 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-orange-500" />
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full"
                    placeholder="How can we help you today?"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-lg p-3 mr-4">
                      <info.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-lg mb-1">{info.title}</h3>
                      <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                      <p className="text-gray-600 text-sm">{info.subtext}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-navy-900 text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left text-navy-900 font-semibold hover:text-orange-600 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;