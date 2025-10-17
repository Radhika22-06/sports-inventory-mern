import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import Categories from './pages/Categories';
import Issues from './pages/Issues';
import TeamRequests from './pages/TeamRequests';
import RequestManagement from './pages/RequestManagement';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
            <Route path="/issues" element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Issues />
                </RoleBasedRoute>
              </PrivateRoute>
            } />
            <Route path="/requests" element={<PrivateRoute><TeamRequests /></PrivateRoute>} />
            <Route path="/request-management" element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <RequestManagement />
                </RoleBasedRoute>
              </PrivateRoute>
            } />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/users" element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </RoleBasedRoute>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;