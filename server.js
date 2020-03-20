const express = require('express')

const sample = require('./routes/sample')

const server = express()

// Middleware
server.use(express.json())

// Routes
server.use('/api/v1/sample', users)

module.exports = server