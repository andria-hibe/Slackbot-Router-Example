const express = require('express')
const server = express()

server.post('/', (req, res) => {
  res.send('Hello Slack')
})

module.exports = server