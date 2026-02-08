import React from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../components/ToastProvider.jsx';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, ShoppingCart, ChevronDown, User, LogOut, X, Menu } from 'lucide-react';
import CartModal from '../components/CartModal';
import Logo from '../components/Logo';
import CountryFlag from '../components/CountryFlag';

const Checkout = () => {
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { formatPrice, selectedCurrency, getCurrencyInfo } = useCurrency();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = React.useState('');
  const [showShippingModal, setShowShippingModal] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [merchantNote, setMerchantNote] = React.useState('');
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [details, setDetails] = React.useState({
    name: '', email: '', phone: '', address: '', city: '', state: ''
  });

  const email = sessionStorage.getItem('easenchic_email') || '';
  const isLoggedIn = !!email;
  const savedFirstName = sessionStorage.getItem('easenchic_firstName') || '';
  const savedLastName = sessionStorage.getItem('easenchic_lastName') || '';
  const displayFirstName = savedFirstName || (email ? email.split('@')[0].split('.')[0] : '');
  const firstNameCapitalized = displayFirstName.charAt(0).toUpperCase() + displayFirstName.slice(1);
  const displayName = savedLastName ? `${firstNameCapitalized} ${savedLastName}` : firstNameCapitalized;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (getTotalItems() === 0) {
      showToast('Your cart is empty. Please add items first.', 'error');
      navigate('/');
    }
  }, [getTotalItems, navigate, showToast]);

  // Network status monitoring
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Back online! 🌐', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('No internet connection. Please check your network.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  const handleLogout = () => {
    sessionStorage.removeItem('easenchic_email');
    sessionStorage.removeItem('easenchic_firstName');
    sessionStorage.removeItem('easenchic_lastName');
    setIsUserDropdownOpen(false);
    setIsLogoutModalOpen(false);
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const shippingFee = shippingMethod === 'express' ? 3500 : shippingMethod === 'standard' ? 2000 : 0;
  const subtotal = getTotalPrice();
  const discount = coupon.trim().toUpperCase() === 'EASEN10' ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount) + shippingFee;

  const placeOrder = (e) => {
    e.preventDefault();
    
    // Check if cart is empty
    if (getTotalItems() === 0) {
      showToast('Your cart is empty. Add items before placing an order.', 'error');
      return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn) {
      showToast('Please login first to complete your purchase', 'error');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    
    // Check network connection
    if (!navigator.onLine) {
      showToast('No internet connection. Please check your network.', 'error');
      return;
    }
    
    if (!shippingMethod) {
      showToast('Please select a shipping method', 'error');
      return;
    }
    setIsPlacingOrder(true);
    
    // Calculate delivery date based on shipping method
    const today = new Date();
    const deliveryDate = new Date(today);
    if (shippingMethod === 'express') {
      deliveryDate.setDate(today.getDate() + 2); // 2 days for express
    } else if (shippingMethod === 'standard') {
      deliveryDate.setDate(today.getDate() + 5); // 5 days for standard
    } else {
      deliveryDate.setDate(today.getDate() + 10); // 10 days for economy
    }
    
    // Create new order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      status: 'Processing',
      items: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: total,
      shippingMethod: shippingMethod
    };
    
    // Save to localStorage - user-specific
    const userEmail = sessionStorage.getItem('easenchic_email') || 'guest';
    const existingOrders = JSON.parse(localStorage.getItem(`easenchic_orders_${userEmail}`) || '[]');
    
    // Clear delivered orders when adding new ones
    const activeOrders = existingOrders.filter(order => order.status !== 'Delivered');
    activeOrders.push(newOrder);
    localStorage.setItem(`easenchic_orders_${userEmail}`, JSON.stringify(activeOrders));
    
    setTimeout(() => {
      showToast('Order placed successfully!', 'success');
      clearCart();
      setIsPlacingOrder(false);
      navigate('/my-account');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Full Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <Logo />
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative w-full">
                <input 
                  type="search" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                  <Search size={20} className="text-gray-600" />
                </button>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              {/* Currency Display */}
              <div className="hidden md:block relative group">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-help">
                  <CountryFlag countryCode={getCurrencyInfo().countryCode} size="sm" />
                  <span className="text-sm font-medium">{selectedCurrency}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  Go to My Account to change currency
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>

              {/* Search Icon - Mobile */}
              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Login / User Dropdown */}
              {isLoggedIn ? (
                <div className="relative hidden md:block">
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#4b2e1e] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {firstNameCapitalized.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">Hi, {displayName}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                      <Link 
                        to="/my-account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                      >
                        <User size={16} />
                        <span>My Account</span>
                      </Link>
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
              ) : (
                <Link 
                  to="/login"
                  className="hidden md:block text-sm font-medium hover:text-[#4b2e1e] transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>

              {/* Cart */}
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

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50 flex items-start justify-center pt-4">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Search Products</h3>
                <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }} className="relative">
                <input 
                  type="search" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md">
                  <Search size={20} className="text-gray-600" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl animate-slideLeft">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Currency</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CountryFlag countryCode={getCurrencyInfo().countryCode} size="sm" />
                    <span className="font-medium">{selectedCurrency}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Go to My Account to change</p>
                </div>

                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {firstNameCapitalized.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{displayName}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/my-account');
                      }}
                      className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <User size={18} />
                      View account
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full px-4 py-3 bg-[#4b2e1e] text-white rounded-lg text-sm font-medium hover:bg-[#3d2518]"
                  >
                    Login / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <form onSubmit={placeOrder} className="lg:col-span-2 space-y-8">
            {/* Delivery Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Delivery Details</h2>
              <div className="space-y-4">
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                  placeholder="Full name" 
                  value={details.name} 
                  onChange={(e)=>setDetails({ ...details, name: e.target.value })} 
                  required
                />
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                  placeholder="Email" 
                  value={details.email} 
                  onChange={(e)=>setDetails({ ...details, email: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                  placeholder="Phone" 
                  value={details.phone} 
                  onChange={(e)=>setDetails({ ...details, phone: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                  placeholder="Address" 
                  value={details.address} 
                  onChange={(e)=>setDetails({ ...details, address: e.target.value })} 
                  required
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                    placeholder="City" 
                    value={details.city} 
                    onChange={(e)=>setDetails({ ...details, city: e.target.value })} 
                  />
                  <input 
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                    placeholder="State" 
                    value={details.state} 
                    onChange={(e)=>setDetails({ ...details, state: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            {/* Note for Merchant */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900">Note for merchant</h2>
              <p className="text-sm text-gray-600 mb-4">Add any extra information for the merchant</p>
              <textarea
                value={merchantNote}
                onChange={(e) => setMerchantNote(e.target.value)}
                placeholder="Special delivery instructions, gift message, etc."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent resize-none"
              />
            </div>

            {/* Shipping Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900 uppercase">Shipping Method</h2>
              <p className="text-sm text-gray-600 mb-4">Click the button below to choose a shipping method</p>
              <button
                type="button"
                onClick={() => setShowShippingModal(true)}
                className="w-full bg-[#4b2e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#3c2416] transition-colors"
              >
                {shippingMethod ? `Selected: ${shippingMethod === 'standard' ? `Standard (${formatPrice(2000)})` : `Express (${formatPrice(3500)})`}` : 'Select Shipping Method'}
              </button>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Choose Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="payment" className="w-4 h-4" defaultChecked />
                  <span className="font-medium">Pay on Delivery</span>
                </label>
                <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors opacity-60">
                  <input type="radio" name="payment" className="w-4 h-4" disabled />
                  <span className="font-medium">Card/Transfer (Coming soon)</span>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              type="submit" 
              disabled={isPlacingOrder || !shippingMethod || getTotalItems() === 0}
              className="w-full bg-[#4b2e1e] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#3c2416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Placing Order...</span>
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>

          {/* Right Column - Order Summary */}
          <aside className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase">Your Order</h2>
              
              {/* Products */}
              <div className="mb-6">
                <div className="flex justify-between font-semibold text-sm text-gray-700 mb-4 pb-2 border-b">
                  <span>PRODUCT</span>
                  <span>SUBTOTAL</span>
                </div>
                <div className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">Your cart is empty</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-sm text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-semibold text-gray-900">{formatPrice(shippingFee)}</span>
                </div>
                
                {/* Coupon Input */}
                <div className="pt-2">
                  <input 
                    value={coupon} 
                    onChange={(e)=>setCoupon(e.target.value)} 
                    placeholder="Enter coupon code" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent" 
                  />
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(Math.round(discount))}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#4b2e1e]">{formatPrice(Math.round(total))}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Shipping Method Modal */}
      {showShippingModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowShippingModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Shipping Method</h3>
            <div className="space-y-3 mb-6">
              <label 
                className={`flex items-center justify-between gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  shippingMethod === 'standard' ? 'border-[#4b2e1e] bg-[#f7f0e8]' : 'border-gray-300'
                }`}
                onClick={() => setShippingMethod('standard')}
              >
                <div>
                  <p className="font-semibold">Standard Shipping</p>
                  <p className="text-sm text-gray-600">Delivery in 5-7 business days</p>
                </div>
                <span className="font-bold text-[#4b2e1e]">{formatPrice(2000)}</span>
              </label>
              <label 
                className={`flex items-center justify-between gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  shippingMethod === 'express' ? 'border-[#4b2e1e] bg-[#f7f0e8]' : 'border-gray-300'
                }`}
                onClick={() => setShippingMethod('express')}
              >
                <div>
                  <p className="font-semibold">Express Shipping</p>
                  <p className="text-sm text-gray-600">Delivery in 2-3 business days</p>
                </div>
                <span className="font-bold text-[#4b2e1e]">{formatPrice(3500)}</span>
              </label>
            </div>
            <button
              onClick={() => setShowShippingModal(false)}
              className="w-full bg-[#4b2e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#3c2416] transition-colors"
            >
              Confirm
            </button>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-slideUp">
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
        </div>
      )}

      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
