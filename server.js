const express = require('express')
const fetch = require('node-fetch')

const app = express()

const githubURL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Easy'

app.use(express.json())

// Sample Route
app.post('/api/sample', (req, res) => {
  res.json('Hello Slack')
})

// Github Route
app.post('/api/github', (req, res) => {
  fetch(githubURL)
    .then(labels => labels.json())
    .then(json => res.json(json))
})

app.post('/api/github', async (req, res) => {  
  const githubResponse = await fetch(githubURL)
  const githubJSON = await githubResponse.json()

  res.json(githubJSON)
})

module.exports = app