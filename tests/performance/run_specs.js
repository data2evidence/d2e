#!/usr/bin/env node
/**
 */

var fs = require('fs')
var path = require('path')
var testTool = require('./lib/testTool')
var childProcess = require('child_process')

// Default config
var testDir = __dirname + '/specs'
var defaultEnvironmentPath = path.join(testDir, 'environment.json')
var accessConfig = JSON.parse(fs.readFileSync(defaultEnvironmentPath))

// Load test cases specs folder
var filePatternRegex = new RegExp('test.json$')
var walkSpecsSync = function (dir) {
  var result = []
  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) result = result.concat(walkSpecsSync(file))
    else if (filePatternRegex.test(file)) result.push(file)
  })
  return result
}

var make_xml = function (callback) {
  var body = fs.readFileSync('./lib/build/result.xml').toString()
  var search = '<?xml version="1.0" encoding="UTF-8"?>'
  var search1 = '<testsuites>'
  var search2 = '</testsuites>'
  var q = replaceAll(body, search, '')
  q = replaceAll(q, search1, '')
  q = replaceAll(q, search2, '')
  q = search1 + q + search2
  q = search + '\r\n' + q
  fs.writeFile('./lib/build/result.xml', q, function (body) {
    return callback(body)
  })
}

var replaceAll = function (body, search, replacement) {
  var target = body
  return target.split(search).join(replacement)
}
var specs = walkSpecsSync(testDir)

// Execute tests
console.log('\r\n=================================')
console.log('=== Execute performance tests ===')
console.log('=================================')

if (!fs.existsSync(__dirname + '/lib/build/')) {
  fs.mkdirSync(__dirname + '/lib/build/')
}

var c = 0
;(function loop_first_execution() {
  if (c < specs.length) {
    console.log('\r\n---> Run test "' + specs[c] + '":\r\n')
    var parameters = [
      '',
      '',
      specs[c],
      accessConfig.host,
      accessConfig.instance,
      accessConfig.user_hdb,
      accessConfig.password_hdb
    ]
    var tool = new testTool(parameters)
    tool.start(function (body) {
      if (body) {
        c++
        loop_first_execution()
      }
    })
  } else if (c == specs.length) {
    console.log('\r\n---> test execution finished.\r\n')
  }
})()
