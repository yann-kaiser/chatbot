let request = require('request')

module.exports.callWeatherAPI = (location /* : string */) /* : string */ => {
  location = encodeURI(location)

  var URL = 'http://api.openweathermap.org/data/2.5/weather?'
  URL += 'q=' + location
  URL += '&APPID=30248b03d4b8067fcbee8cf67702affd'

  return request(URL, (error, response, body) => {
    if (error) {
      return null
    }
    body = JSON.parse(body)
    var wth = body.weather[0].main.toLowerCase()

    return module.exports.getWeatherDesc(wth)
  })
}

module.exports.callWeatherAPICallback = (location /* : string */, callback /* : (weather : string) */) => {
  let loc = encodeURI(location)
  var URL = 'http://api.openweathermap.org/data/2.5/weather?'
  URL += 'q=' + loc
  URL += '&APPID=30248b03d4b8067fcbee8cf67702affd'

  return request(URL, (error, response, body) => {
    if (error) {
      return null
    }
    body = JSON.parse(body)
    console.log(body)
    var wth = body.weather[0].main.toLowerCase()
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
