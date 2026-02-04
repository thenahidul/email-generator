
import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduGen
            </span>
          </div>
          <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Generator</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Inbox</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Benefits</a>
          </div>
          <div className="flex items-center space-x-4">
             <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full animate-pulse"></span>
                API Connected
             </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
