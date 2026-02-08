# How to Activate Your Gemini API Key

## Why It's Not Working
The 404 error means the API isn't enabled in your Google Cloud project yet.

## Steps to Activate:

### 1. Go to Google AI Studio
Visit: https://aistudio.google.com/app/apikey

### 2. Create/Select Project
- If you see "Create API key", click it
- Choose "Create API key in new project" (easiest option)
- Wait for the key to be generated

### 3. Enable the API
- Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- Make sure you're in the same project
- Click the blue "Enable" button
- Wait 1-2 minutes for activation

### 4. Test It
- Refresh your website (Ctrl+Shift+R)
- Send a message in WhatsApp chat
- Check browser console (F12) - should see "Got AI response:" instead of 404

### 5. Verify Your Key
Your current key: `AIzaSyBFP4LsCCtcbbAScrfC8tKOruzhvNzNhXs`
- Make sure it's correct
- Check it's in the right Google Cloud project

## If Still Not Working:

**Option 1: Create Fresh Key**
1. Delete current key at https://aistudio.google.com/app/apikey
2. Create brand new one
3. Replace it in `src/utils/aiChatService.js` line 4
4. Make sure API is enabled (step 3 above)

**Option 2: Use Smart Responses**
The current system works great for most questions! It just can't:
- Do math calculations
- Speak other languages
- Remember complex context

But it handles all your product questions perfectly!

## What Gemini API Gives You:
- 🧮 Calculations: "8 bags at ₦7k each = ₦56,000"
- 🌍 Languages: Responds in Spanish, French, etc.
- 🧠 Context: Remembers the whole conversation
- 💡 Smart: Understands complex questions
- 🎯 Specific: "Which bags are exactly ₦9,000? The Sophia and Olive Urban Chic bags!"

## Current Smart System:
✅ Answers product questions
✅ Gives pricing ranges
✅ Explains shipping & returns
✅ Never repeats exact same response
❌ Can't do math
❌ English only
❌ Limited context

---

**Need help?** Let me know if you want to stick with smart responses (good enough) or if you want to troubleshoot the API setup (more powerful)!
