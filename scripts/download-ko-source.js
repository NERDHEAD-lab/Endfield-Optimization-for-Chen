const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadNamuKo() {
    const url = 'https://namu.wiki/w/%EB%AA%85%EC%9D%BC%EB%B0%A9%EC%A3%BC:%20%EC%97%94%EB%93%9C%ED%95%84%EB%93%9C/%EC%9E%A5%EB%B9%84';
    const filePath = path.join(__dirname, 'temp_source', 'namu_ko.html');

    try {
        console.log(`Downloading full HTML from ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        fs.writeFileSync(filePath, response.data);
        console.log(`Successfully saved full page to ${filePath} (${(response.data.length / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
        console.error('Error downloading Namu Wiki:', error.message);
    }
}

downloadNamuKo();
