import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Help from './pages/Help';
import Signup from './pages/Signup';
import Login from './pages/Login';
import User from './pages/User';
import Admin from './pages/Admin';
import Anonym from './pages/Anonym';
import AdminUserList from './pages/AdminUserList';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';
import AdminGeoJsonList from './pages/AdminGeoJsonList';
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/help" element={<Help />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user" element={<User />} />
            <Route path="/anonym" element={<Anonym />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/geojsons" element={<AdminGeoJsonList />} />
          </Routes>
        </BrowserRouter>
  </React.StrictMode>
);

