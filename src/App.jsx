import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EasenchicHomepage from './EasenchicHomepage';
import RouteLoader from './components/RouteLoader.jsx';
import Login from './pages/Login.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import SearchResults from './pages/SearchResults.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import MyAccount from './pages/MyAccount.jsx';

function App() {
  return (
    <>
      <RouteLoader />
      <Routes>
        <Route path="/" element={<EasenchicHomepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </>
  );
}

export default App;
