import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import TeamMemberForm from './MemberForm';
import TeamMemberCard from './TeamMemberCard';

const TeamMembers = ({ teamMembers, feedbacks, onSaveMember, onDeleteMember, userRole }) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showCredentials, setShowCredentials] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  const handleSaveMember = async (memberData) => {
    const result = await onSaveMember(memberData, editingMember);
    
    // Show credentials if new member was created
    if (result && result.password && !editingMember) {
      setShowCredentials(result);
    }
    
    setShowAddMember(false);
    setEditingMember(null);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowAddMember(true);
  };

  const handleCancel = () => {
    setShowAddMember(false);
    setEditingMember(null);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const canManageMembers = userRole === 'admin' || userRole === 'reviewer';

  // Filter team members to exclude admin (show only team members and reviewers)
  const filteredMembers = teamMembers.filter(member => member.role !== 'admin');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
          <p className="text-gray-600 mt-2">Manage your team members and their access</p>
        </div>
        {canManageMembers && (
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <Plus size={18} />
            Add Team Member
          </button>
        )}
      </div>

      {/* Credentials Modal */}
      {showCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Team Member Created!</h3>
              <p className="text-gray-600">Share these credentials with {showCredentials.name}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email:</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-white px-3 py-2 rounded border">
                    {showCredentials.email}
                  </code>
                  <button
                    onClick={() => copyToClipboard(showCredentials.email, 'email')}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    {copiedField === 'email' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {showCredentials.isGenerated ? 'Generated Password:' : 'Password:'}
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-white px-3 py-2 rounded border">
                    {showCredentials.password}
                  </code>
                  <button
                    onClick={() => copyToClipboard(showCredentials.password, 'password')}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    {copiedField === 'password' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> {showCredentials.isGenerated 
                  ? 'The user will be prompted to change their password on first login.' 
                  : 'The user can change their password after logging in if needed.'
                } Make sure to share these credentials securely.
              </p>
            </div>
            
            <button
              onClick={() => setShowCredentials(null)}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {showAddMember && canManageMembers && (
        <TeamMemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={handleCancel}
          userRole={userRole}
        />
      )}

      {/* Empty State */}
      {filteredMembers.length === 0 && !showAddMember && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Plus className="text-indigo-600" size={32} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {userRole === 'team_member' ? 'Welcome to the Team!' : 'Build Your Team'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {userRole === 'team_member' 
              ? 'You\'re part of this organization. Check your dashboard for performance insights.'
              : 'Start building your team by adding your first team member. They\'ll get login credentials to access their personalized dashboard.'
            }
          </p>
          {canManageMembers && (
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Add Your First Team Member
            </button>
          )}
        </div>
      )}

      {/* Team Members Grid */}
      {filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <TeamMemberCard
              key={member.id}
              member={member}
              feedbacks={feedbacks}
              onEdit={canManageMembers ? handleEditMember : null}
              onDelete={canManageMembers ? onDeleteMember : null}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Team Stats */}
      {filteredMembers.length > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {filteredMembers.length}
            </div>
            <div className="text-blue-800 font-semibold">Total Team Members</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {filteredMembers.filter(m => m.role === 'reviewer').length}
            </div>
            <div className="text-green-800 font-semibold">Reviewers</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {filteredMembers.filter(m => m.role === 'team_member').length}
            </div>
            <div className="text-purple-800 font-semibold">Team Members</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
