/**
 * Created by cqb32_000 on 2015-12-12.
 */

const token = "840815";
var CREAT_MENU_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=";

var sha1 = require("sha1"),
    FileUtil = require("./FileUtil"),
    http = require("http"),
    https = require("https"),
    url = require("url"),
    AccessToken = require("./AccessToken");

module.exports = {

    /**
     * 验证signature
     * @param signature
     * @param timestamp
     * @param nonce
     * @returns {boolean}
     */
    checkSignature: function(signature, timestamp, nonce){
        var arr = [token, timestamp, nonce];
        arr.sort();

        var content = arr.join("");
        return sha1(content) === signature;
    },

    /**
     * 创建自定义菜单
     * @param callback
     * @param scope
     */
    createMenu: function(callback, scope){
        var menuStr = FileUtil.readFile(__dirname+"/../conf/menu.json");
        AccessToken.getAccessToken(function(token){
            if(token){
                var newUrl = CREAT_MENU_URL + token;
                this.httpsPostData(newUrl, menuStr, "POST", function(ret){
                    callback.call(scope, ret);
                }, null);
            }
        }, this);
    },

    /**
     * http get 方式获取数据
     * @param url
     * @param callback
     * @param scope
     */
    requestData: function(url, callback, scope){
        http.get(url, function(res){
            var ret = "";
            res.on("data", function(chunk){
                ret += chunk;
            });
            res.on("end", function(){
                callback.call(scope, ret);
            });
        }).on("error", function(e){
            callback.call(scope, null);
        });
    },


    /**
     * https POST 请求
     * @param host
     * @param postData
     * @param type
     * @param callback
     * @param scope
     */
    httpsPostData: function(host, postData, type, callback, scope){

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
        
        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            var ret = "";
            res.on('data', function (chunk) {
                ret += chunk;
            });
            res.on('end', function() {
                callback.call(scope, ret);
            });
        });

        req.on('error', function(e) {
            callback.call(scope, null);
        });

        // write data to request body
        req.write(postData);
        req.end();
    }
};