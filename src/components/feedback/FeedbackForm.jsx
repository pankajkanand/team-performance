import React, { useState } from 'react';
import { MessageSquare, Target, Users, User, Calendar } from 'lucide-react';

const FeedbackForm = ({ teamMembers, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    type: '',
    project: '',
    reviewer: currentUser?.name || '',
    description: '',
    actionItems: '',
    improvementDeadline: ''
  });
  const [showActionItems, setShowActionItems] = useState(false);

  // Show team members only (exclude admins and the current user)
  // Reviewers can give feedback to team members and other reviewers (but not admins)
  const availableMembers = teamMembers.filter(member => 
    member.role !== 'admin' && 
    member.uid !== currentUser?.uid &&
    (member.role === 'team_member' || member.role === 'reviewer')
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      ...formData,
      status: formData.type === 'improvement' ? 'open' : 'closed',
      reviewerId: currentUser?.uid || null
    };
    onSubmit(feedbackData);
    
    // Reset form but keep reviewer name
    setFormData({
      memberId: '',
      type: '',
      project: '',
      reviewer: currentUser?.name || '',
      description: '',
      actionItems: '',
      improvementDeadline: ''
    });
    setShowActionItems(false);
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type }));
    setShowActionItems(type === 'improvement');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to format date to dd/mm/yyyy
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to convert dd/mm/yyyy to yyyy-mm-dd for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value; // This will be in yyyy-mm-dd format
    if (inputDate) {
      const formattedDate = formatDateForDisplay(inputDate);
      handleChange('improvementDeadline', formattedDate);
    } else {
      handleChange('improvementDeadline', '');
    }
  };

  if (availableMembers.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-8 border border-orange-200">
        <div className="text-center">
          <Users className="mx-auto text-orange-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-orange-800 mb-2">No Team Members Available</h3>
          <p className="text-orange-700">
            Add team members first to start giving feedback. Go to the Team Members tab to add your first team member.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 mb-8 border border-gray-200 shadow-lg">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="text-indigo-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Give Performance Feedback</h3>
          <p className="text-gray-600">Share constructive feedback to help your team grow</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Member and Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <User size={16} />
              Team Member
            </label>
            <select
              value={formData.memberId}
              onChange={(e) => handleChange('memberId', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white"
              required
            >
              <option value="">Select Team Member</option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.position} ({member.role === 'reviewer' ? 'Reviewer' : 'Team Member'})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Choose the person to give feedback to
            </p>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Target size={16} />
              Feedback Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white"
              required
            >
              <option value="">Select Feedback Type</option>
              <option value="positive">✅ Positive Feedback</option>
              <option value="improvement">🎯 Area for Improvement</option>
            </select>
          </div>
        </div>
        
        {/* Project and Reviewer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-3">Project/Task</label>
            <input
              type="text"
              value={formData.project}
              onChange={(e) => handleChange('project', e.target.value)}
              placeholder="e.g., E-commerce Website, Q4 Campaign, API Development"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-3">Reviewer Name</label>
            <input
              type="text"
              value={formData.reviewer}
              onChange={(e) => handleChange('reviewer', e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-gray-50"
              required
              readOnly={!!currentUser?.name}
            />
          </div>
        </div>
        
        {/* Feedback Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            {formData.type === 'positive' ? 'What did they do well?' : 'Feedback Description'}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={
              formData.type === 'positive' 
                ? "Describe what the person did exceptionally well, their strengths, and positive contributions..."
                : "Provide specific, constructive feedback about areas that need improvement..."
            }
            rows="5"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 resize-vertical"
            required
          />
        </div>
        
        {/* Action Items for Improvement */}
        {showActionItems && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-orange-600" size={20} />
              <label className="block text-orange-800 font-semibold text-lg">
                Actionable Steps for Improvement
              </label>
            </div>
            <textarea
              value={formData.actionItems}
              onChange={(e) => handleChange('actionItems', e.target.value)}
              placeholder="List specific, actionable steps for improvement:&#10;• Review the style guide and coding standards&#10;• Schedule weekly 1:1 meetings for guidance&#10;• Complete the advanced React course by month-end&#10;• Practice presenting in team meetings"
              rows="5"
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all duration-200 resize-vertical bg-white"
            />
            
            {/* Improvement Deadline */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-orange-600" size={18} />
                <label className="block text-orange-800 font-semibold">
                  Improvement Deadline
                </label>
              </div>
              <input
                type="date"
                value={formatDateForInput(formData.improvementDeadline)}
                onChange={handleDateChange}
                className="w-full sm:w-auto px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
                required
              />
              {formData.improvementDeadline && (
                <p className="text-sm text-orange-700 mt-2">
                  📅 Target improvement date: <strong>{formData.improvementDeadline}</strong>
                </p>
              )}
              <p className="text-sm text-orange-600 mt-1">
                Select the date by when this improvement should be completed
              </p>
            </div>
            
            <p className="text-sm text-orange-700 mt-4">
              💡 <strong>Tip:</strong> Be specific and actionable. Help them understand exactly what steps to take for improvement.
            </p>
          </div>
        )}
        
        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t">
          <div className="text-sm text-gray-600">
            {formData.type === 'improvement' 
              ? '🔓 Improvement feedback will be marked as "Open" and can be tracked until resolved.'
              : '✅ Positive feedback will be marked as "Completed" automatically.'
            }
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} />
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;