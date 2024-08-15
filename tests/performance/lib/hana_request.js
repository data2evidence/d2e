/**
 * @module hana_request
 * This package provides basic plumbing for calling the Orion file api
 */

'use strict'

var _ = require('underscore')
var request = require('request')
var querystring = require('querystring')
var assert = require('assert')

var doNothing = function () {
  // Just to have a no-op
}

var log = {
  debug: doNothing,
  error: console.log
}

// /**** Example xsConfig object ****/
//
// var xsConfig = {
//   target: 'test-system-utl:8000',
//   user: process.env.HDIUSER ? process.env.HDIUSER : "SYSTEM",
//   password: 'Initial1'
// };
//

function HanaRequest(xsConfig) {
  assert(xsConfig, 'No valid xs config given')
  assert(xsConfig.target && typeof xsConfig.target === 'string', 'No valid host name given')
  assert(xsConfig.user && typeof xsConfig.user === 'string', 'No valid user name given')
  assert(xsConfig.password && typeof xsConfig.password === 'string', 'No valid password given')

  this.baseUrl = 'http://' + xsConfig.target
  this.user = xsConfig.user
  this.password = xsConfig.password
  this.loginEndpoint = this.baseUrl + '/legacy/xs/formLogin/login.xscfunc'
  this.csrfEndpoint = this.baseUrl + '/legacy/xs/formLogin/token.xsjs'
  this.hostHeader = xsConfig.target

  this.authCookie = null
  this.csrfToken = null
  this.numLogins = 0
  this._loginPending = false
  this.failedRequests = []
}

HanaRequest.prototype._refreshLogin = function (cb) {
  var that = this
  log.debug('Refreshing login')
  that._loginPending = true

  that._login(function (error) {
    if (error) {
      that._loginPending = false
      if (cb) {
        cb(error)
      }
      return
    }

    that._fetchCsrfToken(function (error2) {
      that._loginPending = false

      if (error) {
        if (cb) {
          cb(error2)
        }
        return
      }

      log.debug('_refreshLogin success')
      that.numLogins++

      log.debug('Number of waiting requests:', that.failedRequests.length)
      _.each(that.failedRequests, function (failedReq) {
        failedReq.numLogins = that.numLogins
        failedReq.call(that)
      })

      that.failedRequests = []

      if (cb) {
        cb()
      }
    })
  })
}

HanaRequest.prototype._login = function (cb) {
  var that = this
  var postData = {
    'xs-username': this.user,
    'xs-password': this.password
  }

  var body = querystring.stringify(postData)

  var options = {
    url: this.loginEndpoint,
    body: body,
    headers: {
      'X-CSRF-Token': 'unsafe',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    }
  }

  log.debug('starting login')
  request.post(options, function (error, response) {
    if (error) {
      log.error('login failed')
      return cb(error)
    }

    response.setEncoding('utf8')

    if (response.statusCode !== 200 && response.statusCode !== 202) {
      log.error('login failed, statusCode = ', response.statusCode)
      return cb(new Error('StatusCode ' + response.statusCode))
    }

    log.debug('login success')
    var authCookie = response.headers['set-cookie']
    that.authCookie = authCookie

    return cb(error, authCookie)
  })
}
HanaRequest.prototype._fetchCsrfToken = function (cb) {
  var that = this

  var options = {
    url: this.csrfEndpoint,
    method: 'HEAD',
    headers: {
      'X-CSRF-Token': 'Fetch',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: that.authCookie
    }
  }
  log.debug('fetching csrf-token')
  request(options, function (error, response) {
    if (error) {
      log.error('failed to fetch csrf-token')
      log.error(error.message)
      return cb(error)
    }

    response.setEncoding('utf8')

    if (response.statusCode !== 200 && response.statusCode !== 202) {
      log.error('failed to fetch csrf-token. statusCode = ' + response.statusCode)
      return cb(new Error('StatusCode ' + response.statusCode))
    }
    log.debug('success fetching csrf-token ')

    var token = response.headers['x-csrf-token']
    that.csrfToken = token
    return cb(error, token)
  })
}

HanaRequest.prototype.retry = function (fn) {
  log.debug('retry is called')
  if (fn.numLogins === this.numLogins) {
    this.failedRequests.push(fn)
    if (!this._loginPending) {
      this._refreshLogin()
    }
  } else {
    fn.numLogins = this.numLogins
    fn()
  }
}

HanaRequest.prototype._makeRequestOptions = function (query) {
  var path = query.path || ''

  if (path && path[0] !== '/') {
    path = '/' + path
  }

  var url = this.baseUrl + path

  var contentType = 'text/plain;charset=UTF-8'
  if (query.headers !== undefined) {
    for (var h = 0; h < query.headers.length; h++) {
      if (query.headers[h].name === 'Content-Type') {
        contentType = query.headers[h].value
      }
    }
  }

  var options = {
    url: url,
    headers: {
      Host: this.hostHeader,
      Cookie: this.authCookie,
      'Content-Type': contentType
    }
  }

  options.qs = query.parameters

  if (query.body) {
    options.body = query.body
    options['Content-Length'] = options.body.length
    options['Content-Type'] = contentType
  }

  var method = query.method.toLowerCase()
  options.method = method

  if (['put', 'post', 'delete'].indexOf(method) !== -1) {
    options.headers['X-CSRF-Token'] = this.csrfToken
    options.headers['X-Requested-With'] = 'XMLHttpRequest'
  } else {
    assert(method === 'get', 'invalid method')
  }

  return options
}

/**
 * Make a request to the hana server the structure of the query object should be
 *
 * {
 *     method : 'POST',                                    // the method
 *     path    : '/sap/hhp/medexplorer/xs/mequery.xsjs',   // the url
 *     parameters : { 'x' : 1 },                           // any url parameters as an object
 *     body : JSON.stringify(data)                         // the body
 *   },
 *
 * @param {Object} query - query object
 * @param {Function} cb - callback
 */
HanaRequest.prototype.request = function (query, cb) {
  var that = this

  log.debug('initializing request')

  var theRequest = function theRequest() {
    var options = that._makeRequestOptions(query)

    log.debug('theRequest is executed')
    request(options, function (error, response, body) {
      if (error) {
        log.debug('Error executing request', request, error)
        return cb(error, response, body)
      }

      if (response.statusCode === 400) {
        return cb(error, response, body)
      }

      if (response.statusCode === 401) {
        if (theRequest.numTrials === 2) {
          // throw new Error('Retried too many times');
          return cb(error, response, body)
        }
        theRequest.numTrials++
        return that.retry(theRequest)
      }
      if (response.statusCode === 403) {
        if (theRequest.numTrials === 3) {
          // throw new Error('Retried too many times');
          return cb(error, response, body)
        }
        theRequest.numTrials++
        return that.retry(theRequest)
      }

      response.setEncoding('utf8')
      var data
      try {
        data = JSON.parse(body)
        if (data && data.Severity && data.Severity === 'Error') {
          error = new Error(data.Message)
        }
      } catch (e) {
        log.debug('Error parsing body as JSON')
        log.debug(e.message)
        data = { body: JSON.stringify(body) }
      }

      if (error) {
        log.error('Error executing request', request, error)
        return cb(error, response, data)
      }

      return cb(error, response, data)
    })
  }

  theRequest.numLogins = this.numLogins
  theRequest.numTrials = 0

  if (this.numLogins === 0) {
    log.debug('no login yet, call retry with theRequest')
    that.retry(theRequest)
  } else {
    log.debug('immediately executing query')
    theRequest()
  }
}

module.exports = HanaRequest
