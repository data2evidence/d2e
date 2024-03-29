/* eslint-env node */
/**
 * Class for  Generating performance test report
 *
 * @module PerformanceTool
 * @author Shahzeb khan (D066567)
 */

var fs = require('fs');
var performanceTool = require('./performanceTool');
var XmlWriter = require('simple-xml-writer').XmlWriter;
require('console.table');
var HanaRequest = require('./hana_request');
var now = require('performance-now');
var hdb = require('hdb');
var mysql = require('mysql');
var tempResult = [];
var tempOld = [];
var maxRequests;
var time;
var url = [];
var headers = [];
var parameter = [];
var payload = [];
var values = [];
var statusCode1;

/**
 * Generate a performance test report based on baseline report from hana database and runSpecs json.
 * 1: Check if baseline exist, if not run performance tool to create one.
 * 2: Read the database baseline report and perform request operations using url, postdata and parameters.
 * 3: Perform real requests using URLs, postdata and parameters extracted in step 1 (fold times).
 * 4. Records the time taken for each request and compare them from baseline results.
 * 5. Writes the results in to XML files each for performance trend of Jenkins and Junit results.
 * 6. Failures are the requests slower than the criteria specified in runSpecs.
 */

var Test_tool = function (params) {
    this.params = params;
    this.config = fs.readFileSync(params[2]);
    this.jsonConfig = JSON.parse(this.config);
    this.contents = fs.readFileSync(this.jsonConfig.file);
    this.jsonContent = JSON.parse(this.contents);
    this.user_http = this.jsonConfig.user_http;
    this.password_http = this.jsonConfig.password_http;
    this.last_node = this.jsonContent.log.entries.length;
    this.max_cached = this.jsonConfig.max_cached_time;
    this.max_nocached = this.jsonConfig.max_noncached_time;
    this.max_cached_dev = this.jsonConfig.max_cached_deviation;
    this.max_nocached_dev = this.jsonConfig.max_noncached_deviation;
    if (this.jsonConfig.user_hdb !== '' && this.jsonConfig.host !== '') {
        this.host = this.jsonConfig.host;
        this.instance = this.jsonConfig.instance;
        this.user_hdb = this.jsonConfig.user_hdb;
        this.password_hdb = this.jsonConfig.password_hdb;
    } else {
        this.host = params[3];
        this.instance = params[4];
        this.user_hdb = params[5];
        this.password_hdb = params[6];
    }
    this.host_2 = this.jsonConfig.host_2;
    this.user_hdb_2 = this.jsonConfig.user_hdb_2;
    this.password_hdb_2 = this.jsonConfig.password_hdb_2;
    this.instance_2 = this.jsonConfig.instance_2;
    this.fold = this.jsonConfig.fold;
    this.filter_tag = this.jsonConfig.filter_tag;
    this.myHanaRequest = new HanaRequest(getMriAdminUserLogin(this.host, this.instance, this.user_http, this.password_http));

    this.client = hdb.createClient({
        host: this.host,
        port: 3 + this.instance + 15,
        user: this.user_hdb,
        password: this.password_hdb
    });
};

Test_tool.prototype.start = function (callback) {
    tempOld = [];
    tempResult = [];
    url = [];
    parameter = [];
    headers = [];
    payload = [];
    values = [];
    var that = this;
    var client = this.client;
    var params = this.params;
    this.client.on('error', function (err) {
        console.error('Network connection error', err);
    });

    this.myHanaRequest._login(function (err) {
        if (err) {
            console.log('login failed ' + err);
            that.call4();
        } else {
            that.call1(client, params, function (body) {
                return callback(body);
            });
        }
    });
};

