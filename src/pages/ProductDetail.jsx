import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../data/products.js';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../components/ToastProvider.jsx';
import { Search, ShoppingCart, User, ChevronDown, LogOut, X } from 'lucide-react';
import CartModal from '../components/CartModal';
import Logo from '../components/Logo';
import CountryFlag from '../components/CountryFlag';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart, getTotalItems } = useCart();
  const { formatPrice, selectedCurrency, getCurrencyInfo } = useCurrency();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const email = sessionStorage.getItem('easenchic_email') || '';
  const isLoggedIn = !!email;
  const savedFirstName = sessionStorage.getItem('easenchic_firstName') || '';
  const savedLastName = sessionStorage.getItem('easenchic_lastName') || '';
  const displayFirstName = savedFirstName || (email ? email.split('@')[0].split('.')[0] : '');
  const firstNameCapitalized = displayFirstName.charAt(0).toUpperCase() + displayFirstName.slice(1);
  const displayName = savedLastName ? `${firstNameCapitalized} ${savedLastName}` : firstNameCapitalized;

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

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-gray-700">Product not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#4b2e1e] text-white rounded">Go Home</button>
      </div>
    );
  }

  const maxQuantity = product.stockQuantity || 0;

  const handleAdd = () => {
    if (product.hasOptions && (!color || !size)) {
      showToast('Select color and size', 'error');
      return;
    }
    if (quantity > maxQuantity) {
      showToast(`Only ${maxQuantity} items available`, 'error');
      return;
    }
    addToCart({ ...product, quantity });
    showToast('Added to cart', 'success');
  };

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-white">
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
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
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

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span className="cursor-pointer hover:text-gray-700" onClick={() => navigate('/')}>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden sticky top-20">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover aspect-square" />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-4">The Luxe Collection</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
              <span className="text-gray-600 text-sm">( 0 ratings )</span>
            </div>

            {/* Stock Status */}
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.inStock ? 'In Stock' : 'OUT OF STOCK!'}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                    <span className="text-lg font-bold text-red-600">-{discount}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Options */}
            {product.hasOptions && (
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900">Select Color</label>
                  <div className="flex gap-3">
                    {['Cherry', 'Gold', 'Onyx'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`px-4 py-2 rounded border-2 font-medium transition ${
                          color === c
                            ? 'bg-[#4b2e1e] text-white border-[#4b2e1e]'
                            : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900">Select Size</label>
                  <div className="flex gap-3">
                    {['S', 'M', 'L'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-5 py-2 rounded border-2 font-medium transition ${
                          size === s
                            ? 'bg-[#4b2e1e] text-white border-[#4b2e1e]'
                            : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3 text-gray-900">
                Quantity <span className="text-sm font-normal text-gray-500">({maxQuantity} available)</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-6 py-2 text-lg font-semibold border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity >= maxQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            {product.inStock && maxQuantity > 0 ? (
              <button
                onClick={handleAdd}
                className="w-full bg-[#4b2e1e] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#3c2416] transition mb-6"
              >
                Add to Cart
              </button>
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-lg font-bold text-lg mb-6 cursor-not-allowed">
                Out of Stock
              </button>
            )}

            {/* Share & Tags */}
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold text-gray-900">Share:</span>
                <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition" title="Share on Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition" title="Share on Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition" title="Share on WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Tag: </span>
                <span className="text-gray-600">{product.category}</span>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Product Details</h3>
              <p className="text-gray-700 leading-relaxed">
                Experience unparalleled comfort and elegance with {product.name}. Crafted with premium materials,
                this piece combines timeless design with modern luxury. Perfect for those who demand both style and quality.
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><strong>Material:</strong> Premium Leather</p>
                <p><strong>Dimensions:</strong> 35 × 25 × 15 cm</p>
                <p><strong>Weight:</strong> 850g</p>
                <p><strong>Warranty:</strong> 2 Years</p>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
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

export default ProductDetail;
