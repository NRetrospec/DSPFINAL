import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About Us', id: 'about' },
    { label: 'Our Team', id: 'gallery' },
    { label: 'Contact', id: 'contact' },
    { label: 'FAQ', id: 'contact' }
  ];

  const serviceAreas = [
    'Boca Raton', 'Delray Beach', 'Boynton Beach', 
    'Lake Worth', 'Wellington', 'West Palm Beach'
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy-900 text-white relative">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-orange-500 text-white rounded-lg p-3 mr-4">
                <span className="font-bold text-xl">GL</span>
              </div>
              <div>
                <div className="font-bold text-xl">GALO LOGISTICS</div>
                <div className="text-gray-400">Your Trusted DSP Partner</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Serving South Florida with pride since 2019. We're more than just a delivery service – 
              we're your neighbors, committed to connecting our community one package at a time.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-orange-400" />
                <span>(954) 982-1145</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-orange-400" />
                <span>galologisticsllc@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-orange-400" />
                <span>Boca Raton, FL</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-bold text-lg mb-6">Service Areas</h3>
            <ul className="space-y-2">
              {serviceAreas.map((area, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Galo Logistics. All rights reserved. | Licensed DSP Partner
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <button className="bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300">
              <Linkedin className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;