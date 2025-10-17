import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access Denied</div>;
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Department</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.name}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.email}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    backgroundColor: user.role === 'admin' ? '#dc3545' : user.role === 'staff' ? '#ffc107' : user.role === 'coach' ? '#17a2b8' : '#28a745',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.department || '-'}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{user.phone || '-'}</td>
                <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                  <span style={{ color: user.isActive ? 'green' : 'red' }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;