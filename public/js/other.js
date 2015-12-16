/**
 * Created by lele on 2015/4/15.
 */
(function(){
    var devide = "ldp";
    var baseUrl = "../assets/imgs/";
    var width = document.documentElement.clientWidth;
    var ratio = window.devicePixelRatio;
    if(ratio&&ratio<1.5){
        devide = "ldp";
    }
    if(ratio&&ratio>=1.5&&ratio<2.5){
        devide = "mdp";
    }
    if(ratio&&ratio>=2.5||width>640){
        devide = "hdp";
    }
    $("img[data-src]").each(function(){
        var src = $(this).data("src");
        $(this).attr("src", baseUrl + devide + "/" + src);
    });
    function is_weixin(){
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    if(is_weixin()){
        $('#flow-nav').hide();
        $('body').css('padding-top','0');
    }
})();


//IOS页面双击上移问题
(function() {
    var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
    var iLastTouch = null;                                //缓存上一次tap的时间
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
    {
        document.body.addEventListener('touchend', function(event)
        {
            var iNow = new Date().getTime();
            iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
            var delta = iNow - iLastTouch;
            if (delta < 500 && delta > 0){
                event.preventDefault();
                return false;
            }
            iLastTouch = iNow;
        }, false);
    }
})();



/* 
* @Author: anchen
* @Date:   2015-07-20 14:12:50
* @Last Modified by:   anchen
* @Last Modified time: 2015-08-07 13:34:54
*/

(function(){
    'use strict';
    $.fn.modal = function(options){
        var args = arguments;
        var Modal = function (element, options) {
            this._ele = typeof element == 'string' ? $("#"+element) : element;
            $.extend(this, options || {});

            if(!$(".modal-backdrop").length){
                $("body").append('<div class="modal-backdrop fade"></div>');
            }

            this.backdrop = this._ele.data("backdrop");

            this._listeners();
        };

        Modal.prototype = {
            show: function(){
                $('body').addClass("modal-open");
                this._ele.show();
                $('.modal-backdrop').show();
                $('.modal-backdrop').attr("data-target", this._ele.attr("id"));
                var scope = this;
                window.setTimeout(function(){
                    scope._ele.addClass("in");
                    $('.modal-backdrop').addClass("in");
                }, 10);
            },
            hide: function(){
                $('body').removeClass("modal-open");
                var scope = this;
                scope._ele.removeClass("in");
                $('.modal-backdrop').removeClass("in");
                window.setTimeout(function(){
                    scope._ele.hide();
                    if($('.modal-backdrop').attr("data-target") == scope._ele.attr("id")) {
                        $('.modal-backdrop').hide();
                    }
                }, 400);
            },

            _listeners: function(){
                var scope = this;
                $('a[data-dismiss="modal"]', this._ele).on("click", function(){
                    scope.hide();
                });
                this._ele.on("click", function(e){
                    if(scope.backdrop && scope.backdrop == "true"){
                        if(!$(e.target).parents(".modal-content").length && !$(e.target).hasClass("modal-content")){
                            scope.hide();
                        }
                    }
                });
            }
        };

        return this.each(function(){
            if(this.ins && typeof options == 'string'){
                var method = Array.prototype.splice.apply(args,[0,1])[0];
                if(typeof this.ins[method] == 'function'){
                    this.ins[method].apply(this.ins, args);
                }
            }else{
                this.ins = new Modal($(this), options);
            }
        });
    };

    $(".modal").modal();
})();