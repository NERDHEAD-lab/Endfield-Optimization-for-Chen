const https = require('https');
const fs = require('fs');

https.get('https://static.skport.com/skport-fe-static/skport-wiki/main.db2eb5cc.js', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    fs.writeFileSync('scripts/temp_main.js', data);
    
    // Find URL endpoints
    const urls = data.match(/https?:\/\/[a-zA-Z0-9.\-_\/]+/g) || [];
    const uniqueUrls = [...new Set(urls)];
    
    // Find API paths
    const endpoints = data.match(/"\/api\/[a-zA-Z0-9_\-\/]+"/g) || [];
    const uniqueEndpoints = [...new Set(endpoints)];
    
    console.log("Found endpoints:", uniqueEndpoints.slice(0, 20));
    console.log("Found URls:", uniqueUrls.slice(0, 20));
  });
}).on('error', err => {
  console.error(err);
});
