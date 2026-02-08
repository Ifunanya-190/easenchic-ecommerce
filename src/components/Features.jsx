import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: Truck,
      title: 'Free Shipping',
      description: 'On all orders over ₦50,000. Fast delivery to your doorstep.',
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: '100% Authentic',
      description: 'All products are authentic and guaranteed. No counterfeit items.',
    },
    {
      id: 3,
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Not satisfied? Easy returns and refunds within 30 days.',
    },
    {
      id: 4,
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our customer service team is always ready to help you.',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f3e9df] rounded-full mb-4">
                  <Icon size={32} className="text-[#4b2e1e]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
