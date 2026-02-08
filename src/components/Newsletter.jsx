import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#4b2e1e] to-[#2f1f13] py-16 text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Mail size={48} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-4xl font-bold mb-4">Never Miss Out</h2>
        <p className="text-lg mb-8 text-[#f3e9df]">
          Subscribe to our newsletter for exclusive deals, style tips, and first access to new collections.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-white text-[#4b2e1e] rounded-lg font-semibold hover:bg-[#f7f0e8] transition-all duration-200 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        {isSubmitted && (
          <p className="mt-4 text-[#f3e9df] animate-fadeIn">
            ✓ Thanks for subscribing! Check your email for exclusive offers.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Newsletter;
