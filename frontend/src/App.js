import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import PageNotFound from './components/PageNotFound';
import Footer from './components/Footer';

const App = () => {
  const [user, setUser] = useState(null);

  // Updated user data from User Profile
  const handleDataFromChild = (data) => {
    setUser(data);
  };

  return (
    <Router>
      <div>
        <div className="app">

          <Navbar userData={user} />

          <Routes>

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* About */}
            <Route path="/about" element={<About />} />

            {/* Services */}
            <Route path="/services" element={<Services />} />

            {/* Contact */}
            <Route path="/contact" element={<Contact />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Profile */}
            <Route
              path="/user-profile"
              element={
                <UserProfile
                  userData={user}
                  sendDataToParent={handleDataFromChild}
                />
              }
            />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />

          </Routes>

        </div>

        <Footer />

      </div>
    </Router>
  );
};

export default App;
