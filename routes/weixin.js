/**
 * Created by cqb32_000 on 2015-12-12.
 */

var WeiXinUtil = require("../weixin/Util");

module.exports = {

    "/index\.html": function() {
        var signature = this.get("signature");
        var timestamp = this.get("timestamp");
        var nonce = this.get("nonce");
        var echostr = this.get("echostr");

        if(WeiXinUtil.checkSignature(signature, timestamp, nonce)){
            this.res.end(echostr);
        }else{
            this.res.end("hello");
        }
    },

    "/createMenu\.html": function(){
        WeiXinUtil.createMenu(function (ret) {
            this.res.end(ret);
        }, this);
    },

    "/bindTel\.html": function(){
        var code = this.get("code");
        var state = this.get("state");

        this.res.json({code: code, state: state});
        //WeiXinUtil.getCode();
    }
};