/**
 * Created by cqb32_000 on 2015-12-12.
 */

var WeiXinUtil = require("../weixin/Util");

module.exports = {
    /**
     * 绑定手机号码
     */
    "/bindTel\.html": function(){

        this.forward("bindTel");
    }
};