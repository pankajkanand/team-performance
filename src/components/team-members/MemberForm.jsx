import React, { useState } from 'react';
import { User, Mail, Briefcase, Clock, Award, Shield, Lock, Eye, EyeOff } from 'lucide-react';

const MemberForm = ({ member, onSave, onCancel, userRole }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'team_member',
    position: member?.position || '',
    experience: member?.experience || '',
    skills: member?.skills || '',
    password: '',
    useGeneratedPassword: true
  });
  const [showPassword, setShowPassword] = useState(false);

  const positions = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'UI/UX Designer', 'Business Analyst', 'QA Engineer',
    'DevOps Engineer', 'Project Manager', 'Data Scientist',
    'Product Manager', 'Scrum Master', 'Technical Lead',
    'Software Engineer', 'Senior Developer', 'Junior Developer',
    'Marketing Manager', 'Sales Representative', 'Customer Support',
    'HR Manager', 'Operations Manager', 'Finance Manager'
  ];

  const getRoleOptions = () => {
    const baseRoles = [
      { value: 'team_member', label: 'Team Member', description: 'Can view their own feedback and reports' }
    ];
    
    // Both admin and reviewer can create reviewers
    if (userRole === 'admin' || userRole === 'reviewer') {
      baseRoles.unshift(
        { value: 'reviewer', label: 'Reviewer', description: 'Can manage team members and give feedback' }
      );
    }
    
    return baseRoles;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    
    // Only include password if not using generated password
    if (formData.useGeneratedPassword) {
      delete submitData.password;
    }
    
    delete submitData.useGeneratedPassword;
    onSave(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roleOptions = getRoleOptions();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <User className="text-indigo-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {member ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <p className="text-gray-600">
            {member ? 'Update member information and role' : 'Create a new team member with login access'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter email address"
              required
              disabled={!!member}
            />
            {member && (
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed for existing members</p>
            )}
          </div>
        </div>
        
        {/* Role Selection */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <Shield size={16} />
            Role & Permissions
          </label>
          <div className="space-y-3">
            {roleOptions.map(roleOption => (
              <label key={roleOption.value} className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-all duration-200 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={roleOption.value}
                  checked={formData.role === roleOption.value}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{roleOption.label}</div>
                  <div className="text-sm text-gray-600">{roleOption.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Position and Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Briefcase size={16} />
              Position/Job Title
            </label>
            <select
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              required
            >
              <option value="">Select Position</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Clock size={16} />
              Experience (Years)
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              placeholder="e.g., 3.5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Skills */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <Award size={16} />
            Skills & Technologies
          </label>
          <textarea
            value={formData.skills}
            onChange={(e) => handleChange('skills', e.target.value)}
            placeholder="e.g., React, Node.js, MongoDB, Python, JavaScript, TypeScript, AWS"
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 resize-vertical"
          />
          <p className="text-sm text-gray-500 mt-2">
            List the main skills and technologies this person works with
          </p>
        </div>

        {/* Password Section - Only for new members */}
        {!member && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-blue-600" size={20} />
              <h4 className="font-semibold text-blue-800">Account Password</h4>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="passwordOption"
                  checked={formData.useGeneratedPassword}
                  onChange={() => handleChange('useGeneratedPassword', true)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-blue-800">Generate Password Automatically</div>
                  <div className="text-sm text-blue-600">System will create a secure password</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="passwordOption"
                  checked={!formData.useGeneratedPassword}
                  onChange={() => handleChange('useGeneratedPassword', false)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-blue-800">Set Custom Password</div>
                  <div className="text-sm text-blue-600">Choose a password for the user</div>
                </div>
              </label>
              
              {!formData.useGeneratedPassword && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter password (min 6 characters)"
                      minLength="6"
                      required={!formData.useGeneratedPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Information Box */}
        {!member && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-green-800 mb-3">Account Creation</h4>
            <div className="text-sm text-green-700 space-y-2">
              <p>• A login account will be created automatically for this team member</p>
              <p>• They will be able to access the system based on their assigned role</p>
              <p>• You'll receive the login credentials after saving to share with them</p>
              <p>• The user can change their password after first login if needed</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <User size={18} />
            {member ? 'Update Member' : 'Create Member'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;