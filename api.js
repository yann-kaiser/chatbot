let request = require('request')

module.exports.callWeatherAPI = (location /* : string */) /* : string */ => {
  let loc = encodeURI(location)
  var URL = 'http://api.openweathermap.org/data/2.5/weather?'
  URL += 'q=' + loc
  URL += '&APPID=30248b03d4b8067fcbee8cf67702affd'

  return request(URL, (error, response, body) => {
    body = JSON.parse(body)
    let weather = body.weather
    if (!weather) {
      return null
    }
    var wth = weather[0].main.toLowerCase()

    return module.exports.getWeatherDesc(wth)
  })
}

module.exports.callWeatherAPICallback = (location /* : string */, callback /* : (weather : string) */) => {
  let loc = encodeURI(location)
  var URL = 'http://api.openweathermap.org/data/2.5/weather?'
  URL += 'q=' + loc
  URL += '&APPID=30248b03d4b8067fcbee8cf67702affd'
  return request(URL, (error, response, body) => {
    body = JSON.parse(body)

    let weather = body.weather
    if (!weather) {
      return callback(null)
    }
    let wth = weather[0].main.toLowerCase()
    return callback(module.exports.getWeatherDesc(wth))
  })
}

const weatherMap = {
  'rain': 'raining',
  'clouds': 'cloudy',
  'sunny': 'sunny',
  'haze': 'hazy'
}

module.exports.getWeatherDesc = (wth) => {
  return weatherMap[wth] ? weatherMap[wth] : wth
}
