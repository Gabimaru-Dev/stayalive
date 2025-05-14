const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const SELF_URL = 'https://stayalive.onrender.com'; // Replace with your actual Render URL

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML file (not from public!)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API to add a new URL to keep alive
app.post('/add-url', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  let data = [];
  try {
    data = JSON.parse(fs.readFileSync('urls.json'));
  } catch {
    data = [];
  }

  if (!data.includes(url)) {
    data.push(url);
    fs.writeFileSync('urls.json', JSON.stringify(data, null, 2));
  }

  res.json({ message: 'URL added successfully' });
});

// Self-ping + keep other URLs alive
setInterval(() => {
  // Self-ping
  fetch(SELF_URL).then(() => console.log('[+] Self pinged')).catch(() => {});

  // Ping other URLs
  let urls = [];
  try {
    urls = JSON.parse(fs.readFileSync('urls.json'));
  } catch {
    urls = [];
  }

  urls.forEach((url) => {
    fetch(url)
      .then(() => console.log(`[+] Pinged: ${url}`))
      .catch(() => console.log(`[-] Failed to ping: ${url}`));
  });
}, 1000 * 60 * 5); // every 5 minutes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 