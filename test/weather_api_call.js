var assert = require('assert')
var api = require('../api.js')

describe ('Weather', function () {
  describe('#callWeatherAPI()', function () {
    it('should not return null when called (bad call)', function () {
      assert.notEqual(undefined, api.callWeatherAPI('Paris'))
    })
  })
})
