import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, User, LogOut, Package, Star, X, Truck, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import CartModal from '../components/CartModal';
import Logo from '../components/Logo';
import { countries, getRegionsByCountry } from '../data/countries';
import CountryFlag from '../components/CountryFlag';

const MyAccount = () => {
  const navigate = useNavigate();
  const { getTotalItems, showToast } = useCart();
  const { formatPrice, selectedCurrency, changeCurrencyByCountry, getCurrencyInfo } = useCurrency();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+233');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ orderId: '', productName: '', rating: 5, comment: '' });
  const [currentZipSuggestion, setCurrentZipSuggestion] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    state: '',
    city: '',
    area: '',
    zip: '',
    phone: ''
  });
  const [formKey, setFormKey] = useState(0);

  const email = sessionStorage.getItem('easenchic_email') || '';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email) {
      navigate('/', { replace: true });
    }
  }, [email, navigate]);

  // Generate single random zip code based on country
  const generateZipSuggestion = (country) => {
    const zipFormats = {
      'Ghana': () => Math.random().toString().slice(2, 7),
      'Nigeria': () => Math.floor(100000 + Math.random() * 900000).toString(),
      'United States': () => Math.floor(10000 + Math.random() * 90000).toString(),
      'United Kingdom': () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const letter1 = letters[Math.floor(Math.random() * letters.length)];
        const letter2 = letters[Math.floor(Math.random() * letters.length)];
        const num = Math.floor(10 + Math.random() * 90);
        return `${letter1}${letter2}${num} ${Math.floor(1 + Math.random() * 9)}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
      },
      'Canada': () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return `${letters[Math.floor(Math.random() * letters.length)]}${Math.floor(Math.random() * 10)}${letters[Math.floor(Math.random() * letters.length)]} ${Math.floor(Math.random() * 10)}${letters[Math.floor(Math.random() * letters.length)]}${Math.floor(Math.random() * 10)}`;
      },
    };
    
    const format = zipFormats[country] || zipFormats['Ghana'];
    return format();
  };

  // Load real orders from localStorage - user-specific
  const [orders, setOrders] = useState([]);
  
  // Load reviews from localStorage - user-specific
  const [reviews, setReviews] = useState([]);

  // Load user data when component mounts
  useEffect(() => {
    if (email) {
      const savedOrders = localStorage.getItem(`easenchic_orders_${email}`);
      let loadedOrders = savedOrders ? JSON.parse(savedOrders) : [];
      
      // Update order statuses based on current date
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      
      let ordersUpdated = false;
      loadedOrders = loadedOrders.map(order => {
        const deliveryDate = new Date(order.deliveryDate);
        const orderDate = new Date(order.date);
        
        // Update status based on delivery date
        if (order.status === 'Processing' && today >= deliveryDate) {
          ordersUpdated = true;
          return { ...order, status: 'Delivered', deliveredDate: deliveryDate.toISOString() };
        } else if (order.status === 'Processing') {
          // Calculate if order should be "In Transit" (within 2 days of delivery)
          const twoDaysBeforeDelivery = new Date(deliveryDate);
          twoDaysBeforeDelivery.setDate(deliveryDate.getDate() - 2);
          if (today >= twoDaysBeforeDelivery) {
            ordersUpdated = true;
            return { ...order, status: 'In Transit' };
          }
        }
        return order;
      });
      
      // Filter out orders older than 7 days from delivery
      const filteredOrders = loadedOrders.filter(order => {
        if (order.status === 'Delivered' && order.deliveredDate) {
          const deliveredDate = new Date(order.deliveredDate);
          return deliveredDate >= oneWeekAgo;
        }
        return true;
      });
      
      // Save updated orders if changes were made
      if (ordersUpdated || filteredOrders.length !== loadedOrders.length) {
        localStorage.setItem(`easenchic_orders_${email}`, JSON.stringify(filteredOrders));
      }
      
      setOrders(filteredOrders);
      
      const savedReviews = localStorage.getItem(`easenchic_reviews_${email}`);
      setReviews(savedReviews ? JSON.parse(savedReviews) : []);
    }
  }, [email]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.country-dropdown') && showCountryDropdown) {
        setShowCountryDropdown(false);
      }
      if (!e.target.closest('.phone-dropdown') && showPhoneDropdown) {
        setShowPhoneDropdown(false);
      }
    };
    
    if (showCountryDropdown || showPhoneDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCountryDropdown, showPhoneDropdown]);

  const savedFirstName = sessionStorage.getItem('easenchic_firstName') || '';
  const savedLastName = sessionStorage.getItem('easenchic_lastName') || '';
  const displayFirstName = savedFirstName || email.split('@')[0].split('.')[0];
  const firstNameCapitalized = displayFirstName.charAt(0).toUpperCase() + displayFirstName.slice(1);
  const displayName = savedLastName ? `${firstNameCapitalized} ${savedLastName}` : firstNameCapitalized;

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    // Clear session storage first
    sessionStorage.removeItem('easenchic_email');
    sessionStorage.removeItem('easenchic_firstName');
    sessionStorage.removeItem('easenchic_lastName');
    // Show toast and navigate
    showToast('Logged out successfully', 'success');
    // Force navigation to homepage
    window.location.href = '/';
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim()) {
      showToast('First name is required', 'error');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Save to sessionStorage
    sessionStorage.setItem('easenchic_firstName', formData.firstName.trim());
    if (formData.lastName.trim()) {
      sessionStorage.setItem('easenchic_lastName', formData.lastName.trim());
    } else {
      sessionStorage.removeItem('easenchic_lastName');
    }
    
    setIsSaving(false);
    
    // Clear all form fields immediately
    setFormData({
      firstName: '',
      lastName: '',
      country: '',
      state: '',
      city: '',
      area: '',
      zip: '',
      phone: ''
    });
    setPhoneCode('+233');
    setShowCountryDropdown(false);
    setShowPhoneDropdown(false);
    setCurrentZipSuggestion('');
    // Force form re-render to clear all inputs
    setFormKey(prev => prev + 1);
    
    showToast('Account details updated successfully', 'success');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleOpenReviewModal = (order, product) => {
    setReviewForm({
      orderId: order.id,
      productName: product.name,
      productImage: product.image,
      rating: 5,
      comment: ''
    });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!reviewForm.comment.trim()) {
      showToast('Please write a review comment', 'error');
      return;
    }

    const newReview = {
      id: Date.now(),
      ...reviewForm,
      date: new Date().toISOString()
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`easenchic_reviews_${email}`, JSON.stringify(updatedReviews));
    
    setIsReviewModalOpen(false);
    setReviewForm({ orderId: '', productName: '', rating: 5, comment: '' });
    showToast('Review submitted successfully!', 'success');
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`easenchic_reviews_${email}`, JSON.stringify(updatedReviews));
    showToast('Review deleted', 'success');
  };

  const handleEditReview = (review) => {
    setReviewForm({
      id: review.id,
      orderId: review.orderId,
      productName: review.productName,
      productImage: review.productImage,
      rating: review.rating,
      comment: review.comment
    });
    setIsReviewModalOpen(true);
  };

  const handleUpdateReview = () => {
    if (!reviewForm.comment.trim()) {
      showToast('Please write a review comment', 'error');
      return;
    }

    const updatedReviews = reviews.map(r => 
      r.id === reviewForm.id ? { ...reviewForm, date: new Date().toISOString() } : r
    );
    setReviews(updatedReviews);
    localStorage.setItem(`easenchic_reviews_${email}`, JSON.stringify(updatedReviews));
    
    setIsReviewModalOpen(false);
    setReviewForm({ orderId: '', productName: '', rating: 5, comment: '' });
    showToast('Review updated successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <Logo />
            </div>

            <div className="hidden md:flex flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative w-full">
                <input 
                  type="search" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                  <Search size={20} className="text-gray-600" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-3">
              {/* Currency Display */}
              <div className="hidden md:block relative group">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-help">
                  <CountryFlag countryCode={getCurrencyInfo().countryCode} size="sm" />
                  <span className="text-sm font-medium">{selectedCurrency}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  Select a country below to change currency
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>

              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search size={20} />
              </button>

              <div className="hidden md:block relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {firstNameCapitalized.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">Hi, {displayName}</span>
                  <ChevronDown size={16} className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setActiveSection('account');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                    >
                      <User size={16} />
                      <span>My Account</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#4b2e1e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* My Account Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MY ACCOUNT</h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button 
                onClick={() => setActiveSection('account')}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  activeSection === 'account' 
                    ? 'bg-gray-50 border-l-4 border-[#4b2e1e] text-[#4b2e1e] font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <User size={20} />
                <span>ACCOUNT DETAILS</span>
              </button>
              <button 
                onClick={() => setActiveSection('orders')}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  activeSection === 'orders' 
                    ? 'bg-gray-50 border-l-4 border-[#4b2e1e] text-[#4b2e1e] font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Package size={20} />
                <span>MY ORDERS</span>
              </button>
              <button 
                onClick={() => setActiveSection('reviews')}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  activeSection === 'reviews' 
                    ? 'bg-gray-50 border-l-4 border-[#4b2e1e] text-[#4b2e1e] font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Star size={20} />
                <span>REVIEWS</span>
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {activeSection === 'account' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <User size={32} className="text-gray-600" />
                    <div>
                      <h2 className="text-xl font-bold">ACCOUNT DETAILS</h2>
                      <p className="text-gray-600 text-sm">Edit your account details to make sure it's up to date.</p>
                    </div>
                  </div>

                  <form key={formKey} onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">First Name</label>
                        <input
                          key={`firstname-${formKey}`}
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          placeholder="Enter first name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Last Name</label>
                        <input
                          key={`lastname-${formKey}`}
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          placeholder="Enter last name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Country</label>
                      <div className="relative country-dropdown">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent bg-white text-left flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            {formData.country ? (
                              <>
                                <CountryFlag countryCode={countries.find(c => c.name === formData.country)?.code || 'XX'} size="md" />
                                <span>{formData.country}</span>
                              </>
                            ) : (
                              'Select Country'
                            )}
                          </span>
                          <ChevronDown size={16} className={`transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setFormData({...formData, country: country.name, state: ''});
                                  changeCurrencyByCountry(country.code);
                                  setPhoneCode(country.phoneCode);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
                              >
                                <CountryFlag countryCode={country.code} size="md" />
                                <span>{country.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">State/Region</label>
                      <select
                        key={`state-${formKey}`}
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                      >
                        <option value="">Select State/Region</option>
                        {getRegionsByCountry(formData.country).length > 0 ? (
                          getRegionsByCountry(formData.country).map((region) => (
                            <option key={region} value={region}>{region}</option>
                          ))
                        ) : (
                          <option value="Other">Other</option>
                        )}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">City</label>
                        <input
                          key={`city-${formKey}`}
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="Enter city"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Area</label>
                        <input
                          key={`area-${formKey}`}
                          type="text"
                          value={formData.area}
                          onChange={(e) => setFormData({...formData, area: e.target.value})}
                          placeholder="Enter area"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Zip code</label>
                        <div className="flex gap-2">
                          <input
                            key={`zip-${formKey}`}
                            type="text"
                            value={formData.zip}
                            onChange={(e) => setFormData({...formData, zip: e.target.value})}
                            placeholder="Enter zip code"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (formData.country) {
                                const newZip = generateZipSuggestion(formData.country);
                                setFormData({...formData, zip: newZip});
                                setCurrentZipSuggestion(newZip);
                              } else {
                                showToast('Please select a country first', 'error');
                              }
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="relative phone-dropdown">
                          <button
                            type="button"
                            onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] text-sm min-w-[140px] flex items-center justify-between gap-2"
                          >
                            <span className="flex items-center gap-2">
                              <CountryFlag countryCode={countries.find(c => c.phoneCode === phoneCode)?.code || 'XX'} size="sm" />
                              <span>{phoneCode}</span>
                            </span>
                            <ChevronDown size={14} className={`transition-transform ${showPhoneDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {showPhoneDropdown && (
                            <div className="absolute z-20 left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-[220px]">
                              {countries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setPhoneCode(country.phoneCode);
                                    setShowPhoneDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
                                >
                                  <CountryFlag countryCode={country.code} size="sm" />
                                  <span className="text-sm">{country.phoneCode} {country.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          key={`phone-${formKey}`}
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-[#4b2e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#3c2416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>SAVING...</span>
                        </>
                      ) : (
                        'SAVE CHANGES'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeSection === 'orders' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Package size={32} className="text-gray-600" />
                    <div>
                      <h2 className="text-xl font-bold">MY ORDERS</h2>
                      <p className="text-gray-600 text-sm">Take a look at your recent orders and details</p>
                    </div>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                        <Package size={48} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results</h3>
                      <p className="text-gray-600 mb-2">You do not have any orders yet</p>
                      <p className="text-gray-500 text-sm mb-6">Looks like you haven't placed any order, start shopping today.</p>
                      <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-[#4b2e1e] text-white rounded-lg font-medium hover:bg-[#3c2416] transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Order Header */}
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Order ID</p>
                                <p className="font-semibold">{order.id}</p>
                              </div>
                              <div className="h-8 w-px bg-gray-300"></div>
                              <div>
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="font-medium">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="p-4 space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                  <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Info */}
                          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-6">
                                {order.status === 'Delivered' ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <Package size={18} />
                                    <div>
                                      <p className="text-xs text-gray-600">Delivered on</p>
                                      <p className="text-sm font-medium">{new Date(order.deliveredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-blue-600">
                                    <Truck size={18} />
                                    <div>
                                      <p className="text-xs text-gray-600">Expected delivery</p>
                                      <p className="text-sm font-medium">{new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    </div>
                                  </div>
                                )}
                                <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                                <div>
                                  <p className="text-xs text-gray-600">Total</p>
                                  <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                                </div>
                              </div>
                              
                              {order.status === 'Delivered' && (
                                <button 
                                  onClick={() => handleOpenReviewModal(order, order.items[0])}
                                  className="flex items-center gap-2 px-4 py-2 bg-[#4b2e1e] text-white rounded-lg hover:bg-[#3c2416] transition-colors"
                                >
                                  <Star size={16} />
                                  <span className="text-sm font-medium">Leave Review</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'reviews' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Star size={32} className="text-gray-600" />
                    <div>
                      <h2 className="text-xl font-bold">REVIEWS</h2>
                      <p className="text-gray-600 text-sm">Manage your product reviews</p>
                    </div>
                  </div>
                  
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                        <Star size={48} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-6">You haven't written any reviews.</p>
                      <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-[#4b2e1e] text-white rounded-lg font-medium hover:bg-[#3c2416] transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-white border rounded-lg p-6 shadow-sm">
                          <div className="flex gap-4">
                            <img
                              src={review.productImage}
                              alt={review.productName}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{review.productName}</h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditReview(review)}
                                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={20}
                                    className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <>
          <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 w-full max-w-md">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <LogOut size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative animate-slideUp max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsReviewModalOpen(false);
                setReviewForm({ orderId: '', productName: '', rating: 5, comment: '' });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {reviewForm.id ? 'Edit Review' : 'Write a Review'}
              </h3>
              <p className="text-gray-600">Share your thoughts about this product</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {reviewForm.productImage && (
                  <img
                    src={reviewForm.productImage}
                    alt={reviewForm.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-lg">{reviewForm.productName}</h4>
                  <p className="text-sm text-gray-500">Rate your experience with this product</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="transition-all hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}
                    />
                  </button>
                ))}
                <span className="ml-4 text-lg font-medium text-gray-700">
                  {reviewForm.rating} {reviewForm.rating === 1 ? 'Star' : 'Stars'}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Tell us what you think about this product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent resize-none"
                rows="6"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters ({reviewForm.comment.length}/10)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setReviewForm({ orderId: '', productName: '', rating: 5, comment: '' });
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={reviewForm.id ? handleUpdateReview : handleSubmitReview}
                disabled={reviewForm.comment.length < 10}
                className="flex-1 px-6 py-3 bg-[#4b2e1e] text-white rounded-lg font-medium hover:bg-[#3c2416] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {reviewForm.id ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