Test_tool.prototype.call1 = function (client, params, callback) {
    var that = this;

    client.connect( function (err) {
        if (err) {
            return console.error('Connect error', err);
        }
        that.create_schema(client, function (body) {
            var folderNameTemp = that.params[2].substring(0, that.params[2].lastIndexOf('/'));
            var temp = folderNameTemp.substring(folderNameTemp.lastIndexOf('/') + 1, folderNameTemp.length);
            var folderName = that.params[2].substring(that.params[2].lastIndexOf('/') + 1, that.params[2].length);
            var fileName = temp + '_' + folderName;

            client.prepare('SELECT TIMESTAMP FROM PERFORMANCE.MAIN WHERE FILE = ? ORDER BY TIMESTAMP DESC LIMIT 1', function (err, statement) {
                if (err) {
                    return console.error('Prepare error:', err);
                }
                statement.exec([
                    [fileName]
                ], function (err, affectedRows) {
                    if (err) {
                        return console.error('Exec error:', err);
                    }
                    if (typeof affectedRows[0] === 'undefined') {
                        console.log('HAR file specified in config json was not played before');
                        console.log('Playing HAR file !!!');
                        var runPerformancetool = new performanceTool(params);
                        runPerformancetool.start(function (body) {
                            if (body === 'success') {
                                console.log('Running Performance performanceTool Finished. ---\r\n');
                                statement.exec([
                                [fileName]
                                ], function (err, affectedRows) {
                                    
                                    if (typeof affectedRows[0] === 'undefined') {
                                        // This could happen when no request url match the filter pattern
                                        console.log("No log entries were found in database, seems like no tests were executed.");
                                        client.disconnect( function( err ) {
                                            client.end();
                                            return callback(body);
                                        } );
                                    } else {                                    
                                        time = affectedRows[0].TIMESTAMP;
                                        that.call2(client, fileName, function (body) {
                                            return callback(body);
                                        } );
                                    };
                                });
                            }
                        });
                    } else {
                        console.log('Running test on baseline......');
                        time = affectedRows[0].TIMESTAMP;

                        that.call2(client, fileName, function (body1) {
                            return callback(body1);
                        });
                    }
                });
            });
        });
    });
};

