$(document).ready(function(){

    var working = false;
    $('.login').on('submit', function(e) {
        e.preventDefault();
        if (working) return;
        working = true;
        var $this = $(this),
            $state = $this.find('button > .state');
        $this.addClass('loading');
        $state.html('Authenticating');

        $.ajax({
            type: 'POST',
            url: '/control/admin/oauth/login',
            data: {
                username:     $('#username').val(),
                password:     $('#password').val()
            },
            success: function (data) {
                setTimeout(function() {
                    $this.addClass('ok');
                    $state.html('Welcome!');
                    setTimeout(function () {
                        document.location.href = data.url;
                    }, 1000);
                }, 1000);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                setTimeout(function() {
                    $this.addClass('nok');
                    $this.find(".spinner").html("<i class='fa fa-remove fa-4x'></i>");
                    $state.html(JSON.parse(XMLHttpRequest.responseText).errors);
                    working = false;
                    $('#username').val("");
                    $('#password').val("");
                }, 1000);
                setTimeout(function() {
                    $state.html('Log in');
                    $this.find(".spinner").html("");
                    $this.removeClass('ok nok loading');
                }, 2500);
            }
        });


    });

});