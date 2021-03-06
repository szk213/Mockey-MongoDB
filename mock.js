var mocky = require('mocky');
var uuid = require('uuid/v1');
var log4js = require('log4js');
var fs = require('fs');

log4js.configure('log4js.config.json');
var logger = log4js.getLogger('request');
mocky.createServer([{
// simple GET route without request body to match
    url: '/someurl1?a=b&c=d',
    method: 'post',
    res: function(req, res) {
        // return 'test';
        return fs.readFileSync('./responses/someurl1.json', 'utf8');
    }
}, {
// POST route with request body to match and respose with status, headers and body
    url: '/someurl2?a=b&c=d',
    method: 'post',
    req: 'POST request body to match',
    res: {
        status: 202,
        headers: {'Content-type': 'text/html'},
        body: '<div>response to return to client</div>'
    }
}, {
// PUT route with dynamic response body
    url: '/someurl3?a=b&c=d',
    method: 'put',
    req: 'PUT request body to match',
    res: function(req, res) {
        return 'PUT response body';
    }
}, {
// GET route with regexp url and async response with status, headers and body
    url: /\/someurl4\?a=\d+/,
    method: 'get',
    res: function(req, res, callback) {
        setTimeout(function() {
            callback(null, {
                status: 202,
                headers: {'Content-type': 'text/plain'},
                body: 'async response body'
            });
        }, 1000);
    }
},
  {
    url: '/convertjobs',
    method: 'post',
    res: function(req, res, callback) {
      var convertJobId = uuid();
      logger.info('=====');
      logger.info('[REQ] header:' + JSON.stringify(req.headers) + ' body:' + JSON.stringify(req.body));
      logger.info('[RES] header:' + JSON.stringify(res.headers) + ' body:' + JSON.stringify(res.body));

      callback(null,
        {
          status: 201,
          headers: {'Content-type': 'application/json;charset=UTF-8'},
          body: JSON.stringify(
           {
            "id": convertJobId,
            "todoList":{
                "todo": { "name":"テスト" }
            }
          })
        }
      );
    }
  }
]).listen(4321);