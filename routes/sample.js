const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/', (req, res) => {
  res.send('Hello Slack')
})

module.exports = app