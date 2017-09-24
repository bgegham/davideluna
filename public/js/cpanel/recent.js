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
        var sortCashe = $(".sortable").find("div.item-sort[data-priority]");

        $.each(sortCashe, function (index, item) {
            _data.push($(item).attr('data-priority').replace(/\"/g, ""));
        });

        $.ajax({
            type: 'POST',
            url: '/control/admin/recent/priority',
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

    $(".removeRecent").bind("click", function () {
        var id = $(this).attr("data-remove").replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/recent/remove',
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