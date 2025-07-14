// src/components/team-members/TeamMemberCard.js
import React from 'react';
import { Edit2, Trash2, User, Mail, Award, Clock, Shield } from 'lucide-react';

const TeamMemberCard = ({ member, feedbacks, onEdit, onDelete, userRole }) => {
  const memberFeedbacks = feedbacks.filter(f => f.memberUid === member.uid);
  const positiveFeedbacks = memberFeedbacks.filter(f => f.type === 'positive');
  const improvementFeedbacks = memberFeedbacks.filter(f => f.type === 'improvement');
  const openImprovements = improvementFeedbacks.filter(f => f.status === 'open');

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleDateString();
    }
    
    return new Date(timestamp).toLocaleDateString();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="text-purple-600" size={20} />;
      case 'reviewer': return <Award className="text-blue-600" size={20} />;
      case 'team_member': return <User className="text-green-600" size={20} />;
      default: return <User className="text-gray-600" size={20} />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'reviewer': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'team_member': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'reviewer': return 'Reviewer';
      case 'team_member': return 'Team Member';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Header with Avatar, Name, Email, and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
            <User className="text-indigo-600" size={28} />
          </div>
          <div className="flex-1 min-w-0 w-full">
            {/* Mobile: name, email, buttons stacked and centered; Desktop: name/buttons side-by-side, email below */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
              <div className="flex flex-col items-center sm:items-start w-full">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-full text-center sm:text-left">{member.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1 flex-wrap justify-center sm:justify-start">
                  <Mail size={14} />
                  <span className="text-sm break-all truncate max-w-[180px] sm:max-w-xs">{member.email}</span>
                </div>
              </div>
              {(onEdit || onDelete) && (
                <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200"
                      title="Edit member"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(member.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                      title="Delete member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role and Position */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadge(member.role)}`}>
            {getRoleIcon(member.role)}
            <span className="ml-2">{getRoleLabel(member.role)}</span>
          </span>
        </div>
        
        {member.position && (
          <div className="text-indigo-600 font-semibold text-lg">
            {member.position}
          </div>
        )}
      </div>

      {/* Professional Details */}
      <div className="space-y-3 mb-6">
        {member.experience && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span className="text-sm">{member.experience} years experience</span>
          </div>
        )}
        
        {member.skills && (
          <div className="flex items-start gap-2 text-gray-600">
            <Award size={16} className="mt-0.5" />
            <span className="text-sm line-clamp-2">{member.skills}</span>
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          {positiveFeedbacks.length} Positive
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
          {improvementFeedbacks.length} Improvements
        </span>
        {openImprovements.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            {openImprovements.length} Open
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Activity: {memberFeedbacks.length > 0 ? 'Active' : 'No feedback yet'}
          </span>
          <span className="text-indigo-600 font-semibold">
            {memberFeedbacks.length} total feedback
          </span>
        </div>
        
        <div className="text-xs text-gray-400">
          Member since: {formatDate(member.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;