// AI Chat Service - Smart Responses (fully functional)

let GEMINI_API_KEY = 'AIzaSyCRHMaTSrxY-ZrtCKgfggKemqYGPnNykHs'; // Smart responses handle everything - API optional
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Fallback to our smart response system if no API key
import { getSmartResponse } from './chatResponses';

// Store for business context - will be dynamically updated with user's currency
const getBUSINESS_CONTEXT = (currencyInfo) => `
You are a friendly customer service representative for Fabulous Chic, a premium bag and accessories store.

IMPORTANT: The customer has selected ${currencyInfo.country} (${currencyInfo.code}) as their currency.
ALL prices must be shown in ${currencyInfo.symbol} (${currencyInfo.code}).

Our products include:
- The Luxe Collection: Premium bags ranging from ₦48,000 to ₦56,000
- The Monochrome Bags: Classic styles from ₦6,800 to ₦7,500
- Charms: Decorative bag accessories from ₦6,500 to ₦8,500 (Cherry Charms is ₦8,500)
- Urban Chic Collection: Modern trendy bags from ₦8,000 to ₦9,500

Key business information:
- We ship across Nigeria, Ghana, and internationally
- Standard delivery: 3-5 days (₦2,000), Express: 1-2 days (₦3,500)
- 7-day return policy on unused items
- We accept cards, bank transfers, and mobile money
- All products are premium quality leather with 2-year warranty
- Typical bag dimensions: 35 × 25 × 15 cm

Contact Information:
- Phone: +2349025781638
- Email: ifunanyaezeogu@gamil.com
- Location: Lagos Mainland, Lagos, Nigeria

Important Instructions:
- ALWAYS convert prices to ${currencyInfo.code} (multiply NGN price by ${currencyInfo.rate})
- Show prices in ${currencyInfo.symbol} format
- Do calculations when asked (e.g., "5 bags at ${currencyInfo.symbol}8,500 each = ${currencyInfo.symbol}42,500")
- Provide contact info when asked for phone, email, or how to reach us
- Recognize city names (Lagos, Accra, etc.) and confirm delivery availability
- Be specific about product names when mentioned (like Cherry Charms)
- Keep responses concise (2-3 sentences max) but always be accurate
- Always sound natural and vary your language
`;

/**
 * Get AI response using Gemini API or fallback to smart responses
 * @param {string} userMessage - The user's message
 * @param {Array} chatHistory - Previous chat messages for context
 * @param {Object} currencyInfo - Current currency information {symbol, code, country}
 * @returns {Promise<string>} - AI generated response
 */
export const getAIResponse = async (userMessage, chatHistory = [], currencyInfo = { symbol: '₦', code: 'NGN', country: 'Nigeria', rate: 1 }) => {
  // Log currency info for debugging
  console.log('AI Service received currency:', currencyInfo);
  
  // If no API key is set, use our smart response system
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    console.log('No API key - using smart responses with currency:', currencyInfo);
    return getSmartResponse(userMessage.toLowerCase(), currencyInfo);
  }

  console.log('Attempting Gemini API call with key:', GEMINI_API_KEY.substring(0, 10) + '...');

  try {
    // Prepare conversation history for Gemini
    const conversationContext = chatHistory
      .slice(-6) // Only last 6 messages for context
      .filter(msg => !msg.isTyping) // Remove typing indicators
      .map(msg => `${msg.sender === 'user' ? 'Customer' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const prompt = `${getBUSINESS_CONTEXT(currencyInfo)}\n\nPrevious conversation:\n${conversationContext}\n\nCustomer: ${userMessage}\n\nAssistant:`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 150,
          topP: 0.95,
          topK: 40
        }
      })
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      console.log('Falling back to smart responses with currency:', currencyInfo);
      // Fallback to smart responses on error
      return getSmartResponse(userMessage.toLowerCase(), currencyInfo);
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiResponse) {
      console.log('Got AI response:', aiResponse);
      return aiResponse.trim();
    }

    // Fallback if response is empty
    console.log('Empty response - falling back to smart responses');
    return getSmartResponse(userMessage.toLowerCase(), currencyInfo);

  } catch (error) {
    console.error('AI Chat error:', error);
    console.log('Falling back to smart responses');
    // Always fallback to smart responses on error
    return getSmartResponse(userMessage.toLowerCase(), currencyInfo);
  }
};

/**
 * Set the Gemini API key dynamically
 * @param {string} apiKey - Your Gemini API key
 */
export const setGeminiApiKey = (apiKey) => {
  GEMINI_API_KEY = apiKey;
};

/**
 * Check if AI API is configured
 * @returns {boolean} - True if API key is set
 */
export const isAIConfigured = () => {
  return GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '';
};
