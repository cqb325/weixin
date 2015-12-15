/**
 * Created by qingbiao on 2015-12-15.
 */

"use strict";

var url = require("url"),
    https = require("https");

module.exports = {
    /**
     * https POST 请求
     * @param host
     * @param postData
     * @param type
     * @param callback
     * @param scope
     */
    httpsPostData: function (host, postData, type, callback, scope) {

        var obj = url.parse(host);
        var length = postData ? postData.length : 0;

        var options = {
            hostname: obj.hostname,
            port: obj.port || 443,
            path: obj.path,
            method: type,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': length
            }
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            var ret = "";
            res.on('data', function (chunk) {
                ret += chunk;
            });
            res.on('end', function () {
                callback.call(scope, ret);
            });
        });

        req.on('error', function (e) {
            callback.call(scope, null);
        });

        // write data to request body
        req.write(postData);
        req.end();
    }
};