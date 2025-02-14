import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/home';
import Cart from './pages/Cart/Cart';
import Placeorder from './pages/Placeorder/Placeorder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verified/Verify';
import MyOrder from './pages/MyOrders/MyOrder';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        {/* Wrapping Routes with Router to handle React Router */}
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            {/* Define your routes */}
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<Placeorder />} />
            <Route path='/forgot-password' element={<div>Forgot Password</div>} /> {/* Add your page component for forgot password */}
            <Route path='/verify' element={<Verify />} />
            <Route path='/myorders' element={<MyOrder />} />
          </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
