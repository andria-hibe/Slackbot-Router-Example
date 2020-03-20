const express = require('express')
const fetch = require('node-fetch')

const app = express()

const apiURL = 'https://api.github.com/repos/hotosm/tasking-manager/labels'

fetch(apiURL)
    .then(res => res.json())
    .then(json => { return json })

module.exports = app