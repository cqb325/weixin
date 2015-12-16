/**
 * Created by cqb32_000 on 2015-12-16.
 */

module.exports = {

    /**
     *
     * @param tel
     * @param openid
     * @param callback
     * @param scope
     */
    saveUser: function(tel, openid, callback, scope){
        //this.db.hmset("user:"+openid, {phone: tel});
        var self = this;
        this.db.get("user:" + openid, function (err, res) {
            if(res == null){
                self.db.set("user:"+openid, '{"phone": '+tel+'}', function(set_err, set_res){
                    if(set_err){
                        callback.call(scope, {success: false});
                    }else{
                        callback.call(scope, {success: true});
                    }
                });
            }else{
                res = JSON.parse(res);
                if(res.phone == tel) {
                    callback.call(scope, {binded: true});
                }else{
                    self.db.set("user:"+openid, '{"phone": '+tel+'}', function(set_err, set_res){
                        if(set_err){
                            callback.call(scope, {success: false});
                        }else{
                            callback.call(scope, {success: true});
                        }
                    });
                }
            }
        });
    }

};