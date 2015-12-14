/**
 * Created by cqb32_000 on 2015-12-12.
 */

const APPID = "wx4fcae70b644f4bfd";
const APPSECRET = "d4624c36b6795d1d99dcf0547af5443d";
const ACCESS_TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APPID+"&secret="+APPSECRET;

var fs = require("fs"),
    FileUtil = require("./FileUtil"),
    url = require("url"),
    http = require("http"),
    https = require("https");

module.exports = {

    getAccessToken: function(callback, scope){
        var tokenPath = __dirname + "/../conf/token";
        var self = this;
        fs.exists(tokenPath, function(exists){
            if(exists){
                var token = FileUtil.readFile(tokenPath);
                token = token ? JSON.parse(token.trim()) : token;
                if(token){
                    //没过期直接使用
                    if(self.checkValidate(token.access_token)){
                        callback.call(scope, token.access_token);
                    }else{
                        //过期重新获取
                        self.reloadAccessToken(callback, scope);
                    }
                }else{
                    //没获取过token重新获取
                    self.reloadAccessToken(callback, scope);
                }
            }else{
                self.reloadAccessToken(callback, scope);
            }
        });
    },

    /**
     * 校验access_token是否过期
     * @param token 本地保存的token值
     */
    checkValidate: function(token){
        var now = new Date();
        var time = new Date(token.time);

        return now.getTime() - time.getTime() < 0;
    },

    /**
     * 重新获取AccessToken
     * @param callback
     * @param scope
     */
    reloadAccessToken: function(callback, scope){
        this.httpsPostData(ACCESS_TOKEN_URL, "", "GET", function(ret){
            if(ret) {
                var json = JSON.parse(ret);
                if(json.access_token){
                    var now = new Date();
                    now.setMinutes(now.getMinutes() + json.expires_in);
                    json.time = now;
                    var tokenPath = __dirname + "/../conf/token";
                    FileUtil.writeFile(tokenPath, JSON.stringify(json));

                    callback.call(scope, json.access_token);
                }else{
                    callback.call(scope, null);
                }
            }else{
                callback.call(scope, null);
            }
        }, null);
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