/**
 * Created by cqb on 2015/8/3.
 */
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var url = require('url');
var express = require('express');
var ROUTERSMAP = {};
var conf = require('./config');
var WeiXinUtil = require("./weixin/Util");

//数据库
var db = null;
try {
    require('./database/database');
}catch(e){

}

var extend = function(obj, source){
    if ( Object.keys ) {
        var keys = Object.keys( source||{} );
        for (var i = 0, il = keys.length; i < il; i++) {
            var prop = keys[i];
            Object.defineProperty( obj, prop, Object.getOwnPropertyDescriptor( source, prop ) );
        }
    }else {
        var safeHasOwnProperty = {}.hasOwnProperty;
        for ( var prop in source ) {
            if ( safeHasOwnProperty.call( source, prop ) ) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};


var services_files = fs.readdirSync(path.join(__dirname, 'services'));
var services = {};
services_files.forEach(function(services_file){
    var name = path.basename(services_file, '.js');
    services[name] = require(path.join(__dirname, 'services',services_file));
    services[name].db = db;
});


var CtxPvd = function(req, res){
    this.req = req;
    this.res = res;
    this.__params = {session: req.session, ctx: req.protocol + "://" +req.hostname+":"+req.app.get("port")+"/"};
    this.db = db;

    this._setRequestParams();
    extend(this, services || {});
};

CtxPvd.prototype = {

    get: function(key){
        return this.__params[key];
    },

    set: function(){
        var args = arguments;
        if(args.length == 2 && typeof args[0] == 'string'){
            this.__params[args[0]] = args[1];
        }
        if(args.length == 1 && Object.prototype.toString.apply(args[0]) === '[object Object]'){
            for(var i in args[0]){
                this.__params[i] = args[0][i];
            }
        }
    },

    forward: function(view, params, cback){
        if(typeof params == 'function'){
            cback = params;
            params = null;
        }
        if(params && Object.prototype.toString.apply(params) === '[object Object]'){
            extend(this.__params, params);
        }
        this.res.render(view, this.__params, cback);
    },

    chain: function(view){
        var handler = ROUTERSMAP[view] || ROUTERSMAP[view+"/"];
        if(handler){
            handler.apply(this, []);
        }else{
            this.res.status(404);
            this.res.end();
        }
    },

    redirect: function(view){
        this.res.redirect(view);
    },

    _setRequestParams: function(){
        var queries = null;
        if(this.req.method == 'GET'){
            queries = querystring.parse(url.parse(this.req.url).query);
        }
        if(this.req.method == 'POST'){
            queries = this.req.body;
        }
        extend(this.__params, queries);
    }
};

function initRouters(app){
    app.use('/*',function(req, res, next){
        var excepts = conf.EXCEPTURLS;
        for( var i in excepts){
            var except = excepts[i];
            if(req.originalUrl === except){
                next();
                return false;
            }
            var reg = new RegExp(except);
            if(reg.test(req.originalUrl)){
                next();
                return false;
            }
        }

        if(!req.session.user){
            var reqType = req.get('X-Requested-With');
            if(reqType && reqType == "XMLHttpRequest"){
                res.json({sessionInvalid: true});
            }else {
                res.redirect('/admin');
            }
        }else{
            next();
        }
    });

    /**
     * 微信菜单进入的进行授权判断
     */
    app.use('/activity/*',function(req, res, next){
        var openid = req.session.openid;
        if(openid){
            next();
        }else {
            var queries = querystring.parse(url.parse(req.url).query);
            if (queries["state"]) {
                var code = queries["code"];
                WeiXinUtil.getOpenIdByPageAccessToken(code, function(openid){
                    req.session.openid = openid;
                    next();
                }, null);
            } else {
                var redirect_url = encodeURIComponent("http://" + req.headers["host"] + req.originalUrl);
                var ret = WeiXinUtil.getURL(req, redirect_url);
                if (ret) {
                    res.redirect(ret);
                } else {
                    res.render("404");
                }
            }
        }
    });


    var files = fs.readdirSync(path.join(__dirname, 'routes'));
    files.forEach(function(file){
        var name = path.basename(file, '.js');
        var routeMap = require('./routes/'+name);
        var router = express.Router();
        var r_path;
        for(r_path in routeMap){
            ROUTERSMAP["/"+name+r_path] = routeMap[r_path];
            handRouter(router, r_path, routeMap[r_path]);
        }
        app.use("/"+name, router);
        if(name === 'home'){
            app.use("/", router);
        }
    });
}

/**
 *
 * @param router
 * @param r_path
 * @param handler
 */
function handRouter(router, r_path, handler){
    router.all(r_path, function(req, res, next){
        var ctx = new CtxPvd(req, res);
        handler.apply(ctx, []);
    });
}

exports.initRouters = initRouters;