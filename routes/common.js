/**
 * Created by cqb32_000 on 2015-12-16.
 */

module.exports = {
    '/bind\.html': function(){
        var tel = this.get("tel");
        var code = this.get("code");
        var openid = this.req.session.openid;

        console.log(tel, code, openid);

        this.res.json({bind: true});

    }
};