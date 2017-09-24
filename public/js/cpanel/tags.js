$(document).ready(function () {

    $(".sortPriority").bind("click", function () {

        $( ".sortable" ).sortable({
            connectWith: ".item-sort"
        }).disableSelection();

        $(this).hide();
        $(".savePriority").show();
    });

    $(".savePriority").bind("click", function () {

        var _data = [];
        var sortCashe = $(".sortable").find("div[data-priority]");
        $.each(sortCashe, function (index, item) {
            _data.push($(item).attr('data-priority').replace(/\"/g, ""));
        });

        $.ajax({
            type: 'POST',
            url: '/control/admin/tags/priority',
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

        $(this).hide();
        $(".sortPriority").show();
    });

    $(".removeTag").bind("click", function () {
        var id = $(this).attr("data-remove").replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/tags/remove',
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