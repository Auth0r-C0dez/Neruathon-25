import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Layers } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to FloorPlan AI
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transform your ideas into beautiful floor plans using cutting-edge AI technology.
          Choose your preferred generation method below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link to="/controlnet" className="transform hover:scale-105 transition-transform">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 h-full shadow-lg border border-blue-500/20">
            <Wand2 className="w-12 h-12 text-blue-300 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              ControlNet & Stable Diffusion
            </h2>
            <p className="text-blue-200">
              Generate precise floor plans using ControlNet and Stable Diffusion for
              maximum control and creativity.
            </p>
          </div>
        </Link>

        <Link to="/multimodel" className="transform hover:scale-105 transition-transform">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 h-full shadow-lg border border-purple-500/20">
            <Layers className="w-12 h-12 text-purple-300 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Multiple Pre-trained Models
            </h2>
            <p className="text-purple-200">
              Leverage multiple AI models to generate diverse floor plan options
              and find the perfect match for your needs.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home