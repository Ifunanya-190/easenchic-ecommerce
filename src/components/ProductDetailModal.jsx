import React, { useState } from 'react';
import { X, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!isOpen || !product) return null;

  const calculateDiscount = (price, oldPrice) => {
    if (!oldPrice) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const discount = calculateDiscount(product.price, product.oldPrice);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Reset and close
    setQuantity(1);
    onClose();
    // Show success message (optional)
    alert('Added to cart!');
  };

  const colors = ['Black', 'Brown', 'Gold', 'Silver'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-10 bg-white rounded-lg z-50 overflow-auto max-h-[90vh] animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} />
          </button>

          {/* Left: Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-96 md:h-auto md:sticky md:top-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">(245 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              Premium quality craftsmanship meets modern elegance. This piece is designed for those who appreciate luxury without compromise. Made with premium materials and attention to detail.
            </p>

            {/* Color Selection */}
            <div>
              <label className="block font-semibold mb-3">Color</label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? 'border-[#4b2e1e] bg-[#f7f0e8]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block font-semibold mb-3">Size</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-lg border-2 font-medium transition-all flex items-center justify-center ${
                      selectedSize === size
                        ? 'border-[#4b2e1e] bg-[#4b2e1e] text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold mb-3">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-medium border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                  product.inStock
                    ? 'bg-[#4b2e1e] hover:bg-[#3c2416] active:scale-95'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                    isFavorited
                      ? 'border-red-600 text-red-600 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Heart size={20} className="inline mr-2" />
                  Wishlist
                </button>
                <button className="flex-1 py-3 rounded-lg border-2 border-gray-300 font-semibold hover:border-gray-400 transition-all">
                  <Share2 size={20} className="inline mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold mb-4">Product Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Premium Quality Materials</li>
                <li>✓ Handcrafted Design</li>
                <li>✓ Lifetime Warranty</li>
                <li>✓ Free Shipping on Orders Over ₦50,000</li>
                <li>✓ 30-Day Money Back Guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductDetailModal;
