const express = require('express')
const fetch = require('node-fetch')

const app = express()

const githubURL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Hard'

app.use(express.urlencoded({ extended: true }))

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

  const slackMessages = slackBlocks(issuesArray, 9)

  const sendMessage = (message) => {
    return {
      blocks: message
    }
  }

  const firstMessage = sendMessage(slackMessages[0])
  res.json(firstMessage)

  Promise.all(slackMessages.slice(1).map(message => {
    const nextMessage = sendMessage(message)

    fetch(responseURL, {
      method: 'post',
      body: JSON.stringify(nextMessage),
      headers: {'Content-Type': 'application/json'}
    })
      .then(res => res.json())

    // fetch(responseURL, { method: 'POST', body: 'a=1' })
    //   .then(res => res.json(nextMessage))
    //   .then(json => console.log(json))
  }))
})

module.exports = app