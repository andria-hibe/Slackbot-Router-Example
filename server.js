const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const app = express()

const githubURL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Hard'

app.use(bodyParser.urlencoded())

// Route for all open issues with Difficulty:Hard label right now - need to be Easy
app.post('/api/github', async (req, res) => {  
  const responseURL = req.body.response_url

  const githubResponse = await fetch(githubURL)
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


  function slackBlocks (array, size) {
    const blocksArray = []

    for (let i = 0; i < array.length; i++) {
      const lastBlock = blocksArray[blocksArray.length - 1]
      
      if (!lastBlock || lastBlock.length === size) {
        blocksArray.push([array[i]])
      } else {
        lastBlock.push(array[i])
      }
    }
    return blocksArray
  }

  const slackMessages = slackBlocks(issuesArray, 6)

  const firstMessage = {
    blocks: slackMessages[0]
  }

  res.json(firstMessage)
})

module.exports = app