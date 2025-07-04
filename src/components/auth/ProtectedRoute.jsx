// src/components/auth/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import Login from './Login';
import { AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!currentUser || !userData) {
    return <Login />;
  }

  // Check role-based access
  if (requiredRole) {
    const userRole = userData.role;
    
    // Define role hierarchy: admin > reviewer > team_member
    const roleHierarchy = {
      admin: 3,
      reviewer: 2,
      team_member: 1
    };

    const requiredLevel = roleHierarchy[requiredRole];
    const userLevel = roleHierarchy[userRole];

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-5">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl w-full max-w-md text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this section.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Your role:</strong> 
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                  {userRole?.replace('_', ' ')}
                </span>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Required role:</strong> 
                <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold capitalize">
                  {requiredRole?.replace('_', ' ')} or higher
                </span>
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Contact your administrator if you believe this is an error.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;