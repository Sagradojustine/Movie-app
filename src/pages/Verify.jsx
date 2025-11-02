// Verify.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Verify = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Verify your email</h1>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to your email address. Click the link to start your Netflix membership.
        </p>
        <p className="text-gray-500 text-sm">
          Didn't receive the email? Check your spam folder or{' '}
          <Link to="/register" className="text-netflix-red hover:underline">
            try again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Verify;