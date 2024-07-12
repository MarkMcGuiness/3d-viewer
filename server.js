const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Heroku or default to 3000

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example route to serve a homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
