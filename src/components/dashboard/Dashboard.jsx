// components/dashboard/Dashboard.js
import React from 'react';
import { Users, CheckCircle, TrendingUp, AlertTriangle, Award, Clock, Target, User } from 'lucide-react';
import StatCard from './StatCard';
import MemberCard from './MemberCard';

const Dashboard = ({ teamMembers, feedbacks, userRole, userData }) => {
  const getDashboardStats = () => {
    if (userRole === 'team_member') {
      // Stats for team member's own feedback
      const myFeedbacks = feedbacks;
      const myPositive = myFeedbacks.filter(f => f.type === 'positive').length;
      const myImprovements = myFeedbacks.filter(f => f.type === 'improvement').length;
      const myOpenItems = myFeedbacks.filter(f => f.status === 'open').length;
      
      return [
        { label: 'Total Feedback', value: myFeedbacks.length, icon: CheckCircle, color: 'text-blue-600' },
        { label: 'Positive Feedback', value: myPositive, icon: Award, color: 'text-green-600' },
        { label: 'Improvement Areas', value: myImprovements, icon: Target, color: 'text-orange-600' },
        { label: 'Open Action Items', value: myOpenItems, icon: AlertTriangle, color: 'text-red-600' }
      ];
    } else {
      // Stats for admin/reviewer
      const totalMembers = teamMembers.filter(m => m.role !== 'admin').length;
      const totalPositive = feedbacks.filter(f => f.type === 'positive').length;
      const totalImprovements = feedbacks.filter(f => f.type === 'improvement').length;
      const openItems = feedbacks.filter(f => f.status === 'open').length;

      return [
        { label: 'Team Members', value: totalMembers, icon: Users, color: 'text-blue-600' },
        { label: 'Positive Feedbacks', value: totalPositive, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Improvement Items', value: totalImprovements, icon: TrendingUp, color: 'text-orange-600' },
        { label: 'Open Items', value: openItems, icon: AlertTriangle, color: 'text-red-600' }
      ];
    }
  };

  const getRecentActivity = () => {
    // Get 5 most recent feedbacks
    return feedbacks
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 5);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = getDashboardStats();
  const recentActivity = getRecentActivity();

  // Get current user's profile for team member view
  const currentUserProfile = teamMembers.find(m => m.uid === userData?.uid);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {userRole === 'team_member' ? 'My Performance Dashboard' : 'Performance Dashboard'}
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500">Welcome back,</div>
          <div className="font-semibold text-gray-700">{userData?.name}</div>
          <div className="text-sm text-indigo-600 capitalize">
            {userData?.role?.replace('_', ' ')}
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Based on Role */}
      {userRole === 'team_member' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Profile */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">My Profile</h3>
            {currentUserProfile ? (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="text-indigo-600" size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{currentUserProfile.name}</h4>
                    <p className="text-indigo-600 font-semibold">{currentUserProfile.position}</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-700">
                  {currentUserProfile.experience && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span><strong>Experience:</strong> {currentUserProfile.experience} years</span>
                    </div>
                  )}
                  {currentUserProfile.skills && (
                    <div className="flex items-start gap-2">
                      <Award size={16} className="text-gray-500 mt-0.5" />
                      <span><strong>Skills:</strong> {currentUserProfile.skills}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span><strong>Email:</strong> {currentUserProfile.email}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Profile Not Found</h4>
                <p className="text-yellow-700">Your team member profile hasn't been created yet. Contact your administrator.</p>
              </div>
            )}
          </div>

          {/* Recent Feedback */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Feedback</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map(feedback => (
                  <div key={feedback.id} className={`p-4 rounded-xl border-l-4 ${
                    feedback.type === 'positive' ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        feedback.type === 'positive' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {feedback.type === 'positive' ? 'Positive' : 'Improvement'}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(feedback.createdAt)}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{feedback.project}</p>
                    <p className="text-sm text-gray-600 mt-1">{feedback.description.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-500 mt-2">From: {feedback.reviewer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-500">No feedback received yet</p>
                <p className="text-sm text-gray-400 mt-1">Check back later for updates!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Members Overview */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Team Overview</h3>
            {teamMembers.filter(m => m.role !== 'admin').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.filter(m => m.role !== 'admin').slice(0, 6).map(member => (
                  <MemberCard key={member.id} member={member} feedbacks={feedbacks} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Team Members</h4>
                <p className="text-gray-500">Add team members to start tracking performance</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map(feedback => {
                  const member = teamMembers.find(m => m.uid === feedback.memberUid);
                  return (
                    <div key={feedback.id} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          feedback.type === 'positive' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {feedback.type === 'positive' ? 'Positive' : 'Improvement'}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(feedback.createdAt)}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{feedback.memberName || member?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{feedback.project}</p>
                      <p className="text-xs text-gray-500 mt-1">By: {feedback.reviewer}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {feedbacks.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {userRole === 'team_member' ? 'My Performance Insights' : 'Team Performance Insights'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((feedbacks.filter(f => f.type === 'positive').length / feedbacks.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Positive Feedback</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {feedbacks.filter(f => f.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Items to Address</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {feedbacks.filter(f => f.status === 'closed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Items</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;