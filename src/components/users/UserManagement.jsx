// src/components/users/UserManagement.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FirebaseService from '../../services/firebaseService';

const UserManagement = ({ showNotification }) => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'reviewer'
  });

  const { userData } = useAuth();
  const firebase = new FirebaseService();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await firebase.getCompanyUsers(userData.companyId);
      setUsers(usersData);
    } catch (error) {
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await firebase.updateUser(editingUser.id, formData);
        showNotification('User updated successfully!');
      } else {
        await firebase.createUser(formData, userData.companyId);
        showNotification('User created successfully!');
      }
      
      setFormData({ name: '', email: '', role: 'reviewer' });
      setShowAddUser(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      showNotification('Failed to save user: ' + error.message, 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowAddUser(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await firebase.deleteUser(userId);
        showNotification('User deleted successfully!');
        await loadUsers();
      } catch (error) {
        showNotification('Failed to delete user: ' + error.message, 'error');
      }
    }
  };

  const handleCancel = () => {
    setShowAddUser(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'reviewer' });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="text-purple-600" size={20} />;
      case 'reviewer': return <Users className="text-blue-600" size={20} />;
      case 'team_member': return <User className="text-green-600" size={20} />;
      default: return <User className="text-gray-600" size={20} />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'reviewer': return 'bg-blue-100 text-blue-700';
      case 'team_member': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading && !showAddUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {showAddUser && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter email address"
                  required
                  disabled={editingUser} // Don't allow email changes for existing users
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              >
                <option value="reviewer">Reviewer</option>
                <option value="team_member">Team Member</option>
                {userData.role === 'admin' && <option value="admin">Admin</option>}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Reviewer:</strong> Can manage team members and feedback<br/>
                <strong>Team Member:</strong> Can only view their own feedback<br/>
                {userData.role === 'admin' && <><strong>Admin:</strong> Full access to all features</>}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      {users.length === 0 && !showAddUser ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Yet</h3>
          <p className="text-gray-500 mb-6">Add your first team member to get started</p>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Add First User
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                {user.id !== userData.id && ( // Can't edit/delete yourself
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                      title="Edit user"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                  {user.role === 'team_member' ? 'Team Member' : 
                   user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Joined: {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}</p>
                {user.id === userData.id && (
                  <p className="text-indigo-600 font-semibold mt-1">This is you</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;