const express = require('express')

const sample = require('./routes/sample')

const server = express()

server.use(express.json())

server.use('/api/v1/sample', users)

module.exports = server