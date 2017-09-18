$(document).ready(function () {

    /**
     * view
     */
    $(".morePortfolio").bind("click", function () {

       $(".portfolio-more-control").hide();
       var _this = this;
        $(".morePortfolio").removeClass('active');
       $(_this).addClass('active');
       setTimeout(function () {
           $("#more_"+$(_this).attr("data-more").replace(/\"/g, "")).show();
       }, 100);
    });

    /**
     * sort
     */
    $(".sortPriority").bind("click", function () {

        $( ".sortable" ).sortable({
            connectWith: ".item-sort"
        }).disableSelection();

        $(this).hide();
        $(".savePriority").show();
    });
    $(".savePriority").show();
    $(".savePriority").bind("click", function () {

        var _data = [];
        var sortCashe = $(".gridster ul").find("li[data-priority]");

        $.each(sortCashe, function (index, item) {
            _data.push({
                priority : $(item).attr('data-priority').replace(/\"/g, ""),
                data_sizey : parseInt($(item).attr('data-sizey')),
                data_sizex : parseInt($(item).attr('data-sizex')),
                data_col : parseInt($(item).attr('data-col')),
                data_row : parseInt($(item).attr('data-row')),
            });
        });


        $.ajax({
            type: 'POST',
            url: '/control/admin/portfolio/priority',
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


    /**
    * publish | unpublish
    */
    $(".publishPortfolio").bind("click", function () {
        if(confirm("Are you sure?")){
            var p_id = $(this).attr('data-publish').replace(/\"/g, "");
            $.ajax({
                type: 'POST',
                url: '/control/admin/portfolio/publish',
                dataType: 'json',
                data: {
                    id : p_id
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
    $(".unpublishPortfolio").bind("click", function () {
        if(confirm("Are you sure?")){
            var p_id = $(this).attr('data-unpublish').replace(/\"/g, "");
            $.ajax({
                type: 'POST',
                url: '/control/admin/portfolio/unpublish',
                dataType: 'json',
                data: {
                    id : p_id
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

    /**
     * edit | meta data
     */
    $("#metaImagePath").change(function () {
        readURL(this);
    });
    $("#metaImagePath1").change(function () {
        readURL(this);
    });
    $("#metaImagePath2").change(function () {
        readURL(this);
    });
    $(document).on('change', '.btn-file.meta-image :file', function () {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });
    $('.btn-file.meta-image :file').on('fileselect', function (event, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = label;
        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });


    /**
     * add | top slider
     */
    function readURLtpadd(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.custom-input-file.tpadd').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageview_tpadd").change(function () {
        readURLtpadd(this);
    });
    $("input.tpadd[name='layout']").bind("click", function () {
        if($(this).val() == "image"){
            $("#imageview_tpadd").attr("required", "required");
            $("#videourl_tpadd").removeAttr("required");
        } else {
            $("#imageview_tpadd").removeAttr("required");
            $("#videourl_tpadd").attr("required", "required");
        }
    });

    /**
     * sort | top slider
     */
    $(".sortPriorityTP").bind("click", function () {
        $( ".sortable" ).sortable({
            connectWith: ".banners-sort",
            placeholder: "ui-state-highlight"
        }).disableSelection();

        $(this).hide();
        $(".savePriorityTP").show();
    });
    $(".savePriorityTP").bind("click", function () {

        var prt_id = $("input#prt_id").val().replace(/\"/g, "");
        var _data = [];
        var sortCache = $(".sortable").find("div[data-priority]");
        $.each(sortCache, function (index, item) {
            _data.push($(item).attr('data-priority').replace(/\"/g, ""));
        });

        $.ajax({
            type: 'POST',
            url: '/control/admin/portfolio/sort/topsleder/'+prt_id,
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

    /**
    *  edit | top slider
    */
    function readURLTPEDIT(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(input).parents("div.tpedit").css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $(".imageview_etp").change(function () {
        readURLTPEDIT(this);
    });
    $("input.speditLay[name='layout']").bind("click", function () {
        if ($(this).val() == "image") {
            $("#videourlTPEDIT").removeAttr("required");
        } else {
            $("#videourlTPEDIT").attr("required", "required");
        }
    });

    /**
     *  remove | top slider
     */
    $(".removeSliderItem").bind("click", function () {
        var id      = $(this).attr("data-remove").replace(/\"/g, "");
        var workID  = $("input#prt_id").val().replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/portfolio/del/topsleder/'+workID,
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

    /**
     * general func
     */
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _id = $(input).attr("data-preview");
                $('#'+_id).attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }


    /**
     * sort sections portfolio
     */
    $(".sortRowPort").bind("click", function () {
        $( ".sortable" ).sortable({
            connectWith: ".single-row-port-view",
            placeholder: "ui-state-highlight-row"
        }).disableSelection();

        $(this).hide();
        $(".saveRowPort").show();
    });
    $(".saveRowPort").bind("click", function () {

        var prt_id = $("input#prt_id").val().replace(/\"/g, "");
        var _data = [];
        var sortCache = $(".sortable").find("div[data-priority]");
        $.each(sortCache, function (index, item) {
            _data.push($(item).attr('data-priority').replace(/\"/g, ""));
        });

        $.ajax({
            type: 'POST',
            url: '/control/admin/portfolio/sort/sections/'+prt_id,
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

    /**
     *  remove | row section
     */
    $(".removeRowSection").bind("click", function () {
        var id      = $(this).attr("data-remove").replace(/\"/g, "");
        var workID  = $("input#prt_id").val().replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/portfolio/del/sections/'+workID,
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