// For front-end deploy!!!

//Install express server
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/dist/evm-proj'));

app.get('*', function(req,res) {
  // Replace the '/dist/<to_your_project_name>/index.html'
  res.sendFile(path.join(__dirname+ '/dist/evm-proj/index.html'));
});
// Start the app by listening on the default Heroku port
app.listen(port);

console.info (`Server is running on port ${port}`);