Test_tool.prototype.call2 = function (client, fileName, callback) {
    var method;
    var that = this;
    var query = '';
    var result1 = [];
    var result2 = [];
    var result_temp = [];

    query = 'select * from PERFORMANCE.MAIN WHERE FILE = ? and TIMESTAMP= ?';
    client.prepare(query, function (err, statement) {
        if (err) {
            return console.error('Prepare error:', err);
        }
        statement.exec([
            [fileName, time.toString()]
        ], function (err, affectedRows) {
            var q = 0;
            (function loop_to_read() {
                if (q < affectedRows.length) {
                    if (err) {
                        return console.error('Exec error:', err);
                    }
                    url.push(affectedRows[q].REQUEST_URL);
                    //parameter.push(JSON.parse(affectedRows[q].PARAMETERS.replace(/[`\-=?;'.<>\\[\]\\\/]/gi, '')));
                    //payload.push(affectedRows[q].PAYLOAD.toString().replace(/[`<>\\\\\/]/gi, ''));
                    headers.push(JSON.parse(affectedRows[q].HEADERS));
                    parameter.push(JSON.parse(affectedRows[q].PARAMETERS));
                    payload.push(affectedRows[q].PAYLOAD.toString());
                    result_temp[0] = affectedRows[q].AVG_TIME_CACHED / 1000;
                    result_temp[1] = affectedRows[q].AVG_TIME_NOCACHED / 1000;
                    result_temp[2] = affectedRows[q].AVG_DATABASE_PROCESSING_TIME / 1000000;
                    result_temp[3] = affectedRows[q].sdCached / 1000;
                    result_temp[4] = affectedRows[q].SD_NOCACHE / 1000;
                    result_temp[5] = affectedRows[q].STATUSCODE;
                    method = affectedRows[q].METHOD;
                    maxRequests = that.jsonConfig.fold;
                    result1[q] = result_temp;
                    that.call3(url[q], headers[q], parameter[q], payload[q], q, method, function (message, body) {
                        if (message === 'success') {
                            result2[q] = body;
                            // 1 => protocol, 2 => domain, 3 => port , 4 => path, 5  => params
                            var urlParts = url[q].match( /^(?:((?:https?|s?ftp):)\/\/)([^:\/\s]+)(?::(\d*))?(?:\/([^\s?#]+)?([?][^?#]*)?(#.*)?)?/ );
                            var printURL = urlParts[4];
                            if ( urlParts[5] )
                                printURL += urlParts[5];
                            if ( printURL.length > 100 ) {
                                printURL = printURL.substr(0,100) + '...';
                            }
                            values.push([printURL, result1[q][0] + '--' + result2[q][0], result1[q][1] + '--' + result2[q][1], result1[q][2] + '--' + result2[q][2], result1[q][3] + '--' + result2[q][3], result1[q][4] + '--' + result2[q][4]]);
                            tempResult.push(result2[q]);
                            tempOld.push(JSON.parse(JSON.stringify(result1[q])));
                            q++;
                            loop_to_read();
                        }
                    });
                } else if (q === affectedRows.length) {
                    that.call4(affectedRows, affectedRows.length, tempOld, tempResult, function (body) {
                        affectedRows = [];
                        client.disconnect( function( err ) {
                            client.end();
                            return callback(body);
                        } );
                    });
                }
            }());
        });
    });
};

Test_tool.prototype.call3 = function (url, headers, parameter, payload, q, method, callback) {
    var that = this;
    var result = [];
    var exec = 0.0;
    var prep = 0.0;
    var rCode = 0;

    that.hdb_request(url, headers, parameter, payload, method, function (response_codes, time1, time2, body, response) {
        for (var f = 0; f < response.length; f++) {
            if (typeof response[f][3] !== 'undefined') {
                exec += response[f][3];
                prep += response[f][4];
            }
        }
        for ( var r = 0; r < response_codes.length; r++ ) {
            if ( response_codes[ r ] > rCode ) {
                rCode = response_codes[ r ];
            }
        }

        var cached_avg = that.average(time1);
        var nocached_avg = that.average(time2);
        var database_avg = that.average(body);
        result[0] = cached_avg.mean / 1000;
        result[1] = nocached_avg.mean / 1000;
        result[2] = database_avg.mean / 1000000;
        result[3] = cached_avg.deviation / 1000;
        result[4] = nocached_avg.deviation / 1000;
        result[5] = rCode;
        return callback('success', result);
    });
};

Test_tool.prototype.call4 = function (rows, size, old_result, new_result, callback) {
    var that = this;
    that.write_xml(rows, size, old_result, new_result, that, function (body) {
          that.write_xml_report(rows, size, old_result, new_result, function (body) {
            console.log('');
            console.table(['Request URL and parameters', 'Cached End2End(Old/New)', 'Non Cached End2End(Old/New)', 'Database Processing(Old/New)', 'SD Cached(Old/New)', 'SD No Cached(Old/New)'], values);
            return callback('success');
        });
    });
};

/**
 * Writes data to JUnit XMLs.
 * @param   {Array} rows
 * @param   {Int} size
 * @param   {Array} baseline result
 * @param   {Array} new result
 * @param   {Reference} reference to upper fucntion
 * @param   {Function} Callback
 */
Test_tool.prototype.write_xml = function (rows, size, old_result, new_result, call, cb) {
    var sdCached = 0;
    var sdNocached = 0;
    var failures = 0;
    var that = this;
    var folderNameTemp = that.params[2].substring(0, that.params[2].lastIndexOf('/'));
    var folderName = folderNameTemp.substring(folderNameTemp.lastIndexOf('/') + 1, folderNameTemp.length);
    var flag = 1;
    if(that.max_cached !== 0)
    {
      flag = 0;
    }

    var data = new XmlWriter(function (el) {
        el('testsuites', function (el, at) {
            el('testsuite', function (el, at) {
                at('name', that.jsonConfig.file);
                at('errors');
                at('tests', size);
                at('time', that.total_time(new_result, flag));
                for (var x = 0; x < size; x++) {
                    sdCached = ((new_result[x][0] / (rows[x].AVG_TIME_CACHED / 1000)) - 1) * 100;
                    sdNocached = ((new_result[x][1] / (rows[x].AVG_TIME_NOCACHED / 1000)) - 1) * 100;
                    if (new_result[x][5] !== 200 && new_result[x][5] !== 202) {
                        failures++;
                    } else if (that.max_cached !== 0 && that.max_nocached === 0) {
                        if (new_result[x][0] > that.max_cached) {
                            failures++;
                        }
                    } else if (that.max_cached === 0 && that.max_nocached !== 0) {
                        if (new_result[x][1] > that.max_nocached) {
                            failures++;
                        }
                    } else if (that.max_cached !== 0 && that.max_nocached !== 0) {
                        if (new_result[x][0] > that.max_cached && new_result[x][1] > that.max_nocached) {
                            failures++;
                        }
                    } else if (that.max_cached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_nocached_dev === 0) {
                        if (sdCached > that.max_cached_dev) {
                            failures++;
                        }
                    } else if (that.max_nocached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_cached_dev === 0) {
                        if (sdNocached > that.max_nocached_dev) {
                            failures++;
                        }
                    } else if (that.max_nocached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_cached_dev !== 0) {
                        if (sdNocached > that.max_nocached_dev && sdCached > that.max_cached_dev) {
                            failures++;
                        }
                    }
                }
                at('failures', failures);
                for (var x = 0; x < size; x++) {
                  var newTestname;
                  if (url[x].indexOf('?') < 0) {
                    newTestname = url[x];
                  } else {
                      newTestname = url[x].substring(0, url[x].indexOf('?'));
                  }
                  var urlParts = url[x].match( /^(?:((?:https?|s?ftp):)\/\/)([^:\/\s]+)(?::(\d*))?(?:\/([^\s?#]+)?([?][^?#]*)?(#.*)?)?/ );
                  var classname = urlParts[4];
                  if ( urlParts[5] ) {
                     classname += urlParts[5];
                  }
                  classname = classname.substr(0,200);

                  var name = "";//JSON.stringify(parameter[x]).substr(0,50);

                    el('testcase', function (el, at) {
                      at('classname', classname ); //newTestname);
                      at('name', name ); //newTestname);
                      at('assertion', '');
                      at('time', new_result[x][flag]);
                      at('message', values[x]);
                      if (new_result[x][5] !== 200 && new_result[x][5] !== 202) {
                          el('failure', function (el, at) {
                          at('message', 'Request failed because of permissions: ' + new_result[x][5] );
                          });
                      } else if (that.max_cached !== 0 && that.max_nocached === 0) {
                          if (new_result[x][0] > that.max_cached) {
                               el('failure', function (el, at) {
                               at('message', 'Request too slow: ' + new_result[x][0] + ' seconds');
                              });
                            }
                         } else if (that.max_cached === 0 && that.max_nocached !== 0) {
                          if (new_result[x][1] > that.max_nocached) {
                               el('failure', function (el, at) {
                               at('message', 'Request too slow: ' + new_result[x][1] + ' seconds');
                              });
                            }
                         }
                         else if(that.max_cached !== 0 && that.max_nocached !== 0)
                         {
                          if(new_result[x][0] > that.max_cached && new_result[x][1] > that.max_nocached)
                               {
                               el('failure', function (el, at) {
                               at('message', 'Request too slow: '+ new_result[x][0]+' seconds');
                              });
                            }
                         }
                         else if(that.max_cached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_nocached_dev === 0)
                         {
                          if(sdCached > that.max_cached_dev)
                              {
                               el('failure', function (el, at) {
                               at('message', 'Request too Deviating: ' + sdCached + ' %');
                              });
                            }
                         }
                         else if(that.max_nocached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_cached_dev === 0)
                         {
                          if(sdNocached > that.max_nocached_dev)
                               {
                               el('failure', function (el, at) {
                               at('message', 'Request too Deviating: ' + sdNocached + ' %');
                              });
                            }
                         }
                         else if(that.max_nocached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_cached_dev !== 0)
                         {
                          if (sdNocached > that.max_nocached_dev && sdCached > that.max_cached_dev)
                               {
                               el('failure', function (el, at) {
                               at('message', 'Request too Deviating: ' + sdNocached + ' %');
                              });
                            }
                         }
                         var actualUrlTemp = url[x].substring(url[x].lastIndexOf(':'), url[x].length);
                         var actualUrl = '80' + that.instance + actualUrlTemp.substring(actualUrlTemp.indexOf('/'), actualUrlTemp.length);
                         actualUrl = 'http://' + that.host + ':' + actualUrl;
                      el('system-out', 'Request URL and parameters: ' + actualUrl + '\n Payload: ' + rows[x].PAYLOAD.toString().replace(/[`<>\\\\\/]/gi, '') + '\n Cached End2End(Old): ' + rows[x].AVG_TIME_CACHED/1000 + '\n Cached End2End(New):' + new_result[x][0] + ' \n Non Cached End2End(Old): ' + rows[x].AVG_TIME_NOCACHED/1000 + ' \n Non Cached End2End(New):' + new_result[x][1] + '\n Database Processing(Old): ' + rows[x].AVG_DATABASE_PROCESSING_TIME/1000000 + '\n Database Processing(New):' + new_result[x][2] + '\n SD Cached: ' + sdCached + ' % \n SD Non Cached: ' + sdNocached + ' %');
                      el();
                  });
                }
            });
        });
    }, {addDeclaration: true});
    fs.writeFile(__dirname + '/build/' + folderName + '_' + that.params[2].substring(that.params[2].lastIndexOf('/') + 1, that.params[2].indexOf('.')) + '.xml', data + '\n', "UTF-8", function (err){
        if ( err ) {
            console.log( "Error writing results: " + err);
        }
        return cb('written');
    });
};

/**
 * Writes data to Performance trend XMLs (Only successful requests).
 * @param   {Array} rows
 * @param   {Int} size
 * @param   {Array} baseline result
 * @param   {Array} new result
 * @param   {Function} Callback
 */
Test_tool.prototype.write_xml_report = function (rows, size, old_result, new_result, cb) {
    console.log('writing performance report....');
    var sdCached = 0;
    var sdNocached = 0;
    var that = this;
    var folderNameTemp = that.params[2].substring(0, that.params[2].lastIndexOf('/'));
    var folderName = folderNameTemp.substring(folderNameTemp.lastIndexOf('/') + 1, folderNameTemp.length);
    var flag = 1;
    if(that.max_cached !== 0)
    {
      console.log('Reporting cached times...')
      flag = 0;
    }
    var data = new XmlWriter(function (el) {
        el('testsuites', function (el, at) {
            el('testsuite', function (el, at) {
                at('name', that.jsonConfig.file);
                at('errors');
                at('tests', size);
                at('time', that.total_time(new_result, flag));
                for (var x = 0; x < size; x++) {
                  if(new_result[x][5] === 200 || new_result[x][5] === 202) {
                  var newTestname;
                  if (url[x].indexOf('?') < 0) {
                    newTestname = url[x];
                  } else {
                      newTestname = url[x].substring(0, url[x].indexOf('?'));
                  }
                  var urlParts = url[x].match( /^(?:((?:https?|s?ftp):)\/\/)([^:\/\s]+)(?::(\d*))?(?:\/([^\s?#]+)?([?][^?#]*)?(#.*)?)?/ );
                  var classname = urlParts[4];
                  if(urlParts[5]) {
                     classname += urlParts[5];
                  }
                  classname = classname.substr(0, 200);
                  var name = '';//JSON.stringify(parameter[x]).substr(0,50);
                    el('testcase', function (el, at) {
                      at('classname', classname ); //newTestname);
                      at('name', name ); //newTestname);
                      at('assertion', '');
                      at('time', new_result[x][flag]);
                      at('message', values[x]);
                     if (that.max_cached !== 0 && that.max_nocached === 0) {
                          if (new_result[x][0] > that.max_cached) {
                               el('failure', function (el, at) {
                               at('message', 'Request too slow: ' + new_result[x][0] + ' seconds');
                              });
                            }
                         } else if (that.max_cached === 0 && that.max_nocached !== 0) {
                          if (new_result[x][1] > that.max_nocached) {
                               el('failure', function (el, at) {
                               at('message', 'Request too slow: ' + new_result[x][1] + ' seconds');
                              });
                            }
                         }
                         else if(that.max_cached !== 0 && that.max_nocached !== 0) {
                          if (new_result[x][0] > that.max_cached && new_result[x][1] > that.max_nocached) {
                               el('failure', function (el, at) {
                               at('message', 'Request too slow: ' + new_result[x][0] + ' seconds');
                              });
                            }
                         }
                         else if(that.max_cached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_nocached_dev === 0) {
                          if (sdCached > that.max_cached_dev) {
                               el('failure', function (el, at) {
                               at('message', 'Request too Deviating: ' + sdCached + ' %');
                              });
                            }
                         }
                         else if(that.max_nocached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_cached_dev === 0) {
                          if(sdNocached > that.max_nocached_dev) {
                               el('failure', function (el, at) {
                               at('message', 'Request too Deviating: ' + sdNocached + ' %');
                              });
                            }
                         }
                         else if(that.max_nocached_dev !== 0 && that.max_cached === 0 && that.max_nocached === 0 && that.max_cached_dev !== 0) {
                          if (sdNocached > that.max_nocached_dev && sdCached > that.max_cached_dev) {
                               el('failure', function (el, at) {
                               at('message', 'Request too Deviating: ' + sdNocached + ' %');
                              });
                            }
                         }
                         var actualUrlTemp = url[x].substring(url[x].lastIndexOf(':'), url[x].length);
                         var actualUrl = '80' + that.instance + actualUrlTemp.substring(actualUrlTemp.indexOf('/'), actualUrlTemp.length);
                         actualUrl = 'http://' + that.host + ':' + actualUrl;
                      el('system-out', 'Request URL and parameters: ' + actualUrl + '\n Payload: ' + rows[x].PAYLOAD.toString().replace(/[`<>\\\\\/]/gi, '') + '\n Cached End2End(Old): ' + rows[x].AVG_TIME_CACHED / 1000 + '\n Cached End2End(New):' + new_result[x][0] + ' \n Non Cached End2End(Old): ' + rows[x].AVG_TIME_NOCACHED / 1000 + ' \n Non Cached End2End(New):' + new_result[x][1] + '\n Database Processing(Old): ' + rows[x].AVG_DATABASE_PROCESSING_TIME / 1000000 + '\n Database Processing(New):' + new_result[x][2] + '\n SD Cached: ' + sdCached + ' % \n SD Non Cached: ' + sdNocached + ' %');
                      el();
                  });
                }
              }
            });
        });
    }, {addDeclaration: true});
    if (!fs.existsSync(__dirname + '/build/report/')){
    fs.mkdirSync(__dirname + '/build/report/' );
    }
    fs.writeFile(__dirname + '/build/report/' + folderName + '_' + that.params[2].substring(that.params[2].lastIndexOf('/') + 1, that.params[2].indexOf('.')) + '.xml', data + '\n', 'UTF-8', function (err){
        if ( err ) {
            console.log('Error writing results: ' + err);
        }
        return cb('written');
    });
};
Test_tool.prototype.average = function (a) {
    var r = {
            mean: 0,
            variance: 0,
            deviation: 0
        },
        t = a.length;
    for (var m, s = 0, l = t; l--; s += a[l]);
      for (m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
        r.deviation = Math.sqrt(r.variance = s / t);
    return r;
};
Test_tool.prototype.total_time = function (a, x) {
   var time=0;
   for(var j = 0; j < a.length ; j++)
   {
      time=time+a[j][x];
   }
   return time;
};

/**
 * Executing hana http request.
 * @param   {String} URL
 * @param   {String} Headers
 * @param   {String} Payload
 * @param   {String} Parameters
 * @param   {String} Method
 * @param   {Function} Callback
 */

Test_tool.prototype.hdb_request = function (url, headers, parameter, payload, method, callback) {
    var that = this;
    var attempt = 0;
    var tag = 'set';
    var queries = create2DArray(8, 7);
    var average_total_time = [];
    var average_total_time_nocached = [];
    var average_total_time_cached = [];
    var response_codes = [];
    var total_time = 0.0;
    var time1;
    var time2;

    (function hdb_loop_nested_exec() {
        if (attempt < maxRequests) {
            total_time = 0.0;
            time2 = 0.0;
            var clear = 'ALTER SYSTEM CLEAR SQL PLAN CACHE';
            var sql = mysql.format("select TOP 8 STATEMENT_STRING, AVG_EXECUTION_TIME, EXECUTION_COUNT, MAX_EXECUTION_TIME, MAX_PREPARATION_TIME, PREPARATION_COUNT, TOTAL_EXECUTION_TIME, TOTAL_PREPARATION_TIME, AVG_PREPARATION_TIME from M_SQL_PLAN_CACHE where USER_NAME = 'HPH_TECHNICAL_USER' order by TOTAL_EXECUTION_TIME desc");
            var myHanaRequest = new HanaRequest(getMriAdminUserLogin(that.host, that.instance, that.user_http, that.password_http));
            var client2 = hdb.createClient({
                host: that.host,
                port: 3 + that.instance + 15,
                user: that.user_hdb,
                password: that.password_hdb
            });
            client2.on('error', function (err) {
                console.error('Network connection error', err);
            });
            client2.connect(function (err) {
                if (err) {
                    return console.error('Connect error', err);
                }

                // 1 => protocol, 2 => domain, 3 => port , 4 => path, 5  => params
                var urlParts = url.toString().match( /^(?:((?:https?|s?ftp):)\/\/)([^:\/\s]+)(?::(\d*))?(?:\/([^\s?#]+)?([?][^?#]*)?(#.*)?)?/ );
                var path = urlParts[ 4 ];
                if ( method === 'GET' && urlParts[ 5 ] ) {
                    //if ( url.toString().match( /search\.xsjs/ ) ) {
                    path += urlParts[ 5 ];
                    //}
                }

                var setQuery = {
                    method: method,
                    path: path,
                    headers : headers,
                    body: payload,
                    parameters: parameter
                };
                var start = now();

                myHanaRequest.request(setQuery, function (err, response, body) {
                    statusCode1 = response.statusCode;
                    var responseBody = response.body;
                    if ( response.body.length > 1000 ) {
                        responseBody = response.body.substring(0,1000) + " [...]";
                    }

                    if (response.statusCode !== 200 && response.statusCode !== 202)
                        console.log('request unsuccessful: ' + response.statusCode + "\r\nResponse body: " + responseBody );
                    else
                        console.log('request successful: ' + response.statusCode + "\r\nResponse body: " + responseBody );
                    response_codes.push( parseInt( response.statusCode ) ) ;
                    var end = now();
                    time1 = ((end - start)).toFixed(3);
                    average_total_time_cached.push(parseFloat(time1));
                    time1 = 0.0;
                    client2.exec(
                            clear,
                            function (err, rows) {
                                var setQuery = {
                                    method: method,
                                    path: url,
                                    headers : headers,
                                    body: payload,
                                    parameters: parameter
                                };
                                var start = now();
                                myHanaRequest.request(setQuery, function (err, response, body) {
                                    var end = now();
                                    time2 = ((end - start)).toFixed(3);
                                    average_total_time_nocached.push(parseFloat(time2));
                                    time2 = 0.0;
                                    inner();
                                });
                            });
                });
                function inner() {
                    client2.exec(
                            sql,
                            function (err, rows) {
                                var a = 0;
                                if (err) {
                                    return console.error('Execute error:', err);
                                }
                                (function loop_nested_exec() {
                                    if (a < rows.length) {
                                        total_time += (rows[a].TOTAL_EXECUTION_TIME + rows[a].TOTAL_PREPARATION_TIME);
                                        if (tag === 'set') {
                                            queries[a][0] = rows[a].STATEMENT_STRING.toString('utf8');
                                            queries[a][1] = ((rows[a].AVG_EXECUTION_TIME) / 1000000).toString();
                                            queries[a][2] = ((rows[a].AVG_PREPARATION_TIME) / 1000000).toString();
                                            queries[a][3] = rows[a].EXECUTION_COUNT;
                                            queries[a][4] = rows[a].PREPARATION_COUNT;
                                            queries[a][5] = ((rows[a].MAX_EXECUTION_TIME) / 1000000).toString();
                                            queries[a][6] = ((rows[a].MAX_PREPARATION_TIME) / 1000000).toString();
                                        }
                                        a++;
                                        loop_nested_exec();
                                    } else if (a === rows.length) {
                                        average_total_time.push(total_time);
                                        attempt++;
                                        tag = 'unset';
                                        client2.disconnect( function( err ) {
                                            client2.end();
                                            hdb_loop_nested_exec();
                                        } );
                                    }
                                }());
                            });
                }
            });
        } else if (attempt === maxRequests) {
            return callback(response_codes, average_total_time_cached, average_total_time_nocached, average_total_time, queries);
        }
    }());
};

/**
 * Get login details.
 * @private
 * @param   {String} Host
 * @param   {String} Instance
 * @param   {String} hana user
 * @param   {String} hana password
 * @returns {Array} Login Object.
 */
function getMriAdminUserLogin(host, instance, user, password) {
    var login = {};
    var port = 80 + instance;
    login.target = host + ':' + port;
    login.user = user;
    login.password = password;
    return login;
}

/**
 * Generate 2D array.
 * @private
 * @param   {Int} Number of rows
 * @param   {Int} Number of columns
 * @returns {Array} Array object.
 */
function create2DArray(rows, columns) {
    var x = new Array(rows);
    for (var i = 0; i < rows; i++) {
        x[i] = new Array(columns);
    }
    return x;
}

/**
 * Creates a database schema if no baseline is found.
 * @private
 * @param   {Client} hana client object
 * @returns {Callback} callback function
 */
Test_tool.prototype.create_schema = function (client, callback) {
    client.exec('SELECT count(*) as count FROM "SYS"."SCHEMAS" WHERE SCHEMA_NAME=\'PERFORMANCE\'', function (err, rows) {
        if (err) {
            return console.log('');
        }
        if (rows[0].COUNT === 0) {
            console.log('Schema Performance does not exist at system');
            client.exec('CREATE SCHEMA performance OWNED BY system', function (err) {
                if (err) {
                    return console.log('');
                }
                console.log('Schema "Performance" has been created');
            });
        }
        client.exec('create column table PERFORMANCE.QUERIES (ID int, QUERY_STRING nclob,EXEC_TIME bigint,PREP_TIME bigint,EXEC_CNT int,PREP_CNT int,MAX_EXEC_TIME bigint,MAX_PREP_TIME bigint)', function (err) {
            if (err) {
                console.log('Table PERFORMANCE.QUERIES already existed');
            }
            console.log('Table PERFORMANCE.QUERIES has been created');
        });
        client.exec('create column table PERFORMANCE.MAIN (REQUEST_URL VARCHAR(2000), AVG_TIME_CACHED bigint,sdCached bigint,AVG_TIME_NOCACHED bigint,AVG_DATABASE_PROCESSING_TIME bigint, RID int,TIMESTAMP varchar(100),FILE varchar(2000), FOLDS int,MAX_DATABASE_PROCESSING_TIME bigint,MIN_DATABASE_PROCESSING_TIME bigint,MAX_TIME_CACHED bigint,MIN_TIME_CACHED bigint,headers nclob,payload nclob,parameters varchar(5000),MAX_TIME_NOCACHE bigint,MIN_TIME_NOCACHE bigint,SD_NOCACHE bigint,SD_DATABASE_PROCESSING_TIME bigint,STATUSCODE varchar(100),USERNAME varchar(100),EXEC_COUNT bigint,PREP_COUNT bigint, method varchar(100))', function (err) {
            if (err) {
                console.log('Table already existed, now inserting into database');
                return callback('Table already existed, now inserting into database');
            }
            console.log('Table Main has been created');
            return callback('Table Main has been created');
        });
    });
};
module.exports = Test_tool;
