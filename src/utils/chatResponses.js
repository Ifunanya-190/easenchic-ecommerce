export const getSmartResponse = (userMessageLower, currencyInfo = { symbol: '₦', code: 'NGN', country: 'Nigeria', rate: 1 }) => {
  // Debug log to check currency info
  console.log('Smart Response received currency:', currencyInfo);
  
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Helper to format prices in user's currency
  const formatPrice = (priceInNGN) => {
    const convertedPrice = Math.round(priceInNGN * currencyInfo.rate);
    return `${currencyInfo.symbol}${convertedPrice.toLocaleString()}`;
  };
  
  // Helper for price ranges
  const formatRange = (minNGN, maxNGN) => {
    return `${formatPrice(minNGN)}-${formatPrice(maxNGN)}`;
  };

  // CALCULATION SUPPORT - Extract numbers and do math
  const numberPattern = /\b(\d+(?:,\d{3})*(?:\.\d+)?)\b/g;
  const numbers = userMessageLower.match(numberPattern);
  const hasCalculation = numbers && numbers.length >= 2 && (userMessageLower.includes('x') || userMessageLower.includes('*') || userMessageLower.includes('buy') || userMessageLower.includes('total') || userMessageLower.includes('will that be'));
  
  if (hasCalculation) {
    // Extract the numbers (remove commas)
    const num1 = parseFloat(numbers[0].replace(/,/g, ''));
    const num2 = parseFloat(numbers[1].replace(/,/g, ''));
    const total = num1 * num2;
    const formattedTotal = formatPrice(total);
    return `Great choice! ${num1} bags at ${formatPrice(num2)} each = ${formattedTotal} total. Ready to add them to your cart? 🛍️`;
  }

  // CONTACT INFO REQUESTS
  if (userMessageLower.includes('contact') || userMessageLower.includes('email') || userMessageLower.includes('phone') || userMessageLower.includes('reach') || userMessageLower.includes('call')) {
    return getRandom([
      '📞 Phone: +2349025781638\n✉️ Email: ifunanyaezeogu@gamil.com\n\nFeel free to reach out anytime! How else can I help?',
      'Here\'s how to reach us:\n📞 +2349025781638\n✉️ ifunanyaezeogu@gamil.com\n\nWe\'re here for you! Any other questions?',
      'You can contact us at:\nPhone: +2349025781638\nEmail: ifunanyaezeogu@gamil.com\n\nWhat else would you like to know?'
    ]);
  }

  // SPECIFIC LOCATIONS (cities/states mentioned)
  const nigerianCities = ['lagos', 'abuja', 'port harcourt', 'kano', 'ibadan', 'enugu', 'kaduna'];
  const ghanaianCities = ['accra', 'kumasi', 'takoradi', 'tamale'];
  const mentionedCity = [...nigerianCities, ...ghanaianCities].find(city => userMessageLower.includes(city));
  
  if (mentionedCity && userMessageLower.length < 20) { // Only if it's a short message (likely just stating location)
    const capitalizedCity = mentionedCity.charAt(0).toUpperCase() + mentionedCity.slice(1);
    const isNigeria = nigerianCities.includes(mentionedCity);
    return getRandom([
      `Perfect! We deliver to ${capitalizedCity}! 📦 ${isNigeria ? 'Within Nigeria' : 'To Ghana'}: Standard (${formatPrice(2000)}, 3-5 days) or Express (${formatPrice(3500)}, 1-2 days). What would you like to order?`,
      `Great! ${capitalizedCity} is in our delivery zone! Shipping options: Standard ${formatPrice(2000)} (3-5 days) or Express ${formatPrice(3500)} (1-2 days). Ready to shop?`,
      `Nice! We ship to ${capitalizedCity} regularly! Choose standard delivery (${formatPrice(2000)}) or express (${formatPrice(3500)}). What catches your eye?`
    ]);
  }

  // List of countries we ship to (for detection)
  const countries = [
    'nigeria', 'ghana', 'kenya', 'south africa', 'egypt', 'ethiopia', 
    'canada', 'usa', 'united states', 'america', 'uk', 'united kingdom', 
    'england', 'france', 'germany', 'italy', 'spain', 'netherlands', 'belgium',
    'australia', 'brazil', 'mexico', 'argentina', 'china', 'india', 'japan',
    'saudi arabia', 'uae', 'dubai', 'algeria', 'angola', 'cameroon', 'congo',
    'tanzania', 'uganda', 'zimbabwe', 'zambia', 'botswana', 'morocco', 'tunisia'
  ];

  // Check if user is asking about shipping to a specific country
  const mentionedCountry = countries.find(country => userMessageLower.includes(country));
  
  // Country-specific shipping inquiry
  if (mentionedCountry) {
    const capitalizedCountry = mentionedCountry.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return getRandom([
      `Yes, we ship to ${capitalizedCountry}! 🌍 Standard delivery (3-5 days): ${formatPrice(2000)}, Express (1-2 days): ${formatPrice(3500)}. Ready to place your order?`,
      `Absolutely! We deliver to ${capitalizedCountry}. Choose standard shipping (${formatPrice(2000)}, 3-5 days) or express (${formatPrice(3500)}, 1-2 days). What would you prefer?`,
      `Great news! ${capitalizedCountry} is in our delivery zone! 📦 Standard: ${formatPrice(2000)} (3-5 days) or Express: ${formatPrice(3500)} (1-2 days). Which works for you?`
    ]);
  }

  // Price inquiries
  if (userMessageLower.includes('price') || userMessageLower.includes('cost') || userMessageLower.includes('how much')) {
    return getRandom([
      `Our bags typically range from ${formatRange(5000, 56000)}. What style are you looking for?`,
      `Prices vary by collection! Most pieces are between ${formatRange(5000, 56000)}. Need help finding something in your budget?`,
      `Great question! Our collection starts at ${formatPrice(5000)} and goes up to ${formatPrice(56000)} for premium pieces. Which collection interests you?`
    ]);
  }

  // Delivery/Shipping
  if (userMessageLower.includes('delivery') || userMessageLower.includes('shipping') || userMessageLower.includes('ship')) {
    return getRandom([
      `We ship worldwide! 🌍 Standard (3-5 days): ${formatPrice(2000)}, Express (1-2 days): ${formatPrice(3500)}. Which country should we deliver to?`,
      `International shipping available! Choose standard delivery (${formatPrice(2000)}, 3-5 days) or express (${formatPrice(3500)}, 1-2 days). What's your location?`,
      `We deliver globally! Standard shipping: ${formatPrice(2000)} (3-5 days), Express: ${formatPrice(3500)} (1-2 days). Where are you ordering from?`
    ]);
  }

  // Order tracking
  if (userMessageLower.includes('order') || userMessageLower.includes('track')) {
    return getRandom([
      'Track your order anytime in My Account > My Orders. Need help with a specific order number?',
      'All your orders are in the My Account section! Having trouble finding something?',
      'Head to My Account > My Orders to see all your order details and tracking info. Can I help with anything specific?'
    ]);
  }

  // Payment
  if (userMessageLower.includes('payment') || userMessageLower.includes('pay')) {
    return getRandom([
      'We accept cards, bank transfers, and mobile money - all secure! Any specific payment method you prefer?',
      'Payment is super secure! We take cards, transfers, or mobile money. What works best for you?',
      'Multiple payment options available: cards, bank transfers, mobile money. All processed securely at checkout!'
    ]);
  }

  // Returns/Refunds
  if (userMessageLower.includes('return') || userMessageLower.includes('refund') || userMessageLower.includes('exchange')) {
    return getRandom([
      '7-day returns on unused items! Just contact us with your order number. Need to start a return?',
      'We offer easy returns within 7 days for items in original packaging. Want to process a return?',
      'Returns are simple! 7 days for unused items. Have an order you need to return?'
    ]);
  }

  // Specific collections mentioned
  if (userMessageLower.includes('luxe')) {
    return getRandom([
      `The Luxe Collection features our premium bags from ${formatRange(48000, 56000)}. These are our most elegant pieces!`,
      `Luxe is our premium line - sophisticated, high-quality leather bags. Prices range from ${formatRange(48000, 56000)}. Want to see them?`,
      `Our Luxe Collection is perfect for making a statement! Premium leather, ${formatRange(48000, 56000)}. Interested?`
    ]);
  }

  // SPECIFIC PRODUCT NAMES
  if (userMessageLower.includes('cherry charm') || userMessageLower.includes('cherry bag')) {
    return `The Cherry Charms bag is ${formatPrice(8500)}! 🍒 It's a cute charm accessory in our Charms collection. Want to add it to your cart?`;
  }

  if (userMessageLower.includes('charm')) {
    return getRandom([
      `Charms are bag accessories from ${formatRange(6500, 8500)} - perfect for personalizing your bag! Want to see our charm collection?`,
      `Our Charms add personality to any bag! They range from ${formatRange(6500, 8500)}. Browse the Charms category to see them!`,
      `Charms collection has decorative accessories for your bags, ${formatRange(6500, 8500)}. They're all displayed as bags in the category!`
    ]);
  }

  if (userMessageLower.includes('monochrome') || userMessageLower.includes('classic')) {
    return getRandom([
      `The Monochrome Bags are classic styles from ${formatRange(6800, 7500)} - timeless and versatile!`,
      `Monochrome is our classic line! Simple, elegant designs from ${formatRange(6800, 7500)}. Perfect everyday bags!`,
      `Looking for something classic? Monochrome Bags are ${formatRange(6800, 7500)}. Timeless style that goes with everything!`
    ]);
  }

  if (userMessageLower.includes('urban') || userMessageLower.includes('chic')) {
    return getRandom([
      `Urban Chic Collection has trendy modern bags from ${formatRange(8000, 9500)} - perfect for the fashion-forward!`,
      `Urban Chic is all about modern style! ${formatRange(8000, 9500)} for bags that make a statement. Want to browse?`,
      `The Urban Chic Collection features contemporary designs, ${formatRange(8000, 9500)}. Great for everyday trendy looks!`
    ]);
  }

  // Asking about specific products
  if (userMessageLower.includes('ivory') || userMessageLower.includes('where is')) {
    return getRandom([
      `The Ivory Classic is in our Monochrome Bags collection for ${formatPrice(6800)} - a beautiful, versatile piece!`,
      `Ivory Classic! That's ${formatPrice(6800)} in the Monochrome collection. Classic color, timeless style!`,
      `Found it! The Ivory Classic bag is ${formatPrice(6800)} - check the Monochrome Bags category!`
    ]);
  }

  // General product/collection inquiries
  if (userMessageLower.includes('bag') || userMessageLower.includes('product') || userMessageLower.includes('collection') || userMessageLower.includes('have') || userMessageLower.includes('show') || userMessageLower.includes('browse')) {
    return getRandom([
      `We have 4 collections: The Luxe Collection (${formatRange(48000, 56000)}), Monochrome Bags (${formatRange(6800, 7500)}), Charms (${formatRange(6500, 8500)}), and Urban Chic (${formatRange(8000, 9500)}). Which one catches your eye?`,
      'Our collections: Luxe (premium elegance), Monochrome (classic timeless), Charms (accessories), Urban Chic (trendy modern). What\'s your style?',
      'Check out our collections! Luxe for premium, Monochrome for classic, Charms for accessories, Urban Chic for trendy. Which interests you?',
      'We\'ve got The Luxe Collection, Monochrome Bags, Charms, and Urban Chic Collection. Each has unique styles - what are you looking for?'
    ]);
  }

  // Greetings
  if (userMessageLower.match(/^(hello|hi|hey|hii?|h)$/)) {
    return getRandom([
      'Hey there! 👜 Welcome to Fabulous Chic! What can I help you find today?',
      'Hi! So glad you\'re here! Looking for something specific?',
      'Hello! 👋 Ready to find your perfect bag? How can I help?'
    ]);
  }

  // Positive responses (yes, okay, etc)
  if (userMessageLower.match(/^(yes|yeah|yep|sure|ok|okay|yea)$/)) {
    return getRandom([
      'Awesome! What would you like to know more about?',
      'Great! How can I help you further?',
      'Perfect! What else can I tell you?'
    ]);
  }

  // Negative responses
  if (userMessageLower.match(/^(no|nah|nope)$/)) {
    return getRandom([
      'No worries! What else can I help you with?',
      'That\'s okay! Is there something else you\'d like to know?',
      'All good! Anything else I can assist with?'
    ]);
  }

  // Another/different
  if (userMessageLower.includes('another') || userMessageLower.includes('different') || userMessageLower.includes('else') || userMessageLower.includes('other') || userMessageLower.includes('except')) {
    return getRandom([
      'Sure! We have The Luxe Collection, Monochrome Bags, Charms, and Urban Chic. Which would you like to explore?',
      'Absolutely! Check out all 4 collections: Luxe, Monochrome, Charms, or Urban Chic. What sounds interesting?',
      'Of course! Besides what we discussed, we have 3 other collections. Want to hear about them?'
    ]);
  }

  // More info requests
  if (userMessageLower.includes('more') || userMessageLower.includes('tell me') || userMessageLower.includes('info') || userMessageLower.includes('details') || userMessageLower.includes('know more') || userMessageLower.includes('about')) {
    return getRandom([
      'Happy to share more! What specifically would you like to know - collections, prices, shipping, or product details?',
      'I\'ve got all the details! Ask me about any collection, pricing, delivery options, or specific products!',
      'Sure thing! Want to know about our collections, prices, delivery, returns, or something specific?'
    ]);
  }

  // Thanks
  if (userMessageLower.includes('thank') || userMessageLower.includes('thanks')) {
    return getRandom([
      'You\'re so welcome! Need anything else? I\'m here to help! ✨',
      'Happy to help! Let me know if you have more questions! 😊',
      'Anytime! Feel free to ask if you need anything else!'
    ]);
  }

  // Size inquiries
  if (userMessageLower.includes('size') || userMessageLower.includes('dimension')) {
    return getRandom([
      'Most bags are around 35 × 25 × 15 cm. Check the product page for exact dimensions! Which bag are you interested in?',
      'Sizes vary by style! Typical handbags are 35 × 25 × 15 cm. Want details on a specific bag?',
      'Great question! Our standard handbags are approximately 35 × 25 × 15 cm. Looking at any particular style?'
    ]);
  }

  // Material/Quality
  if (userMessageLower.includes('material') || userMessageLower.includes('leather') || userMessageLower.includes('quality')) {
    return getRandom([
      'All premium quality leather with a 2-year craftsmanship warranty! Quality is our priority 👌',
      'We use only the finest leather and materials - backed by a 2-year warranty!',
      'Premium leather, top-notch quality, 2-year warranty. We don\'t compromise on excellence!'
    ]);
  }

  // Help/Support
  if (userMessageLower.includes('help') || userMessageLower.includes('support') || userMessageLower.includes('assist')) {
    return getRandom([
      'I can help with products, prices, shipping, orders, and more! What are you curious about?',
      'I\'m here to help with whatever you need - browsing collections, checking prices, tracking orders. What can I do for you?',
      'Happy to assist! Ask me about collections, pricing, delivery, returns - anything at all!'
    ]);
  }

  // Fallback for everything else - more conversational
  const baseResponse = getRandom([
    'I\'m here to help! Try asking about our collections (Luxe, Monochrome, Charms, Urban Chic), prices, shipping, or anything else!',
    'Want to know about our bags? Ask me about collections, prices, delivery, or specific products!',
    'I can tell you about all 4 collections, pricing, shipping options, returns, and more. What interests you?',
    'Let me help! Ask about The Luxe Collection, Monochrome Bags, Charms, Urban Chic, or delivery/pricing info!',
    'Need info? I know all about our collections, prices (₦5k-₦56k), shipping, and returns. What can I tell you?'
  ]);
  
  // Occasionally (30% chance) add email contact info
  if (Math.random() < 0.3) {
    return baseResponse + '\n\nIf you have more questions, please reach out to: ifunanyaezeogu@gamil.com';
  }
  
  return baseResponse;
};
