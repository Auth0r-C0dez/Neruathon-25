import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Layout } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Layout className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">FloorPlan AI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar