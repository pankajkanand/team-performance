// src/components/layout/Navigation.js
import React from 'react';
import { Users, TrendingUp, CheckCircle, BarChart3, MessageSquare } from 'lucide-react';

const Navigation = ({ activeTab, onTabChange, userRole }) => {
  const getTabsForRole = () => {
    const baseTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
    ];
    
    if (userRole === 'team_member') {
      return [
        ...baseTabs,
        { id: 'my-feedback', label: 'My Feedback', icon: MessageSquare },
        { id: 'my-reports', label: 'My Reports', icon: CheckCircle }
      ];
    } else {
      // Admin and Reviewer tabs (no separate user management)
      return [
        ...baseTabs,
        { id: 'team-members', label: 'Team Members', icon: Users },
        { id: 'feedback', label: 'Feedback', icon: TrendingUp },
        { id: 'reports', label: 'Reports', icon: CheckCircle }
      ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <div className="flex gap-3 mb-8 bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white/90 text-gray-700 transform -translate-y-1 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;