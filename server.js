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
app.post('/api/github', async (req, res) => {  
  const githubResponse = await fetch(githubURL)
  const githubJSON = await githubResponse.json()

  const githubArray = githubJSON.map(issue => {
    return {
      url: issue.url,
      number: issue.number,
      title: issue.title,
      openedBy: issue.user.login,
      labels: issue.labels.map(label => label.name),
      openedOn: issue.created_at
    }
  })

  res.json(githubArray)
})

module.exports = app