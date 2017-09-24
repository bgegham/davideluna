(function ($) {
    'use strict';
    $(document).ready(function () {
        console.log('%c DAVIDELUNA  ', 'color: #125286;font-weight:bold;');
    });
})(jQuery);


$(document).ready(function () {

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $(".hide-on-touch").hide();
    }

    //change lang
    $('.language').bind("click", function () {
        insertParam("lang", $(this).attr("data-lang"))
    });

    $('.filter-prt').bind('click', function () {
        insertParam("tag", $(this).attr("data-tag").replace(/\"/g, ""))
    });

    (function($) {
        $.fn.goTo = function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top -$('.nav-slider-container').height() + "px"
            }, 'fast');
            return this; // for chaining...
        }
    })(jQuery);
    // go to section
    if(getCookie('to_section') && getCookie('to_section') != 'false'){
        $('#'+getCookie('to_section')).goTo();
        document.cookie = 'to_section=' + 'false' + ';path=/;';
    }


    $("#sendOfficeEmail").bind("click", function (e) {
        e.stopPropagation();

        if(!$('#email').val()){
            $('#email').addClass("has-error");
        } else {
            $('#email').removeClass("has-error");
        }
        if(!$('#text').val()){
            $('#text').addClass("has-error");
        } else {
            $('#text').removeClass("has-error");
        }
        if(!$('#full_name').val()){
            $('#full_name').addClass("has-error");
        } else {
            $('#full_name').removeClass("has-error");
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/office-detail/send-email',
            data : {
                email : $('#email').val(),
                text  : $('#text').val(),
                full_name : $('#full_name').val()
            },
            success: function (data) {
                $('.office-form-error').hide();
                $('.office-form-success').show();
                $('#sendOfficeEmail').attr("disabled", true)
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.office-form-error').show();
                $('.office-form-success').hide();
            }
        });

    });
});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function insertParam(key, value){
    key = encodeURI(key); value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--)
{
    x = kvp[i].split('=');

    if (x[0]==key)
    {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
    }
}

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&');
}
