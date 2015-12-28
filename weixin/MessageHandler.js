/**
 * Created by qingbiao on 2015-12-20.
 */

var WXConfig = require("../config");
module.exports = {
    /**
     * 处理msgXML
     * @param xml
     * @param callback
     * @param scope
     */
    acceptMessage: function(xml, callback, scope){
        var xml2json = require("simple-xml2json");
        var json     = xml2json.parser( xml );
        var msgObj = json.xml;

        console.log(msgObj);
        if(msgObj.msgtype === "event"){
            if(msgObj.event === "unsubscribe"){
                console.log("取消关注");
                callback.call(scope, this.createResTextMsg(msgObj, ""));
            }
            if(msgObj.event === "subscribe"){
                callback.call(scope, this.createResTextMsg(msgObj, WXConfig.MGS.subscribe));
            }
        }

        //文本消息
        if(msgObj.msgtype === "text"){
            if(msgObj.content == "1") {
                callback.call(scope, this.createResTextMsg(msgObj, WXConfig.MGS.hello));
            }else{
                callback.call(scope, "");
            }
        }
    },

    /**
     *
     * @param msg
     * @param content
     */
    createResTextMsg: function(msg, content){
        var res = {};
        res.ToUserName = msg.fromusername;
        res.FromUserName  = msg.tousername;
        res.CreateTime = new Date().getTime();
        res.MsgType = 'text';
        res.Content = content;

        return this.JS2XML(res);
    },

    /**
     *
     * @param json
     * @returns {string}
     * @constructor
     */
    JS2XML: function(json){
        var xml = ["<xml>"];
        xml.push(this._js2xml(json));
        xml.push("</xml>");

        return xml.join("");
    },

    /**
     *
     * @param json
     * @returns {string}
     * @private
     */
    _js2xml: function(json){
        var xml = [];
        for(var i in json){
            if(typeof json[i] === 'string') {
                xml.push('<' + i + '><![CDATA[' + json[i] + ']]></' + i + '>');
            }else if(typeof json[i] === 'number'){
                xml.push('<' + i + '>' + json[i] + '</' + i + '>');
            }else if(typeof json[i] === 'object'){
                xml.push('<'+i+'>' + this._js2xml(json[i] + '</'+i+'>'));
            }
        }

        return xml.join("");
    }
};