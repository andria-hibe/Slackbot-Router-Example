const express = require('express')

const sample = require('./routes/sample')

const app = express()

app.use(express.json())

app.use('/', sample)

module.exports = app