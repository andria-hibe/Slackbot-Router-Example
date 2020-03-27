const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const app = express()

const githubURL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Hard'
const responseURL = 'https://hooks.slack.com/commands/T010DJXL4GM/1030203970213/jU4tbGu3wIRhXOVCQzPABpWz'

app.use(bodyParser.urlencoded())

// Route for all open issues with Difficulty:Hard label right now - need to be Easy
app.post('/api/github', async (req, res) => {  
  console.log(req.body)

  const githubResponse = await fetch(githubURL)
  const githubJSON = await githubResponse.json()

  const easyIssues = githubJSON.reduce(
    (accumulator, issue) => {
      accumulator.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `#${issue.number} - <${issue.url}|*${issue.title}*>`
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
      )
      return accumulator
    }, []
  )

  const slackBlocks = {
    blocks: easyIssues
  }

  res.json(slackBlocks)
})

module.exports = app