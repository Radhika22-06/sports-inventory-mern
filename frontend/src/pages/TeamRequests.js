import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeamRequests = () => {
  const [requests, setRequests] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showReturnRequest, setShowReturnRequest] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [returnRequest, setReturnRequest] = useState({
    notes: ''
  });
  const [formData, setFormData] = useState({
    requestType: 'individual',
    teamName: '',
    sport: '',
    itemsRequested: [{ itemType: '', quantity: 1, priority: 'medium' }],
    expectedDate: '',
    reason: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMyRequests();
    fetchMyIssues();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/equipment-requests/my-requests/${user.name}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchMyIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/issues/my-issues/${user.name}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyIssues(response.data);
    } catch (error) {
      console.error('Error fetching my issues:', error);
    }
  };

  const addItemRequest = () => {
    setFormData({
      ...formData,
      itemsRequested: [...formData.itemsRequested, { itemType: '', quantity: 1, priority: 'medium' }]
    });
  };

  const updateItemRequest = (index, field, value) => {
    const updated = formData.itemsRequested.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, itemsRequested: updated });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/equipment-requests', {
        ...formData,
        playerName: user.name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowRequestForm(false);
      setFormData({
        requestType: 'individual',
        teamName: '',
        sport: '',
        itemsRequested: [{ itemType: '', quantity: 1, priority: 'medium' }],
        expectedDate: '',
        reason: ''
      });
      fetchMyRequests();
      alert('Equipment request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const submitReturnRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}/return-request`, returnRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowReturnRequest(false);
      setReturnRequest({ notes: '' });
      fetchMyIssues();
      alert('Return request sent to admin!');
    } catch (error) {
      console.error('Error submitting return request:', error);
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
            My Equipment Dashboard
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Manage your equipment requests and issued items
          </p>
          <button
            onClick={() => setShowRequestForm(true)}
            className="btn"
            style={{
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none'
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
            New Request
          </button>
        </div>

        {/* Tabs */}
        <div className="card mb-4">
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: activeTab === 'requests' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'requests' ? 'white' : 'var(--text-secondary)',
                borderRadius: 'var(--border-radius-sm)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <i className="fas fa-clipboard-list" style={{ marginRight: '0.5rem' }}></i>
              My Requests
            </button>
            <button
              onClick={() => setActiveTab('issued')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: activeTab === 'issued' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'issued' ? 'white' : 'var(--text-secondary)',
                borderRadius: 'var(--border-radius-sm)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <i className="fas fa-box-open" style={{ marginRight: '0.5rem' }}></i>
              Issued Items
            </button>
          </div>
        </div>

      {/* Request Form Modal */}
      {showRequestForm && (
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
          <div className="card" style={{
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-clipboard-list" style={{ color: 'var(--primary-color)' }}></i>
              Equipment Request
            </h2>
            <form onSubmit={submitRequest}>
              <div className="form-group">
                <label className="form-label">Request Type</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({...formData, requestType: e.target.value, teamName: e.target.value === 'individual' ? '' : formData.teamName})}
                  className="form-input"
                >
                  <option value="individual">Individual Request</option>
                  <option value="team">Team Request</option>
                </select>
              </div>
              {formData.requestType === 'team' && (
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    placeholder="Enter team name"
                    value={formData.teamName}
                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({...formData, sport: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Sport</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                </select>
              </div>
              
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-list" style={{ color: 'var(--primary-color)' }}></i>
                {formData.requestType === 'individual' ? 'Items I Need:' : 'Items Team Needs:'}
              </h3>
              {formData.itemsRequested.map((item, index) => (
                <div key={index} className="card" style={{ marginBottom: '1rem', padding: '1rem', border: '2px solid var(--border-color)' }}>
                  <input
                    type="text"
                    placeholder={formData.requestType === 'individual' ? 
                      "Item Type (e.g., Cricket Bat for practice)" : 
                      "Item Type (e.g., Cricket Bat)"
                    }
                    value={item.itemType}
                    onChange={(e) => updateItemRequest(index, 'itemType', e.target.value)}
                    className="form-input"
                    style={{ marginBottom: '0.5rem' }}
                    required
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateItemRequest(index, 'quantity', e.target.value)}
                      className="form-input"
                      min="1"
                      max={formData.requestType === 'individual' ? "3" : "50"}
                      required
                    />
                    <select
                      value={item.priority}
                      onChange={(e) => updateItemRequest(index, 'priority', e.target.value)}
                      className="form-input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  {formData.itemsRequested.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.itemsRequested.filter((_, i) => i !== index);
                        setFormData({ ...formData, itemsRequested: updated });
                      }}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', marginTop: '0.5rem' }}
                    >
                      <i className="fas fa-trash" style={{ marginRight: '0.25rem' }}></i>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addItemRequest}
                className="btn btn-secondary"
                style={{ marginBottom: '1rem', fontSize: '0.875rem' }}
              >
                <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                Add {formData.requestType === 'individual' ? 'Another Item' : 'Item'}
              </button>
              
              <div className="form-group">
                <label className="form-label">Expected Date</label>
                <input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea
                  placeholder={formData.requestType === 'individual' ? 
                    "Why do you need these items? (e.g., upcoming match, practice session)" :
                    "Reason for team request"
                  }
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
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

      {/* Return Request Modal */}
      {showReturnRequest && (
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
              <i className="fas fa-undo" style={{ color: 'var(--warning-color)' }}></i>
              Request to Return Item
            </h2>
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-box" style={{ color: 'var(--primary-color)' }}></i>
                <strong>Item:</strong> {selectedIssue?.itemId?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-industry" style={{ color: 'var(--primary-color)' }}></i>
                <strong>Brand:</strong> {selectedIssue?.itemId?.brand}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-calendar" style={{ color: 'var(--primary-color)' }}></i>
                <strong>Issued Date:</strong> {selectedIssue && new Date(selectedIssue.issueDate).toLocaleDateString()}
              </div>
            </div>
            <form onSubmit={submitReturnRequest}>
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  placeholder="Why do you want to return this item?"
                  value={returnRequest.notes}
                  onChange={(e) => setReturnRequest({...returnRequest, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                  Send Return Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowReturnRequest(false)}
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

        {/* Tab Content */}
        {activeTab === 'requests' && (
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
                        {request.requestType === 'individual' ? 'Items Needed:' : 'Team Items:'}
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
                </div>
              </div>
            ))}
          {requests.length === 0 && (
            <div className="card text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No requests yet</h3>
              <p style={{ color: 'var(--text-light)' }}>You haven't submitted any equipment requests.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'issued' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {myIssues.map(issue => (
            <div key={issue._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-box-open" style={{ color: 'var(--primary-color)' }}></i>
                    {issue.itemId?.name} - {issue.itemId?.brand}
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-calendar-plus"></i>
                      <span>Issue Date: {new Date(issue.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-calendar-times"></i>
                      <span>Expected Return: {new Date(issue.expectedReturnDate).toLocaleDateString()}</span>
                    </div>
                    {issue.returnRequestDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info-color)' }}>
                        <i className="fas fa-paper-plane"></i>
                        <span>Return Request Sent: {new Date(issue.returnRequestDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {issue.returnDate && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)' }}>
                          <i className="fas fa-check-circle"></i>
                          <span>Returned: {new Date(issue.returnDate).toLocaleDateString()}</span>
                        </div>
                        {issue.fine > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>Fine: ₹{issue.fine}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div className={`status-badge ${
                    issue.status === 'issued' ? 'status-low-stock' :
                    issue.status === 'return-requested' ? 'status-in-stock' :
                    'status-in-stock'
                  }`}>
                    <i className={`fas ${
                      issue.status === 'issued' ? 'fa-box-open' :
                      issue.status === 'return-requested' ? 'fa-paper-plane' :
                      'fa-check-circle'
                    }`}></i>
                    {issue.status.replace('-', ' ').toUpperCase()}
                  </div>
                  {issue.status === 'issued' && (
                    <button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowReturnRequest(true);
                      }}
                      className="btn btn-warning"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      <i className="fas fa-undo" style={{ marginRight: '0.5rem' }}></i>
                      Request Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {myIssues.length === 0 && (
            <div className="card text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📦</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No issued items</h3>
              <p style={{ color: 'var(--text-light)' }}>You don't have any equipment issued to you currently.</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default TeamRequests;