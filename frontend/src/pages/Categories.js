import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const categoryIcons = {
    'Cricket': '🏏',
    'Football': '⚽',
    'Basketball': '🏀',
    'Tennis': '🎾',
    'Badminton': '🏸',
    'Swimming': '🏊',
    'Volleyball': '🏐',
    'Hockey': '🏑',
    'Baseball': '⚾',
    'Golf': '⛳'
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryItems = async (categoryName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/categories/${categoryName}/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
      setSelectedCategory(categoryName);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addCategory = async (name, description) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/categories', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCategories(); // Refresh categories list
      setNewCategory({ name: '', description: '' }); // Reset form
      setShowAddForm(false); // Hide form
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header */}
        <div className="card mb-4" style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Sports Categories
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            Browse equipment by sports categories
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Categories List */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <i className="fas fa-list" style={{ color: 'var(--primary-color)' }}></i>
                Categories
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                {showAddForm ? 'Cancel' : 'Add Category'}
              </button>
            </div>
            
            {showAddForm && (
              <div className="card" style={{ marginBottom: '1rem', border: '2px solid var(--primary-color)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Add New Category</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (newCategory.name.trim()) {
                    addCategory(newCategory.name, newCategory.description);
                  }
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Enter category name"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Description
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Enter category description (optional)"
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'var(--success-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                    Create Category
                  </button>
                </form>
              </div>
            )}
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {categories.map(category => (
                <button
                  key={category._id}
                  onClick={() => fetchCategoryItems(category.name)}
                  className="card"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: selectedCategory === category.name ? '2px solid var(--primary-color)' : '2px solid transparent',
                    background: selectedCategory === category.name ? 'var(--primary-color)' : 'var(--bg-primary)',
                    color: selectedCategory === category.name ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    padding: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.name) {
                      e.target.style.background = 'var(--bg-tertiary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.name) {
                      e.target.style.background = 'var(--bg-primary)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '2rem' }}>
                      {categoryIcons[category.name] || '🏅'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {category.name}
                      </div>
                      {category.description && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          opacity: 0.8,
                          color: selectedCategory === category.name ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)'
                        }}>
                          {category.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div>
            {selectedCategory ? (
              <>
                <div className="card mb-3" style={{ 
                  background: 'linear-gradient(135deg, var(--success-color), var(--info-color))',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {categoryIcons[selectedCategory] || '🏅'}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                    {selectedCategory} Equipment
                  </h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {items.map(item => (
                    <div key={item._id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                          {item.name}
                        </h3>
                        <div className={`status-badge ${
                          item.stockStatus === 'in-stock' ? 'status-in-stock' :
                          item.stockStatus === 'low-stock' ? 'status-low-stock' : 'status-out-of-stock'
                        }`}>
                          <i className={`fas ${
                            item.stockStatus === 'in-stock' ? 'fa-check' :
                            item.stockStatus === 'low-stock' ? 'fa-exclamation' : 'fa-times'
                          }`}></i>
                          {item.stockStatus.replace('-', ' ').toUpperCase()}
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <i className="fas fa-tag"></i>
                          <span>Type: {item.type}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <i className="fas fa-industry"></i>
                          <span>Brand: {item.brand}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <i className="fas fa-boxes"></i>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      
                      {item.description && (
                        <div style={{ 
                          padding: '0.75rem', 
                          background: 'var(--bg-tertiary)', 
                          borderRadius: 'var(--border-radius-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)'
                        }}>
                          <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                          {item.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {items.length === 0 && (
                  <div className="card text-center">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>
                      {categoryIcons[selectedCategory] || '🏅'}
                    </div>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      No items in {selectedCategory}
                    </h3>
                    <p style={{ color: 'var(--text-light)' }}>
                      This category doesn't have any equipment yet.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🏆</div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Select a Category
                </h3>
                <p style={{ color: 'var(--text-light)' }}>
                  Choose a sports category from the left to view available equipment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;