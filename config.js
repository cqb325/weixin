/**
 * Created by cqb32_000 on 2015/7/31.
 */
exports.DB = {

};

exports.WX = {
    TOKEN: "xxxxxx",
    APPID: "xxxxxx",
    APPSECRET: "xxxxxx",
    PAGE_ACCESS_TOKEN_URL: "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code",
    PAGE_CODE_URL: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect",
    JS_SDK_TICKET_FILE: "/conf/JsSDKTicket",
    JS_SDK_TICKET_URL: "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi"
};

exports.MGS = {
    subscribe: "欢迎您关注游泳的鱼!",
    hello: "您好!"
};

exports.EXCEPTURLS = ["/*"];