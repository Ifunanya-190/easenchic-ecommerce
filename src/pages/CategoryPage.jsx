import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, ChevronLeft, ChevronRight, Phone, MapPin, Send, X, User, LogOut, Home, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../components/ToastProvider';
import CartModal from '../components/CartModal';
import Logo from '../components/Logo';
import CountryFlag from '../components/CountryFlag';
import { products as PRODUCTS } from '../data/products.js';
import heroLogoImage from '../assets/fabulous chic image.png';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems, addToCart } = useCart();
  const { formatPrice, selectedCurrency, getCurrencyInfo } = useCurrency();
  const { showToast } = useToast();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = React.useState(false);
  const [animateHero, setAnimateHero] = React.useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const productsPerPage = 8;

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
  };

  // Trigger animation on mount and when returning to category page
  React.useEffect(() => {
    setAnimateHero(false);
    const timer = setTimeout(() => setAnimateHero(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname, location.key]);

  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter(product => product.category === category);
  }, [category]);

  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return categoryProducts.slice(startIndex, startIndex + productsPerPage);
  }, [categoryProducts, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Coming soon! We\'ll notify you when this feature is available.', 'info');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
                  Go to My Account to change currency
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>

              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search size={20} />
              </button>

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

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link 
              to="/" 
              className="flex items-center gap-1 text-gray-600 hover:text-[#4b2e1e] transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-[#4b2e1e] font-medium">{category}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Blurred Logo and Category Name */}
      <section key={location.key} className="relative h-[400px] bg-white flex items-center justify-center overflow-hidden animate-slideDown">
        <div className="absolute inset-0">
          <img 
            src={heroLogoImage} 
            alt="fabulous chic" 
            className="w-full h-full object-cover blur-md opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#3d2817]" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}>
            {category}
          </h1>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {categoryProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">No products in this category</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#4b2e1e] text-white px-6 py-2 rounded-lg hover:bg-[#3c2416] transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} in {category}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <Link 
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-[#4b2e1e]">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <>
                          <span className="text-sm text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                          <span className="text-xs font-semibold text-red-600">
                            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    {product.inStock ? (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                          showToast('Added to cart', 'success');
                        }}
                        className="w-full py-2.5 rounded-lg font-medium transition-all duration-200 bg-[#4b2e1e] text-white hover:bg-[#3c2416] active:scale-95"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-2.5 rounded-lg font-medium bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
                          <path d="M13.1667 7.83334H3.83333C3.09695 7.83334 2.5 8.4303 2.5 9.16668V13.8333C2.5 14.5697 3.09695 15.1667 3.83333 15.1667H13.1667C13.903 15.1667 14.5 14.5697 14.5 13.8333V9.16668C14.5 8.4303 13.903 7.83334 13.1667 7.83334Z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M5.16675 7.83334V5.16668C5.16675 4.28262 5.51794 3.43478 6.14306 2.80965C6.76818 2.18453 7.61603 1.83334 8.50008 1.83334C9.38414 1.83334 10.232 2.18453 10.8571 2.80965C11.4822 3.43478 11.8334 4.28262 11.8334 5.16668V7.83334" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Newsletter */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">SIGN UP FOR DISCOUNTS & UPDATES</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto gap-2">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-[#4b2e1e]"
              />
              <button type="submit" className="bg-[#4b2e1e] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#3c2416] transition-colors">
                Subscribe
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-8 border-t border-gray-800 pt-8">
            <div>
              <h4 className="font-bold text-lg mb-4">CONTACT US</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  <span>+2349025781638</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  <span>ifunanyaezeogu@gamil.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span>Lagos Mainland, Lagos, Nigeria</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <a href="https://www.getbumpa.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              POWERED BY BUMPA
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isWhatsAppOpen && (
          <div className="mb-4 w-80 bg-white rounded-lg shadow-2xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-[#25D366] text-white p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                🛍️
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">fabulous chic</h4>
                <p className="text-xs text-green-100">Typically replies within 10 minutes</p>
              </div>
              <button 
                onClick={() => setIsWhatsAppOpen(false)}
                className="hover:bg-[#1ea952] p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-64 bg-[#e5ddd5] p-4 overflow-y-auto" style={{
              backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGD4z0AEYBxVOKpwWBQCADEkAgH0KbVOAAAAAElFTkSuQmCC")',
              backgroundRepeat: 'repeat'
            }}>
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                <p className="text-sm">Hi! 👋 How can we help you today?</p>
              </div>
            </div>

            {/* Input */}
            <div className="bg-gray-100 p-3 flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full focus:outline-none"
              />
              <button className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#1ea952] transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <button 
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ea952] transition-all duration-300 hover:scale-110 relative group"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            1
          </span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with us!
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

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
    </div>
  );
};

export default CategoryPage;
