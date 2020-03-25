const express = require('express')
const fetch = require('node-fetch')

const app = express()

const githubURL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Easy'

app.use(express.json())

app.post('/api/github', async (req, res) => {  
  const githubResponse = await fetch(githubURL)
  const githubJSON = await githubResponse.json()

  const githubSample = githubJSON.map(issue => {
    return {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${issue.number} - <${issue.url}|*${issue.title}*>`
          }
        },
        {
          type: "section",
          fields: issue.labels.map(label => {
            return {
              type: "plain_text",
              text: label.name
            }
          })
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Opened at ${issue.created_at} by user ${issue.user.login}`
            }
          ]
        },
        {
          type: "divider"
        }
      ]
    }
  })

  res.json(githubSample[0])
})

module.exports = app