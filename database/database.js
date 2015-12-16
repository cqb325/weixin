/**
 * Created by qingbiao on 2015-12-16.
 */

var redis = require("redis");
var client = redis.createClient(6379,'127.0.0.1');

client.on("error", function(err){
    console.log("Redis Error: " + err);
});

client.on('ready',function(err){
    console.log('Redis ready...');
});

module.exports = client;