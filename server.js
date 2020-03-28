const express = require('express')
const fetch = require('node-fetch')

const app = express()

const GITHUB_URL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Hard'

app.use(express.urlencoded({ extended: true }))

function groupIssuesIntoMessages (array, size) {
  const blocksArray = []

  for (let i = 0; i < array.length; i++) {
    const lastBlock = blocksArray[blocksArray.length - 1]
    
    if (!lastBlock || lastBlock.length === size) {
      blocksArray.push([array[i]])
    } else {
      lastBlock.push(array[i])
    }
  }
  return blocksArray.map(block => {
    return {
      blocks: block
    }
  })
}

// Route for all open issues with Difficulty:Hard label right now - need to be Easy
app.post('/api/github', async (req, res) => {  
  const responseURL = req.body.response_url

  const githubResponse = await fetch(GITHUB_URL)
  const githubJSON = await githubResponse.json()

  const issuesArray = githubJSON.reduce(
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
          type: "divider"
        }
      )
      return accumulator
    }, []
  )
  
  const BLOCK_COUNT = 9
  const slackMessages = groupIssuesIntoMessages(issuesArray, BLOCK_COUNT)

  const firstMessage = slackMessages[0]
  res.json(firstMessage)

  slackMessages.slice(1).map(message => {
    fetch(responseURL, {
      method: 'post',
      body: JSON.stringify(message),
      headers: {'Content-Type': 'application/json'}
    })
  })
})

module.exports = app