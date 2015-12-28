/**
 * Created by cqb32_000 on 2015-12-12.
 */

var CREAT_MENU_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=";

var WXCONFIG = require("../config").WX;

var sha1 = require("sha1"),
    FileUtil = require("./FileUtil"),
    HttpsUtil = require("./HttpsUtil"),
    http = require("http"),
    https = require("https"),
    url = require("url"),
    uuid = require("uuid"),
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
        var arr = [WXCONFIG.TOKEN, timestamp, nonce];
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
     *
     * @param req
     * @param redirect_url
     */
    getURL: function(req, redirect_url){

        //从微信服务重定向过来的
        var url = WXCONFIG.PAGE_CODE_URL.replace("APPID", WXCONFIG.APPID);
        url = url.replace("REDIRECT_URI", redirect_url);
        url = url.replace("SCOPE", "snsapi_base");
        url = url.replace("STATE", "1");

        return url;
    },

    /**
     * 根据网页授权的AccessToken获取openid
     * @param code
     * @param callback
     * @param scope
     */
    getOpenIdByPageAccessToken: function(code, callback, scope){
        var url = WXCONFIG.PAGE_ACCESS_TOKEN_URL.replace("CODE", code);
        url = url.replace("APPID", WXCONFIG.APPID);
        url = url.replace("SECRET", WXCONFIG.APPSECRET);
        HttpsUtil.httpsPostData(url, "", "POST", function(ret){
            if(ret) {
                var json = JSON.parse(ret);
                if(json.openid){
                    callback.call(scope, json.openid);
                }else{
                    callback.call(scope, null);
                }
            }else{
                callback.call(scope, null);
            }
        }, null);
    },

    /**
     * 获取JS API 签名
     * @param url
     * @param callback
     * @param scope
     */
    getJsSDKSignature: function(url, callback, scope){
        AccessToken.getJsSDKTicket(function(ticket){
            var noncestr = uuid.v1();
            var noncestrStr = "noncestr="+noncestr;
            var time = new Date().getTime();
            var timestamp = "timestamp="+time;
            url = "url="+url;
            var jsapi_ticket = "jsapi_ticket="+ticket;

            var arr = [noncestrStr, timestamp, url, jsapi_ticket];
            arr.sort();

            var str = arr.join("&");
            var signature = sha1(str);

            callback.call(scope, {
                appId: WXCONFIG.APPID,
                timestamp: time,
                nonceStr: noncestr,
                signature: signature
            });
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