import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [filters, setFilters] = useState({ sport: '', brand: '', stockStatus: '', search: '' });
  const [sports, setSports] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '', type: '', sport: '', brand: '', quantity: '', purchaseDate: '',
    minStockLevel: '5', description: '', size: '', color: '', condition: 'new', location: ''
  });

  useEffect(() => {
    fetchItems();
    fetchSports();
    fetchBrands();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filters]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await axios.get('/api/inventory/sports');
      setSports(response.data);
    } catch (error) {
      console.error('Failed to fetch sports');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/inventory/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Failed to fetch brands');
    }
  };

  const applyFilters = () => {
    let filtered = items;
    
    if (filters.sport) filtered = filtered.filter(item => item.sport === filters.sport);
    if (filters.brand) filtered = filtered.filter(item => item.brand === filters.brand);
    if (filters.stockStatus) filtered = filtered.filter(item => item.stockStatus === filters.stockStatus);
    if (filters.search) filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(filters.search.toLowerCase())
    );
    
    setFilteredItems(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inventory', formData);
      setFormData({ name: '', type: '', sport: '', brand: '', quantity: '', purchaseDate: '',
        minStockLevel: '5', description: '', size: '', color: '', condition: 'new', location: '' });
      setShowAddForm(false);
      fetchItems();
      fetchSports();
      fetchBrands();
    } catch (error) {
      console.error('Failed to add item');
    }
  };

  const updateStock = async (id, quantity, operation) => {
    try {
      await axios.patch(`/api/inventory/${id}/stock`, { quantity: parseInt(quantity), operation });
      fetchItems();
    } catch (error) {
      console.error('Failed to update stock');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Failed to delete item');
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
          <p style={{ color: 'var(--text-secondary)' }}>Loading inventory...</p>
        </div>
      </div>
    );
  }

  const lowStockItems = items.filter(item => item.stockStatus === 'low-stock' || item.stockStatus === 'out-of-stock');

  const InventoryCard = ({ item }) => (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 1
      }}>
        <div className={`status-badge ${
          item.stockStatus === 'in-stock' ? 'status-in-stock' :
          item.stockStatus === 'low-stock' ? 'status-low-stock' : 'status-out-of-stock'
        }`}>
          <i className={`fas ${
            item.stockStatus === 'in-stock' ? 'fa-check' :
            item.stockStatus === 'low-stock' ? 'fa-exclamation' : 'fa-times'
          }`}></i>
          {item.stockStatus.replace('-', ' ')}
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
          {item.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <i className="fas fa-tag" style={{ color: 'var(--primary-color)' }}></i>
          <span style={{ color: 'var(--text-secondary)' }}>{item.sport}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <i className="fas fa-industry" style={{ color: 'var(--primary-color)' }}></i>
          <span style={{ color: 'var(--text-secondary)' }}>{item.brand}</span>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
          {item.quantity}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Available Quantity</div>
      </div>
      
      {user?.role === 'admin' && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button 
            onClick={() => updateStock(item._id, 1, 'add')}
            className="btn btn-success"
            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button 
            onClick={() => updateStock(item._id, 1, 'subtract')}
            className="btn btn-warning"
            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
          >
            <i className="fas fa-minus"></i>
          </button>
          <button 
            onClick={() => handleDelete(item._id)}
            className="btn btn-danger"
            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header */}
        <div className="card mb-4" style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Inventory Management
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            Manage your sports equipment efficiently
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn"
                style={{
                  background: showAddForm ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent-color)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i>
                {showAddForm ? 'Cancel' : 'Add Equipment'}
              </button>
            )}
            
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.25rem' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'white' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary-color)' : 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-th"></i> Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  background: viewMode === 'table' ? 'white' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary-color)' : 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-list"></i> Table
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="card mb-4" style={{
            border: '2px solid var(--warning-color)',
            background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#856404', fontSize: '1.5rem' }}></i>
              <h3 style={{ color: '#856404', margin: 0 }}>Low Stock Alert</h3>
            </div>
            <p style={{ margin: 0, color: '#856404' }}>
              {lowStockItems.length} item(s) are running low on stock: {lowStockItems.map(item => item.name).join(', ')}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-4">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <i className="fas fa-filter" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
            Filters
          </h3>
          <div className="grid grid-4">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Search equipment..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="form-group">
              <select 
                className="form-input"
                value={filters.sport} 
                onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
              >
                <option value="">All Sports</option>
                {sports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
              </select>
            </div>
            <div className="form-group">
              <select 
                className="form-input"
                value={filters.brand} 
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              >
                <option value="">All Brands</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div className="form-group">
              <select 
                className="form-input"
                value={filters.stockStatus} 
                onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
              >
                <option value="">All Stock Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="card mb-4">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              <i className="fas fa-plus" style={{ marginRight: '0.5rem', color: 'var(--success-color)' }}></i>
              Add New Equipment
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-3">
                <div className="form-group">
                  <label className="form-label">Equipment Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Equipment Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Type" 
                    value={formData.type} 
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sport</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Sport" 
                    value={formData.sport} 
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Brand" 
                    value={formData.brand} 
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="number" 
                    className="form-input"
                    placeholder="Quantity" 
                    value={formData.quantity} 
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Purchase Date</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={formData.purchaseDate} 
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Stock Level</label>
                  <input 
                    type="number" 
                    className="form-input"
                    placeholder="Min Stock Level" 
                    value={formData.minStockLevel} 
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select 
                    className="form-input"
                    value={formData.condition} 
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <i className="fas fa-plus"></i> Add Equipment
              </button>
            </form>
          </div>
        )}

        {/* Inventory Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-3">
            {filteredItems.map(item => (
              <InventoryCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Sport</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Brand</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Quantity</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Status</th>
                    {(user?.role === 'admin' || user?.role === 'staff') && (
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>{item.name}</td>
                      <td style={{ padding: '1rem' }}>{item.sport}</td>
                      <td style={{ padding: '1rem' }}>{item.brand}</td>
                      <td style={{ padding: '1rem' }}>{item.quantity}</td>
                      <td style={{ padding: '1rem' }}>
                        <div className={`status-badge ${
                          item.stockStatus === 'in-stock' ? 'status-in-stock' :
                          item.stockStatus === 'low-stock' ? 'status-low-stock' : 'status-out-of-stock'
                        }`}>
                          <i className={`fas ${
                            item.stockStatus === 'in-stock' ? 'fa-check' :
                            item.stockStatus === 'low-stock' ? 'fa-exclamation' : 'fa-times'
                          }`}></i>
                          {item.stockStatus.replace('-', ' ')}
                        </div>
                      </td>
                      {(user?.role === 'admin' || user?.role === 'staff') && (
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => updateStock(item._id, 1, 'add')}
                              className="btn btn-success"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                            <button 
                              onClick={() => updateStock(item._id, 1, 'subtract')}
                              className="btn btn-warning"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id)}
                              className="btn btn-danger"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="card text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📦</div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No items found</h3>
            <p style={{ color: 'var(--text-light)' }}>Try adjusting your filters or add some equipment to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;