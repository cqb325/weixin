/**
 * Created by cqb32_000 on 2015/7/14.
 */
(function(){
    var scripts = document.getElementsByTagName("script");
    var dir = null;
    for(var i = 0, l = scripts.length; i < l; i++){
        var script = scripts[i];
        var src = script.getAttribute("src");
        if(src && src.indexOf("require.js") > -1){
            dir = src.replace("/require.js", "");
            break;
        }
    }
    requirejs.dir = dir;
    requirejs.config({
        baseUrl: dir+"/../js",
        paths: {
            "mock": "../../data/mockData",
            "jquery" : "../lib/jquery-1.11.3.min",
            "store": "../lib/store.min",
            "bootstrap": "../lib/bootstrap.min",
            "validate": '../lib/jquery.validate.min',
            "validate-message": '../lib/messages_zh',
            "slider": '../lib/slider',
            "highcharts": '../lib/highcharts/js/highcharts',
            "echarts": '../lib/echarts',
            "daterangepicker": '../lib/daterangepicker/jquery.daterangepicker',
            "moment": '../lib/daterangepicker/moment.min'
        },
        shim: {
            'mock': ['jquery'],
            'bootstrap': ['jquery'],
            'validate': ['jquery'],
            'validate-message': ['validate'],
            'slider': ['jquery'],
            'highcharts': ['jquery'],
            'daterangepicker': ['moment','jquery']
        }
    });
})(window);