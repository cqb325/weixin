/**
 * Created by cqb32_000 on 2015-12-12.
 */

const APPID = "wx4fcae70b644f4bfd";
const APPSECRET = "d4624c36b6795d1d99dcf0547af5443d";
const ACCESS_TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APPID+"&secret="+APPSECRET;
const ACCESS_TOKEN_FILE = __dirname + "/../conf/accessToken";

var fs = require("fs"),
    FileUtil = require("./FileUtil"),
    HttpsUtil = require("./HttpsUtil"),
    url = require("url"),
    http = require("http");

module.exports = {

    getAccessToken: function(callback, scope){
        var self = this;
        fs.exists(ACCESS_TOKEN_FILE, function(exists){
            if(exists){
                var token = FileUtil.readFile(ACCESS_TOKEN_FILE);
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
        HttpsUtil.httpsPostData(ACCESS_TOKEN_URL, "", "GET", function(ret){
            if(ret) {
                var json = JSON.parse(ret);
                if(json.access_token){
                    var now = new Date();
                    now.setMinutes(now.getMinutes() + json.expires_in);
                    json.time = now;
                    FileUtil.writeFile(ACCESS_TOKEN_FILE, JSON.stringify(json));

                    callback.call(scope, json.access_token);
                }else{
                    callback.call(scope, null);
                }
            }else{
                callback.call(scope, null);
            }
        }, null);
    }
};