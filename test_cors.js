const url = 'https://luma-cosmetics.onrender.com/api/products';
fetch(url, {
  headers: {
    'Origin': 'https://luma-cosmetics-shop.vercel.app'
  }
}).then(async res => {
  console.log('Status:', res.status);
  console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
  console.log('Access-Control-Allow-Credentials:', res.headers.get('access-control-allow-credentials'));
}).catch(err => {
  console.error('Fetch error:', err);
});
