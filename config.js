/**
 * Created by cqb32_000 on 2015/7/31.
 */
exports.DB = {

};

exports.WX = {
    APPID: "wx4fcae70b644f4bfd",
    APPSECRET: "d4624c36b6795d1d99dcf0547af5443d",
    PAGE_ACCESS_TOKEN_URL: "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code",
    PAGE_CODE_URL: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect"
};

exports.EXCEPTURLS = ["/*"];