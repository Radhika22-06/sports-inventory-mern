import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyIssues = () => {
  const [myIssues, setMyIssues] = useState([]);
  const [showReturnRequest, setShowReturnRequest] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [returnRequest, setReturnRequest] = useState({
    requestedReturnDate: '',
    condition: 'good',
    notes: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMyIssues();
  }, []);

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

  const submitReturnRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/issues/${selectedIssue._id}/return-request`, returnRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowReturnRequest(false);
      setReturnRequest({ requestedReturnDate: '', condition: 'good', notes: '' });
      fetchMyIssues();
      alert('Return request submitted! Admin will process it.');
    } catch (error) {
      console.error('Error submitting return request:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Issued Items</h1>

      {/* Return Request Modal */}
      {showReturnRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Return Request</h2>
            <form onSubmit={submitReturnRequest}>
              <input
                type="date"
                value={returnRequest.requestedReturnDate}
                onChange={(e) => setReturnRequest({...returnRequest, requestedReturnDate: e.target.value})}
                className="w-full p-2 border rounded mb-3"
                required
              />
              <select
                value={returnRequest.condition}
                onChange={(e) => setReturnRequest({...returnRequest, condition: e.target.value})}
                className="w-full p-2 border rounded mb-3"
              >
                <option value="good">Good Condition</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
              </select>
              <textarea
                placeholder="Notes (optional)"
                value={returnRequest.notes}
                onChange={(e) => setReturnRequest({...returnRequest, notes: e.target.value})}
                className="w-full p-2 border rounded mb-3"
                rows="3"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowReturnRequest(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Issues List */}
      <div className="grid gap-4">
        {myIssues.map(issue => (
          <div key={issue._id} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{issue.itemId?.name} - {issue.itemId?.brand}</h3>
                <p className="text-gray-600">Issue Date: {new Date(issue.issueDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Expected Return: {new Date(issue.expectedReturnDate).toLocaleDateString()}</p>
                {issue.returnRequestDate && (
                  <p className="text-blue-600">Return Requested: {new Date(issue.returnRequestDate).toLocaleDateString()}</p>
                )}
                {issue.returnDate && (
                  <>
                    <p className="text-green-600">Returned: {new Date(issue.returnDate).toLocaleDateString()}</p>
                    {issue.fine > 0 && <p className="text-red-600">Fine: ₹{issue.fine}</p>}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  issue.status === 'issued' ? 'bg-yellow-100 text-yellow-800' :
                  issue.status === 'return-requested' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {issue.status.replace('-', ' ').toUpperCase()}
                </span>
                {issue.status === 'issued' && (
                  <button
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowReturnRequest(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Request Return
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {myIssues.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No items issued to you
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;