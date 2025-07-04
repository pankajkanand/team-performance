// components/dashboard/MemberCard.js
import React from 'react';
import { User, Award, Clock, Mail } from 'lucide-react';

const MemberCard = ({ member, feedbacks }) => {
  const memberFeedbacks = feedbacks.filter(f => f.memberUid === member.uid);
  const positiveFeedbacks = memberFeedbacks.filter(f => f.type === 'positive');
  const improvementFeedbacks = memberFeedbacks.filter(f => f.type === 'improvement');
  const openImprovements = improvementFeedbacks.filter(f => f.status === 'open');

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'reviewer': return 'bg-blue-100 text-blue-700';
      case 'team_member': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
          <User className="text-indigo-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
          <p className="text-indigo-600 font-semibold text-sm">{member.position}</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}>
          {getRoleLabel(member.role)}
        </span>
      </div>

      {/* Member Details */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {member.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        {member.experience && (
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{member.experience} years exp.</span>
          </div>
        )}
        {member.skills && (
          <div className="flex items-start gap-2">
            <Award size={14} className="mt-0.5" />
            <span className="line-clamp-2">{member.skills}</span>
          </div>
        )}
      </div>
      
      {/* Performance Stats */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          {positiveFeedbacks.length} Positive
        </span>
        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
          {improvementFeedbacks.length} Improvements
        </span>
        {openImprovements.length > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            {openImprovements.length} Open
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-xs text-gray-500 border-t pt-3">
        Recent Activity: {memberFeedbacks.length > 0 ? `${memberFeedbacks.length} feedback items` : 'No activity'}
      </div>
    </div>
  );
};

export default MemberCard;