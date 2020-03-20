const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json('Hello')
})

app.post('/', (req, res) => {
  res.json('Hello Slack')
})

module.exports = app