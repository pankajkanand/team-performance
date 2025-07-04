// components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
    <div className="text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
      <div className="text-xl">Loading Team Performance Data...</div>
    </div>
  </div>
);

export default LoadingSpinner;