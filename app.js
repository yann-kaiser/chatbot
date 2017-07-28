'use strict'

let moment = require('moment')
let Wit = require('node-wit').Wit
let express = require('express')
let bodyParser = require('body-parser')
let api = require('./api')

let app = express()

let accessToken = 'XCP44A7EAHMRR4IVHHXEAPG3LHIUOEC5'
let sessionId = new Date().toISOString()

var context = {}
var messages = []

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

const actions = {
  send (request, response) {
    /* const { sessionId, context, entities } = request
    const { text, quickreplies } = response */
    messages.push({ sender: 'robot', text: response.text })
  },
  getTime ({ context, entities }) {
    context.time = moment().format('HH:mm:ss')
    return context
  },
  getWeather ({ context, entities }) {
    return new Promise(function (resolve, reject) {
      let loc = entities.location ? entities.location[0].value : 'Paris'

      return api.callWeatherAPICallback(loc, (weather) => {
        if (weather == null) {
          reject()
        }
        context.weather = weather

        if (entities.location) {
          context.location = entities.location[0].value
        }
        return resolve(context)
      })
    })
  }
}

const client = new Wit({ accessToken, actions })

app.get('/', function (req, res) {
  res.render('index', { messages: messages })
})

app.post('/', function (req, res) {
  messages.push({ sender: 'user', text: req.body.question })
  client.runActions(sessionId, req.body.question, context).then((ctx) => {
    context = ctx
    res.render('index', { messages: messages })
  })
})

app.listen(3000)
