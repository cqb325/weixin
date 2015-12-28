## Node.js的微信公众号开发

使用nodejs+express进行微信开发

### 环境

- node.js 最新版本
- redis 最新版本
- express.js 4.x

### 安装
	
	//install
	$npm install

修改微信信息：`config.js`

	exports.WX = {
	    TOKEN: "xxxxxx",
	    APPID: "xxxxxx",
	    APPSECRET: "xxxxxx"
	};
	
修改成自己申请的公众号的token和appid和appsecret即可。	

	//start
	$npm start
	
启动的端口为8888,在`bin\www`文件修改,访问

	http://localhost:8888/weixin/index.html

有结果说明成功。

###外网映射

下载`ngrock`，官方有配置使用说明。再次访问映射外网的地址测试验证：

	http://外网域名/weixin/index.html

##开发步骤

### 开发模式接入

- 第一步：填写服务器配置

按照官方文档完成配置[《接入指南》](http://mp.weixin.qq.com/wiki/17/2d4265491f12608cd170a95559800f2d.html)

URL地址填写上面：`http://外网域名/weixin/index.html`

- 第二步：验证服务器地址的有效性

 routes目录下的`weixin.js`中`"/index\.html"`路由函数中：

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
    }

验证有效性的请求为GET请求，该请求由微信服务器请求，所以放在GET中处理。

微信服务器向我们的服务发送了四个参数：`signature`、`timestamp`、`nonce`、`echostr`,我们需要对`signature`进行验证，验证方法在

	WeiXinUtil.checkSignature
函数中，
	
	/**
     * 验证signature
     * @param signature
     * @param timestamp
     * @param nonce
     * @returns {boolean}
     */
    checkSignature: function(signature, timestamp, nonce){
        var arr = [token, timestamp, nonce];
        arr.sort();

        var content = arr.join("");
        return sha1(content) === signature;
    }

`sha1`为npm的`sha1`包

最终将`echostr`返回给微信服务器