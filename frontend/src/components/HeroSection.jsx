import React from 'react';
import { Button } from './ui/button';
import { ChevronDown, MapPin, Truck } from 'lucide-react';

const HeroSection = () => {
  const scrollToAbout = () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 31, 61, 0.7), rgba(15, 31, 61, 0.5)), url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-12 h-12 text-orange-400 mr-3" />
            <span className="text-orange-400 font-semibold text-lg tracking-wide">GALO LOGISTICS</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-200">
          Reliable. Local.{' '}
          <span className="text-orange-400">Amazon DSP</span>{' '}
          You Can Count On.
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed animate-fade-in-up delay-400">
          Serving Boca Raton to West Palm Beach with excellence, speed, and dedication. 
          Your packages delivered with care by your local neighbors.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-600">
          <Button 
            onClick={scrollToAbout}
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Meet the Team
          </Button>
          <Button 
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            variant="outline" 
            size="lg" 
            className="border-white text-white bg-transparent hover:bg-white hover:text-navy-900 px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300"
          >
            Get In Touch
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center text-gray-300">
          <MapPin className="w-5 h-5 mr-2" />
          <span className="text-lg">Boca Raton • Delray Beach • West Palm Beach</span>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToAbout}
          className="text-white hover:text-orange-400 transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;