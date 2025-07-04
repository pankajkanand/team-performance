import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import LoadingSpinner from './components/common/LoadingSpinner';
import Dashboard from './components/dashboard/Dashboard';
import TeamMembers from './components/team-members/TeamMembers';
import FeedbackTab from './components/feedback/FeedbackTab';
import ReportsTab from './components/reports/ReportsTab';
import FirebaseService from './services/firebaseService';
import { useAuth } from './context/AuthContext';

// Main App Content Component
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [firebase] = useState(() => new FirebaseService());
  const [teamMembers, setTeamMembers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const { userData } = useAuth();

  // Show notification
  const showNotification = (message, type = 'success') => {
    console.log('Notification:', message, type);
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load all data from Firebase
  const loadData = async () => {
    if (!userData || !userData.companyId) return;

    try {
      console.log('=== LOADING DATA ===');
      setLoading(true);
      
      const [membersData, feedbacksData, companyData] = await Promise.all([
        firebase.getTeamMembers(userData.companyId, userData.uid, userData.role),
        firebase.getFeedbacks(userData.companyId, userData.uid, userData.role),
        firebase.getCompanyInfo(userData.companyId)
      ]);

      console.log('Data loaded successfully:', {
        members: membersData.length,
        feedbacks: feedbacksData.length
      });

      setTeamMembers(membersData);
      setFeedbacks(feedbacksData);
      setCompanyInfo(companyData);

    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error loading data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create team member with auth account
  const handleSaveMember = async (memberData, editingMember = null) => {
    try {
      console.log('=== SAVING MEMBER ===');
      console.log('Member data:', memberData);
      console.log('Editing member:', editingMember);
      
      if (editingMember) {
        await firebase.updateTeamMember(editingMember.id, memberData);
        showNotification('Team member updated successfully!');
        await loadData();
        return null;
      } else {
        const result = await firebase.createTeamMember(memberData, userData.companyId);
        showNotification('Team member created successfully! Login credentials generated.');
        await loadData();
        return result; // Return credentials to show in modal
      }
    } catch (error) {
      console.error('Error saving member:', error);
      showNotification('Failed to save team member: ' + error.message, 'error');
      throw error;
    }
  };

  // Delete team member
  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member? This will also delete all their feedback and remove their account access.')) {
      try {
        console.log('=== DELETING MEMBER ===');
        console.log('Member ID:', id);
        
        await firebase.deleteTeamMember(id, userData.companyId);
        showNotification('Team member deleted successfully!');
        await loadData();
      } catch (error) {
        console.error('Error deleting member:', error);
        showNotification('Failed to delete team member: ' + error.message, 'error');
      }
    }
  };

  // Add feedback
  const handleSubmitFeedback = async (feedbackData) => {
    try {
      console.log('=== SAVING FEEDBACK ===');
      console.log('Feedback data:', feedbackData);
      
      // Find the selected member to get their UID
      const selectedMember = teamMembers.find(m => m.id === feedbackData.memberId);
      if (!selectedMember) {
        throw new Error('Selected team member not found');
      }
      
      // Replace memberId with memberUid for consistency
      const feedbackToSave = {
        ...feedbackData,
        memberUid: selectedMember.uid,
        memberName: selectedMember.name
      };
      delete feedbackToSave.memberId; // Remove the old field
      
      await firebase.addFeedback(feedbackToSave, userData.companyId);
      showNotification('Feedback submitted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error saving feedback:', error);
      showNotification('Failed to submit feedback: ' + error.message, 'error');
    }
  };

  // Toggle feedback status
  const handleToggleStatus = async (feedbackId, currentStatus) => {
    try {
      console.log('=== TOGGLING FEEDBACK STATUS ===');
      console.log('Feedback ID:', feedbackId);
      console.log('Current status:', currentStatus);
      
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      await firebase.updateFeedback(feedbackId, { status: newStatus });
      showNotification('Feedback status updated successfully!');
      await loadData();
    } catch (error) {
      console.error('Error updating feedback status:', error);
      showNotification('Failed to update feedback status: ' + error.message, 'error');
    }
  };

  // Set appropriate default tab based on user role
  useEffect(() => {
    if (userData) {
      if (userData.role === 'team_member') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('dashboard');
      }
    }
  }, [userData]);

  // Load data when user data is available
  useEffect(() => {
    if (userData) {
      console.log('User data available - loading app data');
      loadData();
    }
  }, [userData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            teamMembers={teamMembers} 
            feedbacks={feedbacks} 
            userRole={userData.role}
            userData={userData}
          />
        );
      
      case 'team-members':
        return (
          <TeamMembers 
            teamMembers={teamMembers} 
            feedbacks={feedbacks}
            onSaveMember={handleSaveMember}
            onDeleteMember={handleDeleteMember}
            userRole={userData.role}
          />
        );
      
      case 'feedback':
      case 'my-feedback':
        return (
          <FeedbackTab 
            teamMembers={teamMembers} 
            feedbacks={feedbacks}
            onSubmitFeedback={handleSubmitFeedback}
            onToggleStatus={handleToggleStatus}
            userRole={userData.role}
            userData={userData}
          />
        );
      
      case 'reports':
      case 'my-reports':
        return (
          <ReportsTab 
            teamMembers={teamMembers} 
            feedbacks={feedbacks}
            userRole={userData.role}
            userData={userData}
          />
        );
      
      default:
        return (
          <Dashboard 
            teamMembers={teamMembers} 
            feedbacks={feedbacks} 
            userRole={userData.role}
            userData={userData}
          />
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-7xl mx-auto p-5">
        <Header companyName={companyInfo?.name} />
        
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl animate-fade-in ${
            notification.type === 'error' 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-500 hover:text-gray-700 ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole={userData.role}
        />
        
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Main App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default App;
