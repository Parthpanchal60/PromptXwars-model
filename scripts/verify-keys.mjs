/**
 * Google Cloud API Key Live Diagnostics Script
 * Usage: node scripts/verify-keys.mjs [API_KEY]
 */

const key =
  process.argv[2] ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.VITE_GOOGLE_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.VITE_MAPS_API_KEY;

if (!key) {
  console.log('\n❌ No API Key provided to test.');
  console.log('Usage: node scripts/verify-keys.mjs <YOUR_GOOGLE_API_KEY>\n');
  process.exit(1);
}

console.log(`\n🔍 Testing Google Cloud & Gemini API Key: ${key.slice(0, 8)}••••••••\n`);

async function testServices() {
  // 1. Test Google Gemini Generative Language API
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping' }] }] }),
    });
    const data = await res.json();
    if (data.candidates && data.candidates.length > 0) {
      console.log('🌟 Google Gemini 3.6 Flash API: ACTIVE & FULLY AUTHORIZED! (Live AI Inference Working)');
    } else {
      console.log(`⚠️ Google Gemini API: ${data.error?.message || 'Unauthorized'}`);
    }
  } catch (err) {
    console.log('❌ Google Gemini API: Network failure', err.message);
  }
  // 1. Test Google Maps Geocoding API
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=San+Francisco&key=${key}`);
    const data = await res.json();
    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
      console.log('✅ Google Maps API: Active and Authorized!');
    } else {
      console.log(`⚠️ Google Maps API: ${data.status} - ${data.error_message || 'Check Maps API enablement in GCP Console'}`);
    }
  } catch (err) {
    console.log('❌ Google Maps API: Network failure', err.message);
  }

  // 2. Test Google Cloud Vision API
  try {
    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [] }),
    });
    const data = await res.json();
    if (res.status === 200 || (data.error && data.error.message.includes('empty request'))) {
      console.log('✅ Google Cloud Vision API: Active and Authorized!');
    } else {
      console.log(`⚠️ Google Cloud Vision API: HTTP ${res.status} - ${data.error?.message || 'Access Denied'}`);
    }
  } catch (err) {
    console.log('❌ Google Cloud Vision API: Network failure', err.message);
  }

  // 3. Test Google Sheets API
  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/SAMPLE_ID?key=${key}`);
    const data = await res.json();
    if (res.status === 404 || res.status === 200) {
      console.log('✅ Google Sheets API: Active and Key Authorized!');
    } else {
      console.log(`⚠️ Google Sheets API: HTTP ${res.status} - ${data.error?.message || 'Check Sheets API enablement'}`);
    }
  } catch (err) {
    console.log('❌ Google Sheets API: Network failure', err.message);
  }

  // 4. Test Firebase Identity Toolkit
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ continueUri: 'http://localhost' }),
    });
    const data = await res.json();
    if (res.status === 200 || (data.error && !data.error.message.includes('API_KEY_INVALID'))) {
      console.log('✅ Firebase Identity API: Active and Authorized!');
    } else {
      console.log(`⚠️ Firebase Identity API: HTTP ${res.status} - ${data.error?.message || 'Invalid Key'}`);
    }
  } catch (err) {
    console.log('❌ Firebase Identity API: Network failure', err.message);
  }

  console.log('\nAudit complete.\n');
}

testServices();
