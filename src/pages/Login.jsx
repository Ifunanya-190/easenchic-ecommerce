import React, { useState } from 'react';
import { useToast } from '../components/ToastProvider.jsx';
import { useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Search, ShoppingCart, User, ChevronDown, Phone, MapPin, Mail, X, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';

const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const sendOtp = async () => {
    if (!email) return;
    setIsSubmitting(true);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    sessionStorage.setItem('easenchic_otp', otp);
    sessionStorage.setItem('easenchic_email', email);

    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    try {
      if (publicKey && serviceId && templateId) {
        emailjs.init(publicKey);
        await emailjs.send(serviceId, templateId, {
          to_email: email,
          otp_code: otp,
          subject: 'Your easenchic OTP code',
        });
        showToast('OTP sent to your email', 'success');
      } else {
        // Fallback: no email provider configured.
        showToast(`OTP: ${otp}`, 'success', 10000);
        console.log('OTP Code:', otp);
      }
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to send OTP', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const stored = sessionStorage.getItem('easenchic_otp');
    if (stored && otpInput === stored) {
      showToast('Logged in successfully', 'success');
      sessionStorage.removeItem('easenchic_otp');
      navigate('/');
    } else {
      showToast('Invalid OTP. Try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <Logo />
            </div>

            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input 
                  type="search" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-transparent transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                  <Search size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block relative">
                <button 
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 36 24" fill="none">
                    <rect width="12" height="24" fill="#008751"/>
                    <rect x="12" width="12" height="24" fill="white"/>
                    <rect x="24" width="12" height="24" fill="#008751"/>
                  </svg>
                  <span className="text-sm font-medium">NGN</span>
                  <ChevronDown size={16} className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCurrencyOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
                    <button 
                      onClick={() => setIsCurrencyOpen(false)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 36 24" fill="none">
                        <rect width="12" height="24" fill="#008751"/>
                        <rect x="12" width="12" height="24" fill="white"/>
                        <rect x="24" width="12" height="24" fill="#008751"/>
                      </svg>
                      <span className="text-sm">NGN - Naira</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>

              <span className="hidden md:block text-sm font-medium text-[#4b2e1e]">
                Login
              </span>

              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>

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
              <form onSubmit={(e) => { e.preventDefault(); setIsMobileSearchOpen(false); navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }} className="relative">
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
                    <svg className="w-5 h-5" viewBox="0 0 36 24" fill="none">
                      <rect width="12" height="24" fill="#008751"/>
                      <rect x="12" width="12" height="24" fill="white"/>
                      <rect x="24" width="12" height="24" fill="#008751"/>
                    </svg>
                    <span className="font-medium">NGN</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Go to My Account to change</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    Go to Homepage
                  </button>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Login / Register</p>
                    <p className="text-xs text-green-600 mt-1">Enter your email below to continue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">LOGIN/REGISTER</h2>
          <p className="text-gray-600 mb-6">Enter your email to receive an OTP.</p>

          {!otpSent ? (
            <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-[#4b2e1e] placeholder:text-gray-400 bg-white text-gray-900"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4b2e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#3c2416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Get OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Enter OTP</label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                  placeholder="6-digit code"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-[#4b2e1e] placeholder:text-gray-400 tracking-widest bg-white text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#4b2e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#3c2416] transition-colors"
              >
                Verify OTP
              </button>
              <button type="button" onClick={sendOtp} className="w-full border border-[#4b2e1e] text-[#4b2e1e] py-3 rounded-lg font-semibold hover:bg-[#f7f0e8] transition-colors">
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">SIGN UP FOR DISCOUNTS & UPDATES</h3>
            <div className="flex max-w-md mx-auto gap-2">
              <input 
                type="email" 
                autoComplete="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4b2e1e] focus:border-[#4b2e1e]"
              />
              <button className="bg-[#4b2e1e] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#3c2416] transition-colors">
                Subscribe
              </button>
            </div>
          </div>

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

          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <a href="https://www.getbumpa.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              POWERED BY BUMPA
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
