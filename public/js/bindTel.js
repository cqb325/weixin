/**
 * Created by cqb32_000 on 2015-12-16.
 */
$(function(){
    $('#tel-input').on('focus',function(){
        showAndHide($(this));
    }).on('input',function(){
        var scope = this;
        window.setTimeout(function(){
            fillTelSpace($(scope));
        },1);
        inputMaxBlur($(this),13);
        showAndHide($(this));
    }).on('blur',function(){
        $('.del-input').addClass('hide');
        testTel($(this));
        submitBtn();
    });
    $('.del-input').on('mousedown',function(){
        clearInput($('#tel-input'));
        setTimeout(function(){
            $('#tel-input').focus();
        });
    }).on('touchstart',function(){
        clearInput($('#tel-input'));
        setTimeout(function(){
            $('#tel-input').focus();
        });
    });
    $('#code-input').on('input',function(){
        inputMaxBlur($(this),6);
    }).on('blur',function(){
        testCode($(this));
        submitBtn();
    });

//        $('#success-btn').on('click',function(){
//            wx.closeWindow();
//        });

    failBtn();

    $('.get-code').on('click',function(){
        var that = this;
        var tel = trimAll($('#tel-input')[0].value);
        if ($(this).hasClass('btn-disabled')) {
            return false;
        } else {
            if ($('#tel-input').data('validate') === true) {
                time($(that));
                $('#code-tip').html('');
                $(this).data('isClick',true);
            } else {
                if ($('#tel-input').val() === '') {
                    $('#tel-tip').css('color','red').html('请输入手机号码！');
                }
            }
        }
    });
    $('#submit-btn').on('click',function(){
//            var tel = $('#tel-input').val();
        var tel = trimAll($('#tel-input')[0].value);
        var code = $('#code-input').val();
        if ($('.get-code').data('isClick') === true) {
            $.ajax({
                url: ctx + '/common/bind.html',
                type: 'POST',
                dataType: 'json',
                data: {tel: tel,code: code},
                success: function(data) {
                    if (data.isUsed) {
                        $('#isUsed').modal('show');
                        $('#clear').on('click', function() {
                            window.location.reload();
                        });
                    } else {
                        if (data.bind) {
                            showDialogContent('success');
                        } else {
                            showDialogContent('failure');
                        }
                        $('#result-alert').modal('show');
                    }
                },
                error: function() {
                    showDialogContent('busy');
                    $('#result-alert').modal('show');
                }
            });
        } else {
            showDialogContent('failure');
            $('#result-alert').modal('show');
        }
    });
});

//验证手机号码
function testTel(ele) {
    var tel = trimAll(ele[0].value);
    var validate = false;
    if (!tel) {
        $('#tel-from').html('');
        $('#tel-tip').css('color','red').html('请输入手机号码！');
    } else if (/^1[3|4|5|7|8]\d{9}$/.test(tel)) {
        $('#tel-tip').css('color','#aaa').html('');
        validate = true;
    } else {
        $('#tel-from').html('');
        $('#tel-tip').css('color','red').html('请输入正确的手机号码！');
    }
    ele.data('validate', validate);
}
//手机号中加入空格
function fillTelSpace(ele) {
    var tel = trimAll(ele[0].value);
    if (tel !== '') {
        var telLength = tel.length;
        if (telLength <= 3) {
            ele[0].value = tel;
        } else if (telLength <= 7) {
            //tel.split("").splice(3," ").join("")
            ele[0].value = tel.substring(0, 3) + '-' + tel.substring(3, telLength);
        } else {
            ele[0].value = tel.substring(0, 3) + '-' + tel.substring(3, 7) + '-' + tel.substring(7, telLength);
        }
    }
}
//去除字符串中的所有空格
function trimAll(str) {
    return str.replace(/[-]/g,'');
}
//是否输入验证码
function testCode(ele) {
    var code = ele.val();
    var validate = false;
    if (!code) {
        $('#code-tip').css('color', 'red').html('请输入验证码！');
    } else if (/^[0-9]{6}$/.test(code)) {
        $('#code-tip').html('');
        validate = true;
    } else {
        $('#code-tip').css('color', 'red').html('验证码错误！');
    }
    ele.data('validate', validate);
}
//绑定按钮状态
function submitBtn() {
    var telvalidate = $('#tel-input').data('validate') === true;
    var codevalidate = $('#code-input').data('validate') === true;
    var btnvalidate = telvalidate && codevalidate;
    if (btnvalidate) {
        $('#submit-btn').removeClass('btn-disabled');
    } else {
        $('#submit-btn').addClass('btn-disabled');
    }
}
//输入字符数达到限制自动失去焦点
function inputMaxBlur(ele,num) {
    if (ele.val().length === num) {
        window.setTimeout(function(){
            ele.blur();
        },1);
    }
}
//清空按钮显示与隐藏
function showAndHide(ele) {
    if (ele.val() === '') {
        $('.del-input').addClass('hide');
    } else {
        $('.del-input').removeClass('hide');
    }
}
//清空输入框
function clearInput(ele) {
    ele.val('');
    $('#tel-from').html('');
    $('.del-input').addClass('hide');
}
//结果显示弹框
function showDialogContent(clazz) {
    $('#result-alert .modal-content').addClass('hide');
    $('.body-' + clazz).removeClass('hide');
}
//失败弹框按钮
function failBtn() {
    $('#fail-btn').on('click',function(){
        $('#code-input').val('');
        $('#code-input').data('validate','false');
        submitBtn();
    });
}
//倒计时
var timer;
var wait = 60;
function time(ele) {
    if (wait == 0) {
        clearTimeout(timer);
        ele.removeClass('btn-disabled');
        ele.html('重新发送验证码');
        wait = 60;
    } else {
        ele.addClass('btn-disabled');
        ele.html('重新获取'+'(' + wait + ')');
        wait--;
        timer = setTimeout(function(){
            time(ele);
        }, 1000);
    }
}