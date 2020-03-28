const express = require('express')
const fetch = require('node-fetch')

const app = express()

const GITHUB_URL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Easy'

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

app.post('/api/github', async (req, res) => {  
  const responseURL = req.body.response_url

  res.sendStatus(200).send()

  const githubResponse = await fetch(GITHUB_URL)
  const githubJSON = await githubResponse.json()

  const issuesArray = githubJSON.reduce(
    (accumulator, issue) => {
      const issueURL = 'https://' + issue.url.slice(12, 23) + issue.url.slice(29)

      accumulator.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `#${issue.number} - <${issueURL}|*${issue.title}*>`
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
  
  const BLOCK_COUNT = 45
  const slackMessages = groupIssuesIntoMessages(issuesArray, BLOCK_COUNT)

  slackMessages.map(message => {
    fetch(responseURL, {
      method: 'post',
      body: JSON.stringify(message),
      headers: {'Content-Type': 'application/json'}
    })
  })
})

module.exports = app