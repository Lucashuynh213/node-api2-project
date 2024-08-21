// implement your server here
// require your posts router and connect it here
const express = require('express');  // Import the Express module

const server = express();  // Initialize an Express application

server.use(express.json());  // Middleware to parse JSON request bodies

// Fallback route to handle undefined routes
server.use('*', (req, res) => {
    res.status(404).json({
        message: "not found"  // Send a 404 response with a JSON message
    });
});

module.exports = server;  // Export the server for use in other files