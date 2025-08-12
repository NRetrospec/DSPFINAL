import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Play, Calendar, Clock, MapPin } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GallerySection = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  // Load testimonials on component mount
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await axios.get(`${API}/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Use fallback testimonials if API fails
        setTestimonials([
          {
            name: "Maria Rodriguez",
            location: "Boca Raton, FL",
            quote: "Galo Logistics always delivers on time and with a smile. Best DSP in South Florida!",
            rating: 5
          },
          {
            name: "James Thompson", 
            location: "West Palm Beach, FL",
            quote: "Professional, reliable, and truly care about the community they serve.",
            rating: 5
          }
        ]);
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    loadTestimonials();
  }, []);

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Morning Route Prep',
      description: 'Our team starts each day with thorough route planning and vehicle inspection',
      tags: ['Morning Routine', 'Safety First']
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Loading the Fleet',
      description: 'Careful loading ensures packages arrive in perfect condition',
      tags: ['Loading', 'Organization']
    },
    {
      id: 3,
      type: 'video',
      src: 'https://images.unsplash.com/photo-1521318951415-df55a9b796e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'On the Road',
      description: 'Following our routes through beautiful South Florida neighborhoods',
      tags: ['Delivery', 'Community']
    },
    {
      id: 4,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1516644246113-4052bd2d3ddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Customer Service',
      description: 'Personal touch - we treat every delivery with care and respect',
      tags: ['Customer Care', 'Service']
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Team Meeting',
      description: 'Daily briefings keep our team aligned and motivated',
      tags: ['Teamwork', 'Communication']
    },
    {
      id: 6,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1525598912003-663126343e1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'End of Day',
      description: 'Celebrating another successful day of deliveries',
      tags: ['Success', 'Satisfaction']
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            A Day in the Life of Our DSP Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how we deliver excellence, one package at a time. From dawn to dusk, 
            our dedicated team works tirelessly to serve our South Florida community.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {galleryItems.map((item) => (
            <Card 
              key={item.id} 
              className="group hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="bg-orange-500 rounded-full p-4 transform group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Stats */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-20">
          <h3 className="text-3xl font-bold text-navy-900 text-center mb-12">
            Our Daily Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-navy-900 mb-2">200+</div>
              <div className="text-gray-600">Packages Delivered Daily</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-navy-900 mb-2">150+</div>
              <div className="text-gray-600">Miles Covered Daily</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-navy-900 mb-2">7</div>
              <div className="text-gray-600">Days a Week Service</div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div>
          <h3 className="text-3xl font-bold text-navy-900 text-center mb-12">
            What Our Community Says
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-orange-500 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-navy-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;