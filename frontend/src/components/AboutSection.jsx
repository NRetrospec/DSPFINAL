import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Users, Award, Clock, Shield, Heart } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutSection = () => {
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load company stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get(`${API}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error loading company stats:', error);
        // Use fallback stats if API fails
        setStats({
          team_members: "40+",
          years_experience: "5+",
          on_time_delivery: "99.2%",
          customer_rating: "4.9★"
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const getStatsArray = (statsData) => [
    { icon: Users, label: "Team Members", value: statsData?.team_members || "25+" },
    { icon: Award, label: "Years Experience", value: statsData?.years_experience || "5+" },
    { icon: Clock, label: "On-Time Delivery", value: statsData?.on_time_delivery || "99.2%" },
    { icon: Shield, label: "Customer Rating", value: statsData?.customer_rating || "4.9★" }
  ];

  const coverageAreas = [
    "Boca Raton", "Delray Beach", "Boynton Beach", 
    "Lake Worth", "Wellington", "West Palm Beach"
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            About Galo Logistics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Born and raised in South Florida, we understand the pulse of our community. 
            As a proud DSP partner, we deliver more than packages – we deliver trust.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {isLoadingStats ? (
            // Loading skeleton for stats
            [1, 2, 3, 4].map((i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            getStatsArray(stats).map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <stat.icon className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-navy-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-navy-900 mb-6">Our Mission</h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Galo Logistics, we're not just delivering packages – we're connecting families, 
              supporting local businesses, and building stronger communities throughout South Florida.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our team of dedicated drivers knows every street, every neighborhood, and treats 
              every delivery with the care it deserves. We're your neighbors, delivering for neighbors.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-orange-500 mr-3" />
                <span className="text-gray-700">Family-owned and operated since 2019</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-orange-500 mr-3" />
                <span className="text-gray-700">Fully licensed and insured DSP</span>
              </div>
              <div className="flex items-center">
                <Award className="w-6 h-6 text-orange-500 mr-3" />
                <span className="text-gray-700">Top-rated delivery service partner</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="/media/amazon_group.jpeg"
              alt="Galo Logistics Team"
              className="rounded-2xl shadow-2xl w-full h-64 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm">Years Serving</div>
              <div className="text-sm">South Florida</div>
            </div>
          </div>
        </div>

        {/* Coverage Area */}
        <div className="bg-navy-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 flex items-center">
                <MapPin className="w-8 h-8 text-orange-400 mr-3" />
                Our Coverage Area
              </h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Proudly serving the heart of Palm Beach County with reliable, 
                fast, and friendly delivery services.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {coverageAreas.map((area, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors text-center justify-center py-2"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <div className="text-xl font-semibold mb-2">Complete Coverage</div>
                <div className="text-orange-100">
                  From Boca Raton to West Palm Beach, we've got you covered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;