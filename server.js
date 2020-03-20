const express = require('express')

const sample = require('./routes/sample')

const app = express()

app.use(express.json())

app.use('/api/sample', sample)

module.exports = app