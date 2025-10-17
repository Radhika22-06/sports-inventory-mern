import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [items, setItems] = useState([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [formData, setFormData] = useState({
    itemId: '',
    playerName: '',
    teamName: '',
    expectedReturnDate: ''
  });
  const [returnData, setReturnData] = useState({
    returnCondition: 'good',
    returnDate: '',
    fine: 0,
    notes: ''
  });

  useEffect(() => {
    fetchIssues();
    fetchItems();
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/issues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
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

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/issues', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowIssueForm(false);
      setFormData({ itemId: '', playerName: '', teamName: '', expectedReturnDate: '' });
      fetchIssues();
      fetchItems();
    } catch (error) {
      console.error('Error issuing item:', error);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}/return`, returnData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowReturnForm(false);
      setReturnData({ returnCondition: 'good', returnDate: '', fine: 0, notes: '' });
      fetchIssues();
      fetchItems();
    } catch (error) {
      console.error('Error returning item:', error);
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
            Issue & Return Management
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Manage equipment issues and returns efficiently
          </p>
          <button
            onClick={() => setShowIssueForm(true)}
            className="btn"
            style={{
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none'
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
            Issue Item
          </button>
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
            <div className="card" style={{ width: '90%', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-box-open" style={{ color: 'var(--success-color)' }}></i>
                Issue Item
              </h2>
              <form onSubmit={handleIssue}>
                <div className="form-group">
                  <label className="form-label">Select Item</label>
                  <select
                    value={formData.itemId}
                    onChange={(e) => setFormData({...formData, itemId: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Choose an item to issue</option>
                    {items.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.name} - {item.brand} (Qty: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Player Name</label>
                  <input
                    type="text"
                    placeholder="Enter player name"
                    value={formData.playerName}
                    onChange={(e) => setFormData({...formData, playerName: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Team Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter team name"
                    value={formData.teamName}
                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Return Date</label>
                  <input
                    type="date"
                    value={formData.expectedReturnDate}
                    onChange={(e) => setFormData({...formData, expectedReturnDate: e.target.value})}
                    className="form-input"
                    required
                  />
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

        {/* Return Form Modal */}
        {showReturnForm && (
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
            <div className="card" style={{ width: '90%', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-undo" style={{ color: 'var(--warning-color)' }}></i>
                Return Item
              </h2>
              <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-box" style={{ color: 'var(--primary-color)' }}></i>
                  <strong>Item:</strong> {selectedIssue?.itemId?.name} - {selectedIssue?.itemId?.brand}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-user" style={{ color: 'var(--primary-color)' }}></i>
                  <strong>Player:</strong> {selectedIssue?.playerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-calendar" style={{ color: 'var(--primary-color)' }}></i>
                  <strong>Issue Date:</strong> {selectedIssue && new Date(selectedIssue.issueDate).toLocaleDateString()}
                </div>
              </div>
              <form onSubmit={handleReturn}>
                <div className="form-group">
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    value={returnData.returnDate}
                    onChange={(e) => setReturnData({...returnData, returnDate: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Item Condition</label>
                  <select
                    value={returnData.returnCondition}
                    onChange={(e) => setReturnData({...returnData, returnCondition: e.target.value})}
                    className="form-input"
                  >
                    <option value="good">Good Condition</option>
                    <option value="damaged">Damaged</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fine Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter fine amount if any"
                    value={returnData.fine}
                    onChange={(e) => setReturnData({...returnData, fine: e.target.value})}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    placeholder="Add any additional notes"
                    value={returnData.notes}
                    onChange={(e) => setReturnData({...returnData, notes: e.target.value})}
                    className="form-input"
                    rows="3"
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
                    Process Return
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReturnForm(false)}
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

        {/* Issues List */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {issues.map(issue => (
            <div key={issue._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-box-open" style={{ color: 'var(--primary-color)' }}></i>
                    {issue.itemId?.name} - {issue.itemId?.brand}
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-user"></i>
                      <span>Player: {issue.playerName}</span>
                    </div>
                    {issue.teamName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <i className="fas fa-users"></i>
                        <span>Team: {issue.teamName}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-calendar-plus"></i>
                      <span>Issue Date: {new Date(issue.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-calendar-times"></i>
                      <span>Expected Return: {new Date(issue.expectedReturnDate).toLocaleDateString()}</span>
                    </div>
                    {issue.returnDate && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)' }}>
                          <i className="fas fa-check-circle"></i>
                          <span>Return Date: {new Date(issue.returnDate).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <i className="fas fa-info-circle"></i>
                          <span>Condition: {issue.returnCondition}</span>
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
                  
                  {issue.notes && (
                    <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <i className="fas fa-sticky-note"></i>
                        <strong>Notes:</strong> {issue.notes}
                      </div>
                    </div>
                  )}
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
                  {(issue.status === 'issued' || issue.status === 'return-requested') && (
                    <button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowReturnForm(true);
                      }}
                      className="btn btn-success"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      <i className="fas fa-undo" style={{ marginRight: '0.5rem' }}></i>
                      Process Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {issues.length === 0 && (
            <div className="card text-center">
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No issues found</h3>
              <p style={{ color: 'var(--text-light)' }}>No equipment has been issued yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;