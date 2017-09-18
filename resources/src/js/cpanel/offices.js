$(document).ready(function () {

    // view
    $(".sortPriority").bind("click", function () {

        $( ".sortable" ).sortable({
            connectWith: ".office-sort"
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
            url: '/control/admin/offices/priority',
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

    $(".removeOffice").bind("click", function () {
        var id = $(this).attr("data-remove").replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/offices/remove',
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

    //add
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(input).parents(".custom-input-file").css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $(".change-file-input").change(function () {
        readURL(this);
    });

    $("#addClient").bind("click", function () {

        var _id =  $("#clientsControl").find(".client-on-line").length,
            d   = $("<div>")
                .addClass("row client-on-line"),
            d1   = $("<div>").addClass("col-xs-3"),
            d1l  = $("<label>").html("Name en").appendTo(d1),
            i   = $("<input>")
                .addClass("form-control")
                .attr("name", "client_name_en" )
                .attr("type", "text")
                .attr("placeholder", "English")
                .attr("required", "required")
                .appendTo(d1),
            d11   = $("<div>").addClass("col-xs-3"),
            d11l  = $("<label>").html("Name rus").appendTo(d11),
            i2  = $("<input>")
                .addClass("form-control")
                .attr("name", "client_name_ru" )
                .attr("type", "text")
                .attr("placeholder", "Русский")
                .attr("required", "required")
                .appendTo(d11),
            d2   = $("<div>").addClass("col-xs-3"),
            d2l  = $("<label>").html("Image file").appendTo(d2),
            d2m  = $("<div>").addClass("input-group").appendTo(d2),
            l   = $("<label>")
                .addClass("input-group-btn")
                .html("<span class='btn btn-primary'>Browse&hellip;<input name='client_image' class='client-image' required='required' type='file' style='display: none;'></span>")
                .appendTo(d2m),
            r   = $("<input>")
                .addClass("form-control nameShow")
                .attr("type", "text")
                .attr("readonly", "readonly")
                .appendTo(d2m),
            d3   = $("<div>").addClass("col-xs-3"),
            img = $("<img>")
                .addClass("image-show-clients")
                .appendTo(d3),
            b    = $("<button>")
                .attr("type", "button")
                .addClass("btn btn-xs btn-danger")
                .html("<i class='fa fa-remove'><i>")
                .appendTo(d3)
                .attr("style", "margin-left: 30px;margin-top: 18px")
                .click(function () {
                    $(this).parents("div.client-on-line").remove();
                }),
            bs    = $("<span>")
                .attr("type", "button")
                .addClass("btn btn-xs btn-info sort-clients")
                .html("<i class='fa fa-bars'><i>")
                .attr("style", "margin-left: 10px;margin-top: 18px;cursor:move;")
                .appendTo(d3);
        d1.appendTo(d);
        d11.appendTo(d);
        d2.appendTo(d);
        d3.appendTo(d);
        var oldId = $($("<input type='hidden' value='new' name='old_client_id'>"));
        oldId.appendTo(d);
        d.appendTo($("#clientsControl"));

        // ini sortable
        $( ".sortable-clients" ).sortable({
            connectWith: ".client-on-line",
            handle: 'span.sort-clients'
        }).disableSelection();
    });


    $(".remove-old-client").on("click", function () {
        var deleted_item = $(this).attr("data-client-id").replace(/\"/g, "");
        console.log(deleted_item);
        $("#editForm").append("<input type='hidden' name='client_remove' value='" + deleted_item + "'/>");
        $(this).parents("div.client-on-line").remove();
    });

    $(document).on('change', '.client-image', function() {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.parents("div.input-group").find("input.nameShow").val(label);
        imagesPreview(this, input.parents("div.client-on-line").find("img.image-show-clients"));
    });

    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;
            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    placeToInsertImagePreview.attr('src', event.target.result);
                };
                reader.readAsDataURL(input.files[i]);
            }
        }

    };
});