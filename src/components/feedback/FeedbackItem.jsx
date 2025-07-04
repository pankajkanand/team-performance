// components/feedback/FeedbackItem.js
import React from 'react';
import { Calendar, User, CheckCircle, Clock } from 'lucide-react';

const FeedbackItem = ({ feedback, member, onToggleStatus, userRole }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get member name - try from feedback first, then from member object
  const memberName = feedback.memberName || member?.name || 'Unknown Member';

  return (
    <div className={`border-l-4 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 ${
      feedback.type === 'positive' ? 'border-green-500' : 'border-orange-500'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            feedback.type === 'positive' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {feedback.type === 'positive' ? '✅ Positive' : '🎯 Improvement'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            feedback.status === 'open'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {feedback.status === 'open' ? '🔓 Open' : '✅ Closed'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={14} />
          <span>{formatDate(feedback.createdAt)}</span>
        </div>
      </div>
      
      {/* Member and Project Info */}
      <div className="mb-4">
        <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <User size={18} className="text-indigo-600" />
          {memberName} - {feedback.project}
        </h4>
        <p className="text-gray-700 flex items-center gap-2">
          <strong>Reviewer:</strong> {feedback.reviewer}
        </p>
      </div>
      
      {/* Feedback Description */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-800 mb-2">Feedback:</h5>
        <p className="text-gray-700 leading-relaxed">{feedback.description}</p>
      </div>
      
      {/* Action Items */}
      {feedback.actionItems && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-orange-600" size={16} />
            <strong className="text-orange-800">Action Items:</strong>
          </div>
          <div className="text-orange-700 whitespace-pre-line text-sm leading-relaxed">
            {feedback.actionItems}
          </div>
        </div>
      )}
      
      {/* Action Button */}
      {feedback.type === 'improvement' && onToggleStatus && (userRole === 'admin' || userRole === 'reviewer') && (
        <div className="flex justify-end">
          <button
            onClick={() => onToggleStatus(feedback.id, feedback.status)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              feedback.status === 'open'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-md hover:-translate-y-0.5'
                : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {feedback.status === 'open' ? (
              <>
                <CheckCircle size={16} />
                Mark as Resolved
              </>
            ) : (
              <>
                <Clock size={16} />
                Reopen Item
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;