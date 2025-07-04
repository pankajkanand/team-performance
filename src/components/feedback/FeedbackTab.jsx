// components/feedback/FeedbackTab.js
import React from 'react';
import FeedbackForm from './FeedbackForm';
import FeedbackItem from './FeedbackItem';

const FeedbackTab = ({ teamMembers, feedbacks, onSubmitFeedback, onToggleStatus, userRole, userData }) => {
  const canGiveFeedback = userRole === 'admin' || userRole === 'reviewer';
  
  const getTitle = () => {
    switch (userRole) {
      case 'team_member':
        return 'My Feedback';
      default:
        return 'Performance Feedback';
    }
  };

  const getEmptyStateMessage = () => {
    if (userRole === 'team_member') {
      return {
        title: 'No Feedback Yet',
        subtitle: 'You haven\'t received any feedback yet. Check back later!'
      };
    } else if (teamMembers.length === 0) {
      return {
        title: 'No Team Members',
        subtitle: 'Add team members first to start giving feedback'
      };
    } else {
      return {
        title: 'No Feedback Yet',
        subtitle: 'Submit your first feedback using the form above'
      };
    }
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{getTitle()}</h2>
      
      {canGiveFeedback && teamMembers.length > 0 && (
        <FeedbackForm 
          teamMembers={teamMembers} 
          onSubmit={onSubmitFeedback}
          currentUser={userData}
        />
      )}

      {canGiveFeedback && teamMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-400 text-2xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{emptyState.title}</h3>
          <p className="text-gray-500">{emptyState.subtitle}</p>
        </div>
      )}

      {(teamMembers.length > 0 || userRole === 'team_member') && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {userRole === 'team_member' ? 'My Feedback History' : 'Recent Feedback'}
          </h3>
          
          {feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 text-xl">💬</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">{emptyState.title}</h4>
              <p className="text-gray-500">{emptyState.subtitle}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map(feedback => {
                const member = teamMembers.find(m => m.id === feedback.memberId);
                return (
                  <FeedbackItem
                    key={feedback.id}
                    feedback={feedback}
                    member={member}
                    onToggleStatus={canGiveFeedback ? onToggleStatus : null}
                    userRole={userRole}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {userRole === 'team_member' && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">About Your Feedback</h4>
          <p className="text-sm text-blue-700">
            This section shows all feedback you've received from your managers and reviewers. 
            You can view both positive feedback and areas for improvement. If you have questions 
            about any feedback, reach out to the person who provided it.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackTab;