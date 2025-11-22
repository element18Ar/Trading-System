import React from 'react';
import { Upload, ArrowRight, Search } from 'lucide-react';

// --- 1. Configuration & Theme ---
// These matches the specific hex codes from your uploaded color palette image
const THEME = {
  primaryOrange: '#F89344',
  secondaryOrange: '#FF642F',
  bgDarkBlue: '#1E3A8A', // Deep blue for navbar
  bgLightBlue: '#BFDBFE', // Light blue accent
  bgPage: '#F9FAFB',      // Very light grey for page background
};

// --- 2. Sub-Components ---

const Navbar = () => {
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between shadow-lg" style={{ backgroundColor: THEME.bgDarkBlue }}>
      {/* Logo */}
      <div className="text-2xl font-extrabold text-white tracking-wider cursor-pointer">
        TradeHub
      </div>

      {/* Desktop Navigation Links (Web View) */}
      <div className="hidden md:flex items-center gap-8 text-gray-200 font-medium text-sm lg:text-base">
        <a href="/login" className="hover:text-white hover:underline transition-all">Login</a>
        <a href="/register" className="hover:text-white hover:underline transition-all">Register</a>
        <a href="/about" className="hover:text-white hover:underline transition-all">About</a>
      </div>

      {/* Upload CTA Button */}
      <button 
        className="flex items-center gap-2 px-6 py-2 rounded-full text-white font-bold shadow-md transition transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: THEME.primaryOrange }}
      >
        <Upload size={18} strokeWidth={2.5} />
        <span>Upload Item</span>
      </button>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mt-10 px-6">
      <div 
        className="relative w-full rounded-3xl p-10 md:p-16 text-center text-white shadow-xl overflow-hidden flex flex-col items-center justify-center"
        style={{ 
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', // Vibrant Blue Gradient
          minHeight: '320px'
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-sm">
          Trade Your Way.
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl font-light">
          Swap items you have for items you need! Join the world's most vibrant bartering community today.
        </p>
        
        <button 
          className="px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          style={{ backgroundColor: THEME.primaryOrange, color: 'white' }}
        >
          Start Trading
        </button>
      </div>
    </div>
  );
};

const TradeCard = ({ title, category, imageUrl, userAvatar }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100">
      
      {/* Product Image Container */}
      <div className="h-56 overflow-hidden relative bg-gray-200">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full text-gray-700 shadow-sm">
          {category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">Condition: Like New</p>
        
        {/* Action Area */}
        <div className="mt-auto flex items-center justify-between">
          <button 
            className="px-5 py-2 rounded-lg text-white text-sm font-bold shadow-sm hover:opacity-90 transition"
            style={{ backgroundColor: '#2563EB' }}
          >
            Offer Trade
          </button>
          
          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden">
               <img src={userAvatar} alt="user" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Page Component ---

const Homepage = () => {
  // MOCK DATA: In a real MERN app, you would fetch this via useEffect from your Node/Express backend
  const featuredItems = [
    { id: 1, title: "Vintage Camera", category: "Electronics", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80", user: "https://i.pravatar.cc/150?img=12" },
    { id: 2, title: "Leather Jacket", category: "Fashion", img: "https://images.unsplash.com/photo-1551028919-ac76cd469184?auto=format&fit=crop&w=500&q=80", user: "https://i.pravatar.cc/150?img=33" },
    { id: 3, title: "Classic Headphones", category: "Audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80", user: "https://i.pravatar.cc/150?img=59" },
    { id: 4, title: "Ceramic Pot Set", category: "Home", img: "https://images.unsplash.com/photo-1578749556935-412c26a4a66d?auto=format&fit=crop&w=500&q=80", user: "https://i.pravatar.cc/150?img=21" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: THEME.bgPage }}>
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pb-20">
        
        {/* Hero Banner */}
        <HeroSection />

        {/* Featured Trades Section */}
        <div className="w-full max-w-7xl mx-auto px-6 mt-16">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Trades</h2>
            <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight size={18} />
            </button>
          </div>

          {/* Responsive Grid: 1 col (mobile) -> 2 col (tablet) -> 4 col (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item) => (
              <TradeCard 
                key={item.id}
                title={item.title}
                category={item.category}
                imageUrl={item.img}
                userAvatar={item.user}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Homepage;