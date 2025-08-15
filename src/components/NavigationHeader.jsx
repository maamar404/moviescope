import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, BellIcon, UserIcon } from 'lucide-react';

const NavigationHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative bg-black/90 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={handleLogoClick}
          >
              <img
                src={`${process.env.PUBLIC_URL}/logo.svg`} 
                alt="Logo"
                className="w-10"
                />
            <span className="text-xl font-bold text-white">MovieScope</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-white hover:text-blue-400 transition-colors font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-white transition-colors font-medium relative group"
            >
              Movies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-white transition-colors font-medium relative group"
            >
              TV Shows
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-white transition-colors font-medium relative group"
            >
              Trending
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-white transition-colors font-medium relative group"
            >
              My List
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {/* Notifications */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative">
              <BellIcon className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </span>
            </button>

            {/* User Profile */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // Close icon (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden border-t border-white/10 bg-black/95 transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen 
          ? 'max-h-64 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-3 space-y-2">
          <a 
            href="#" 
            className="block text-white hover:text-blue-400 transition-colors font-medium py-2"
            onClick={closeMobileMenu}
          >
            Home
          </a>
          <a 
            href="#" 
            className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
            onClick={closeMobileMenu}
          >
            Movies
          </a>
          <a 
            href="#" 
            className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
            onClick={closeMobileMenu}
          >
            TV Shows
          </a>
          <a 
            href="#" 
            className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
            onClick={closeMobileMenu}
          >
            Trending
          </a>
          <a 
            href="#" 
            className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
            onClick={closeMobileMenu}
          >
            My List
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;