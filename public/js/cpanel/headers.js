$(document).ready(function () {

    $(".sortPriority").bind("click", function () {

        $( ".sortable" ).sortable({
            connectWith: ".banners-sort"
        }).disableSelection();

        $(this).hide();
        $(".savePriority").show();
    });

    $(".savePriority").bind("click", function () {

        var _data = [];
        var sortCache = $(".sortable").find("div[data-priority]");
        $.each(sortCache, function (index, item) {
            _data.push($(item).attr('data-priority').replace(/\"/g, ""));
        });

        $.ajax({
            type: 'POST',
            url: '/control/admin/headers/priority',
            dataType: 'json',
            data: {
                priority : _data
            },
            success: function () {
                document.location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                document.location.reload();
            }
        });

        $(this).addClass("disabled");
    });

    $(".removeHeader").bind("click", function () {
        var id = $(this).attr("data-remove").replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/headers/remove',
                dataType: 'json',
                data: {
                    id : id
                },
                success: function () {
                    document.location.reload();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    document.location.reload();
                }
            });
        }
    });

});