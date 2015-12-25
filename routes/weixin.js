/**
 * Created by cqb32_000 on 2015-12-12.
 */

var WeiXinUtil = require("../weixin/Util");
var MessageHandler = require("../weixin/MessageHandler");

module.exports = {

    "/index\.html": function() {

        if(this.req.method === "GET"){
            var signature = this.get("signature");
            var timestamp = this.get("timestamp");
            var nonce = this.get("nonce");
            var echostr = this.get("echostr");

            if(WeiXinUtil.checkSignature(signature, timestamp, nonce)){
                this.res.end(echostr);
            }else{
                this.res.end("hello");
            }
        }else {
            var body = "";
            this.req.on('data', function (chunk) {
                body += chunk;
            });

            var scope = this;
            this.req.on('end', function () {
                MessageHandler.acceptMessage(body, function(resMsg){
                    this.res.end(resMsg);
                }, scope);
            });
        }
    },

    "/createMenu\.html": function(){
        WeiXinUtil.createMenu(function (ret) {
            this.res.end(ret);
        }, this);
    },

    "/bindTel\.html": function(){
        var code = this.get("code");
        console.log(code);
        var state = this.get("state");

        WeiXinUtil.getOpenIdByPageAccessToken(code, function(openid){
            this.res.json({openid: openid});
        }, this);
    }
};