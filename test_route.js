const https = require('https');
https.get('https://luma-cosmetics-shop.vercel.app/shop', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
