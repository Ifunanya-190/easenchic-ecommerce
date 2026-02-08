import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart, deletingItemId, isClearingCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
      navigate('/checkout');
    }, 500);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-white shadow-xl z-50 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="bg-[#4b2e1e] text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="hover:bg-[#3c2416] p-1 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 text-center">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-[#4b2e1e] font-bold text-sm mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={deletingItemId === item.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {deletingItemId === item.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-right mt-2 text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Subtotal:</span>
              <span className="text-[#4b2e1e]">{formatPrice(getTotalPrice())}</span>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#4b2e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#3c2416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Processing...</span>
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full border border-[#4b2e1e] text-[#4b2e1e] py-3 rounded-lg font-semibold hover:bg-[#f7f0e8] transition-colors"
            >
              Continue Shopping
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              disabled={isClearingCart}
              className="w-full text-red-600 py-2 text-sm hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isClearingCart ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Clearing...</span>
                </>
              ) : (
                'Clear Cart'
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CartModal;
