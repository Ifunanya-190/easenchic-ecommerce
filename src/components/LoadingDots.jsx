import React from 'react';

const LoadingDots = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-[#4b2e1e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-[#4b2e1e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-[#4b2e1e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        <div className="w-3 h-3 bg-[#4b2e1e] rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingDots;
