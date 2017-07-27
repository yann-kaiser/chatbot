'use strict'

let moment = require('moment')
let Wit = require('node-wit').Wit
let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')

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
    console.log(request)
    console.log(response)
    console.log(response.text)
    messages.push({ sender: 'robot', text: response.text })
  },
  getTime ({ context, entities }) {
    context.time = moment().format('HH:mm:ss')
    return context
  },
  getWeather ({ context, entities }) {
    return new Promise(function (resolve, reject) {
      let loc = entities.location ? entities.location.value : 'Paris'

      return callWeatherAPI(loc, (weather) => {
        context.weather = weather
        if (entities.location) {
          context.location = entities.location.value
        }
        return resolve(context)
      })
    })
  }
}

// @Flow
let callWeatherAPI = (location /* : string */, callback /* : (weather: string) */) => {
  location = encodeURI(location)

  var URL = 'http://api.openweathermap.org/data/2.5/weather?'
  URL += 'q=' + location
  URL += '&APPID=30248b03d4b8067fcbee8cf67702affd'

  request(URL, (error, response, body) => {
    if (error) {
      return
    }
    body = JSON.parse(body)
    var wth = body.weather[0].main.toLowerCase()

    return callback(getWeatherDesc(wth))
  })
}

const client = new Wit({ accessToken, actions })

const weatherMap = {
  'rain': 'raining',
  'clouds': 'cloudy',
  'sunny': 'sunny',
  'haze': 'hazy'
}

let getWeatherDesc = (wth) => {
  return weatherMap[wth] ? weatherMap[wth] : wth
}

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
