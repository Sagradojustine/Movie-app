// NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-netflix-red mb-4">404</h1>
      <h2 className="text-4xl font-bold text-white mb-6">Page Not Found</h2>
      <p className="text-gray-400 text-xl mb-8 max-w-md">
        Sorry, we can't find that page. You'll find lots to explore on the home page.
      </p>
      <Link 
        to="/"
        className="px-8 py-3 bg-netflix-red hover:bg-red-700 rounded text-white font-medium text-lg transition-colors"
      >
        Netflix Home
      </Link>
    </div>
  );
};

export default NotFound;