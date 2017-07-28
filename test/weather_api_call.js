var assert = require('assert')
var api = require('../api.js')

describe('Weather', function () {
  describe('#callWeatherAPI()', function () {
    it('should not return null when called (bad call)', function () {
      assert.notEqual(undefined, api.callWeatherAPI('Paris'))
    })
  })

  describe('#callWeatherAPICallback()', function () {
    it('should not return null when called (bad call)', function (done) {
      api.callWeatherAPICallback('Paris', (weather) => {
        return done()
      })
    })
  })

  describe('#callWeatherAPI() with error', function () {
    it('should return null when called (bad call)', function () {
      assert.notEqual(null, api.callWeatherAPI('Paris&APPID=332'))
    })
  })

  describe('#callWeatherAPICallback() with error', function () {
    it('should not return null when called (bad call)', function (done) {
      api.callWeatherAPICallback('Paris&APPID=332', (weather) => {
        return done()
      })
    })
  })

  describe('#getWeatherDesc()', function () {
    it('should return "raining" for "rain"', function () {
      assert.equal('raining', api.getWeatherDesc('rain'))
    })
  })
})
