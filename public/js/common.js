/**
 * ajax请求数据
 * @param url
 * @param params
 * @param type
 * @param success
 */
function ajaxData(url, params, type, success){
    if(typeof type == 'function'){
        success = type;
        type = 'post';
    }
    type = type || 'post';

    $.ajax({
        url: url,
        dataType: 'json',
        type: type,
        data: params
    }).then(function(ret){
        if(success){
            success(ret);
        }
    });
}

/**
 * 显示提示信息
 */
function showTipDialog(msg){
    $("#tip-dialog .message-content").html(msg);
    $("#tip-dialog").modal("show");
}