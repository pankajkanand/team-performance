// src/components/layout/Header.js
import React from 'react';
import { LogOut, User, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ companyName }) => {
  const { userData, signOut } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-600';
      case 'reviewer': return 'text-blue-600';
      case 'team_member': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-8 mb-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
            <Building className="text-indigo-600" size={32} />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-700">Team Performance Review</h1>
              {companyName && (
                <p className="text-base sm:text-lg text-indigo-600 font-semibold">{companyName}</p>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg text-center sm:text-left">
            Manage team members and track their performance with actionable feedback
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="text-center sm:text-right w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-end">
              <User size={16} className="text-gray-500" />
              <span className="font-semibold text-gray-700">{userData?.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
              <span className={`text-sm font-semibold capitalize ${getRoleColor(userData?.role)}`}>{userData?.role?.replace('_', ' ')}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{userData?.email}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
            title="Logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;