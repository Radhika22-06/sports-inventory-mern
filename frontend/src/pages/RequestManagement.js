import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseData, setResponseData] = useState({
    status: 'approved',
    adminNotes: ''
  });
  const [issueData, setIssueData] = useState({
    itemId: ''
  });

  useEffect(() => {
    fetchRequests();
    fetchItems();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/equipment-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.filter(item => item.quantity > 0));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/equipment-requests/${selectedRequest._id}/status`, responseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      

      
      setShowResponseForm(false);
      setResponseData({ status: 'approved', adminNotes: '' });
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedItem = items.find(item => item._id === issueData.itemId);
      
      await axios.put(`http://localhost:5000/api/equipment-requests/${selectedRequest._id}/issue`, issueData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      

      
      setShowIssueForm(false);
      setIssueData({ itemId: '' });
      fetchRequests();
      fetchItems();
      alert('Equipment issued successfully!');
    } catch (error) {
      console.error('Error issuing equipment:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header */}
        <div className="card mb-4" style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Equipment Requests Management
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            Review and manage all equipment requests from users
          </p>
        </div>

      {/* Issue Form Modal */}
      {showIssueForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-box-open" style={{ color: 'var(--success-color)' }}></i>
              Issue Equipment
            </h2>
            <form onSubmit={handleIssue}>
              <div className="form-group">
                <label className="form-label">Select Item to Issue</label>
                <select
                  value={issueData.itemId}
                  onChange={(e) => setIssueData({...issueData, itemId: e.target.value})}
                  className="form-input"
                  required
                >
                <option value="">Select Item</option>
                {items.filter(item => 
                  selectedRequest?.itemsRequested.some(req => 
                    item.name.toLowerCase().includes(req.itemType.toLowerCase()) ||
                    item.type.toLowerCase().includes(req.itemType.toLowerCase())
                  )
                ).map(item => (
                  <option key={item._id} value={item._id}>
                    {item.name} - {item.brand} (Qty: {item.quantity})
                  </option>
                ))}
              </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
                  Issue Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowIssueForm(false)}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Form Modal */}
      {showResponseForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-reply" style={{ color: 'var(--primary-color)' }}></i>
              Respond to Request
            </h2>
            <form onSubmit={handleResponse}>
              <div className="form-group">
                <label className="form-label">Decision</label>
                <select
                  value={responseData.status}
                  onChange={(e) => setResponseData({...responseData, status: e.target.value})}
                  className="form-input"
                >
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Notes</label>
                <textarea
                  placeholder="Add notes for the user"
                  value={responseData.adminNotes}
                  onChange={(e) => setResponseData({...responseData, adminNotes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                  Submit Response
                </button>
                <button
                  type="button"
                  onClick={() => setShowResponseForm(false)}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Requests List */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {requests.map(request => (
            <div key={request._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className={`fas ${request.requestType === 'team' ? 'fa-users' : 'fa-user'}`} style={{ color: 'var(--primary-color)' }}></i>
                    {request.requestType === 'team' ? `${request.teamName} - ` : 'Individual - '}{request.sport}
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-user"></i>
                      <span>Player: {request.playerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-calendar-plus"></i>
                      <span>Request Date: {new Date(request.requestDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-calendar-check"></i>
                      <span>Expected Date: {new Date(request.expectedDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-comment"></i>
                      <span>Reason: {request.reason}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-list"></i>
                      Items Requested:
                    </h4>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)' }}>
                      {request.itemsRequested.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                          <i className="fas fa-box" style={{ color: 'var(--primary-color)', fontSize: '0.75rem' }}></i>
                          <span>{item.itemType} (Qty: {item.quantity}, Priority: {item.priority})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {request.adminNotes && (
                    <div style={{ padding: '0.75rem', background: 'rgba(79, 172, 254, 0.1)', borderRadius: 'var(--border-radius-sm)', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info-color)' }}>
                        <i className="fas fa-user-shield"></i>
                        <strong>Admin Notes:</strong> {request.adminNotes}
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div className={`status-badge ${
                    request.status === 'pending' ? 'status-low-stock' :
                    request.status === 'approved' ? 'status-in-stock' :
                    request.status === 'issued' ? 'status-in-stock' :
                    'status-out-of-stock'
                  }`}>
                    <i className={`fas ${
                      request.status === 'pending' ? 'fa-clock' :
                      request.status === 'approved' ? 'fa-check' :
                      request.status === 'issued' ? 'fa-box-open' :
                      'fa-times'
                    }`}></i>
                    {request.status.toUpperCase()}
                  </div>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowResponseForm(true);
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      <i className="fas fa-reply" style={{ marginRight: '0.5rem' }}></i>
                      Respond
                    </button>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowIssueForm(true);
                      }}
                      className="btn btn-success"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      <i className="fas fa-box-open" style={{ marginRight: '0.5rem' }}></i>
                      Issue Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="card text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No requests found</h3>
              <p style={{ color: 'var(--text-light)' }}>No equipment requests have been submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;