const https = require('https');

https.get('https://nodejs.org/dist/latest-v18.x/docs/api/https.html#httpscreateserveroptions-requestlistener', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});