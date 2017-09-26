$(document).ready(function () {
    $(".page-name").find("span").html("Portfolio: ADD ROW");

    var $addNewRow          = $("#addNewRow");
    var $edit_modal_text    = $("#editModalText");
    var $edit_modal_image   = $("#editModalImage");
    var $edit_modal_video   = $("#editModalVideo");

    var _actions            = function (type) {
        return $("<div class='el-control-actions'>" +
            "<span class='fa fa-remove el-remove pull-right' title='Remove'></span>" +
            "<span class='fa fa-edit el-edit pull-right " + type + "' title='Edit'></span>" +
            "<span class='fa fa-arrows-alt el-move pull-right' title='Sort'></span>" +
            "</div>");
    };
    var setId               = function () {
        // create random ID
        return "_id_" + Math.floor(Math.random() * 99541519984619999);
    };
    var initSortable        = function () {
        $(".sortable-row").sortable({
            connectWith: ".sortable-row",
            handle: 'span.el-move'
        }).disableSelection();
        $("#saveRowJson").show();
    };

    var $addNewModalClose   = function () {
        $('#addElement').modal('hide');
        initSortable();
    };

    $(".element-text").on("click", function () {
        var $newEl = $("<div class='col-xs-12 el-create-sort' " +
            "data-layout='12' " +
            "data-asterisk='true' " +
            "data-bold='header' " +
            "data-alignment='left' " +
            "data-family='default' " +
            "data-node='text' " +
            "id='" + setId() + "'></div>");
        var $content = $(
            "<div class='row-1 data-rows-count'>" +
                "<input name='eng' placeholder='eng' class='form-control width-6 el-header' type='text'>" +
                "<input name='rus' placeholder='rus' class='form-control width-6 el-header' type='text'>" +
                "<textarea rows='4' name='eng' placeholder='eng' class='form-control width-6'></textarea>" +
                "<textarea rows='4' name='rus' placeholder='rus' class='form-control width-6'></textarea>" +
            "</div>"
        );
        var $actions = _actions("text-edit-mod");

        $actions.appendTo($newEl);
        $content.appendTo($newEl);
        $newEl.appendTo($addNewRow);
        $addNewModalClose();
    });
    var $modalEditOpenText = function (targetLayoutId, refId, $asterisk, $bold, $alignment, $family) {
        $edit_modal_text.attr("data-toggle-col", refId);
        $edit_modal_text.find(targetLayoutId).click();
        if ($asterisk == "false") {
            $edit_modal_text.find("#asteriskStatus").removeAttr('checked');
        } else {
            $edit_modal_text.find("#asteriskStatus").prop('checked', true);
        }
        $edit_modal_text.find("input[name='text-bold']").each(function (index) {
            if ($(this).val() == $bold) {
                $(this).click();
            }
        });
        $edit_modal_text.find("input[name='text-alignment']").each(function (index) {
            if ($(this).val() == $alignment) {
                $(this).click();
            }
        });
        $edit_modal_text.find("input[name='text-font-family']").each(function (index) {
            if ($(this).val() == $family) {
                $(this).click();
            }
        });

        //
        $edit_modal_text.modal('show');
    };

    $(document).on("click", "span.text-edit-mod", function (e) {
        e.preventDefault();
        var _this = $(this),
            _ref = _this.parents('div.el-create-sort');

        // layout
        var targetLayoutId = "#layout1";
        var targetLayout = _ref.attr("data-layout");
        if (targetLayout == '6') {
            targetLayoutId = "#layout2";
        }
        var refId = _ref.attr("id");
        // asterisk
        var $asterisk = "true";
        if (_ref.attr("data-asterisk") === 'false') {
            $asterisk = "false";
        }
        // text bold
        var $bold = "header";
        if (_ref.attr("data-bold") === 'all') {
            $bold = "all";
        }
        if (_ref.attr("data-bold") === 'none') {
            $bold = "none";
        }
        // text alignment
        var $alignment = "left";
        if (_ref.attr("data-alignment") === 'center') {
            $alignment = "center";
        }
        if (_ref.attr("data-alignment") === 'right') {
            $alignment = "right";
        }
        // font-family
        var $family = "default";
        if (_ref.attr("data-family") !== 'default') {
            $family = "custom";
        }

        $modalEditOpenText(targetLayoutId, refId, $asterisk, $bold, $alignment, $family);
    });
    $(document).on("click", "label.layout-btn" ,  function(e) {
        e.preventDefault();
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col"),
            _className  = _this.find('input').attr("data-class-name");

        var $ref = $("#"+_ref);
        $ref.attr('class','');
        $ref.addClass(_className + " col-xs-12 el-create-sort");
        $ref.attr( "data-layout", _this.find('input').attr("value"));
    });
    $(document).on("click", "input#asteriskStatus" ,  function(e) {
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col"),
            _value      = _this.prop("checked");

        var $ref = $("#"+_ref);
        $ref.attr("data-asterisk", _value);
    });
    $(document).on("click", "button#addtextRow" ,  function(e) {
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col");

        var $ref = $("#"+_ref);
        var c = $ref.find(".data-rows-count").length;
        if(c < 3){
            var $content = $(
                "<div class='row-"+parseInt(c+1)+" data-rows-count'>" +
                "<input name='eng' placeholder='eng' class='form-control width-6 el-header' type='text'>" +
                "<input name='rus' placeholder='rus' class='form-control width-6 el-header' type='text'>" +
                "<textarea rows='4' name='eng' placeholder='eng' class='form-control width-6'></textarea>" +
                "<textarea rows='4' name='rus' placeholder='rus' class='form-control width-6'></textarea>" +
                "</div>"
            );
            $content.appendTo($ref);

        } else {
            _this.attr("disabled")
        }
    });
    $(document).on("click", "input[name='text-bold']" ,  function(e) {
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col"),
            _value      = _this.val();

        var $ref = $("#"+_ref);
        $ref.attr("data-bold", _value);
        if(_value == "header"){
            $ref.find("input.form-control").css({
                "font-weight" : 600
            });
            $ref.find("textarea.form-control").css({
                "font-weight" : 100
            });
        }
        if(_value == "all"){
            $ref.find("input.form-control").css({
                "font-weight" : 600
            });
            $ref.find("textarea.form-control").css({
                "font-weight" : 600
            });
        }
        if(_value == "none"){
            $ref.find("input.form-control").css({
                "font-weight" : 100
            });
            $ref.find("textarea.form-control").css({
                "font-weight" : 100
            });
        }

    });
    $(document).on("click", "input[name='text-alignment']" ,  function(e) {
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col"),
            _value      = _this.val();

        var $ref = $("#"+_ref);
        $ref.attr("data-alignment", _value);
        if(_value == "left"){
            $ref.find(".form-control").css({
                "text-align" : "left"
            });
        }
        if(_value == "center"){
            $ref.find(".form-control").css({
                "text-align" : "center"
            });
        }
        if(_value == "right"){
            $ref.find(".form-control").css({
                "text-align" : "right"
            });
        }

    });
    $(document).on("click", "input[name='text-font-family']" ,  function(e) {
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col"),
            _value      = _this.val();

        var $ref = $("#"+_ref);
        $ref.attr("data-family", _value);
        if(_value == "default"){
            $ref.find("input.form-control").css({
                "font-family" : ""
            });
        }
        if(_value == "custom"){
            $ref.find("input.form-control").css({
                "font-family" : "custom"
            });
        }

    });

    $(".element-image").on("click", function () {
        var $id = setId();
        var $newEl = $("<div class='col-xs-12 el-create-sort' " +
            "data-layout='12' " +
            "data-node='image' " +
            "id='" + $id + "'></div>");
        var $content = $(
            "<div class='clearfix'>" +
            "<label class='pull-left'>Select image:</label>" +
            "</div>" +
            "<div class='form-group'>" +
                "<div class='input-group'>" +
                    "<span class='input-group-btn'>" +
                        "<span class='btn btn-default btn-file row-image'> Browse&mldr;" +
                            "<input name='image' class='imageview_rowimg inputFile' type='file' data-preview='"+$id+"'>" +
                        "</span>" +
                    "</span>" +
                    "<input class='form-control file-name' type='text' readonly=''/>" +
                "</div>" +
                "<img class='img-upload' id='img"+$id+"' style='max-width: 100%;' src='/img/cpanel/pictureDefault.png'/>"+
            "</div>"
        );
        var $actions = _actions("image-edit-mod");

        $actions.appendTo($newEl);
        $content.appendTo($newEl);
        $newEl.appendTo($addNewRow);
        $addNewModalClose();
    });
    $(document).on("click", "span.image-edit-mod" ,  function(e) {
        e.preventDefault();
        var _this       = $(this),
            _ref        = _this.parents('div.el-create-sort');

        // layout
        var targetLayoutId = ".layout3";
        var targetLayout = _ref.attr("data-layout");
        if(targetLayout == '6') {
            targetLayoutId = ".layout4";
        }
        var refId = _ref.attr("id");

        $modalEditOpenImage(targetLayoutId, refId);
    });
    var $modalEditOpenImage = function (targetLayoutId, refId) {
        $edit_modal_image.attr("data-toggle-col", refId);
        $edit_modal_image.find(targetLayoutId).click();
        //
        $edit_modal_image.modal('show');
    };

    $(document).on("change", ".imageview_rowimg", function () {
        readURLROWimg(this);
    });
    $(document).on('change', '.btn-file.row-image :file', function (e) {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileSelect', [e,label]);

        var inputName = $(this).parents('.input-group').find('.file-name');
        inputName.val(label)
    });

    function readURLROWimg(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _id = $(input).attr("data-preview");
                $('#img'+_id).attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(document).on("click", "span.el-remove" ,  function(e) {
        e.preventDefault();
        if(confirm("Are you sure?")){
            $(this).parents(".el-create-sort").remove();
        }
    });

    $(".element-video").on("click", function () {
        var $id = setId();
        var $newEl = $("<div class='col-xs-12 el-create-sort' " +
            "data-layout='12' " +
            "data-node='video' " +
            "id='" + $id + "'></div>");
        var $content = $(
            "<div class='clearfix col-xs-12'>" +
            "<label class='pull-left'>Video url:</label>" +
            "</div>" +
            "<div class='col-xs-12'>" +
            "<input name='video' placeholder='video url http://...' class='form-control video-thumb' type='text' data-preview='"+$id+"'>" +
            "<img class='video-demo' id='img"+$id+"' style='max-width: 100%;' src='/img/cpanel/pictureDefault.png'/>"+
            "</div>"
        );
        var $actions = _actions("video-edit-mod");

        $actions.appendTo($newEl);
        $content.appendTo($newEl);
        $newEl.appendTo($addNewRow);
        $addNewModalClose();
    });
    $(document).on("change", ".video-thumb",  function () {
        var youtube_video_id = $(this).val().match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        if (youtube_video_id.length == 11) {
            $(".video-demo").attr("src", "//img.youtube.com/vi/"+youtube_video_id+"/0.jpg");
        }
    });
    $(document).on("click", "span.video-edit-mod", function (e) {
        e.preventDefault();
        var _this = $(this),
            _ref = _this.parents('div.el-create-sort');

        // layout
        var targetLayoutId = "#layout5";
        var targetLayout = _ref.attr("data-layout");
        if (targetLayout == '6') {
            targetLayoutId = "#layout6";
        }
        var refId = _ref.attr("id");

        $modalEditOpenVideo(targetLayoutId, refId);
    });
    var $modalEditOpenVideo = function (targetLayoutId, refId) {
        $edit_modal_video.attr("data-toggle-col", refId);
        $edit_modal_video.find(targetLayoutId).click();
        //
        $edit_modal_video.modal('show');
    };



    $("#_addElement").bind("click", function () {
        if( $("#addNewRow").find(".el-create-sort").length >= 2 ){
            alert("Remember! You can create only 2 element in one row section...")
        } else {
            $('#addElement').modal('show');
        }
    });
    // serialize and save
    $("#saveRowJson").bind("click", function (e) {
        e.preventDefault();
        $(".loader-ajax").show();
        var result  = [];
        var _data = $("#addNewRow").find(".el-create-sort");

        _data.each(function() {
            var _this = $(this);

            switch( _this.attr("data-node") ) {
                case "text":
                    var _elements = [];
                    _this.find(".data-rows-count").each(function () {
                        _elements.push({
                            valueHeader : {
                                en : $(this).find("input[name='eng']").val(),
                                ru : $(this).find("input[name='rus']").val()
                            },
                            valueMain   : {
                                en : $(this).find("textarea[name='eng']").val(),
                                ru : $(this).find("textarea[name='rus']").val()
                            }
                        });
                    });
                    result.push({
                        node        : _this.attr("data-node"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        className   : _this.attr("class"),
                        asterisk    : _this.attr("data-asterisk"),
                        styles      : {
                            bold        : _this.attr("data-bold"),
                            textAlign   : _this.attr("data-alignment"),
                            fontFamily  : _this.attr("data-family")
                        },
                        elements    : _elements
                    });
                    break;
                case "image":
                    result.push({
                        node        : _this.attr("data-node"),
                        className   : _this.attr("class"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        elements    : $("img#img"+_this.attr("id")).attr("src")
                    });
                    break;
                case "video":
                    var lnk = $("#"+_this.attr("id")).find("input.video-thumb").val();
                    result.push({
                        node        : _this.attr("data-node"),
                        className   : _this.attr("class"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        elements    : (lnk && lnk!=null && lnk!=undefined && lnk!='undefined') ? lnk : "http://none"
                    });
                    break;
                default:
                    break;
            }

        });

        // save on db
        setTimeout(function () {
            var prt_id = $("input#prt_id").val().replace(/\"/g, "");

            $.ajax({
                type: 'POST',
                url: '/control/admin/portfolio/add/media/'+prt_id,
                dataType: 'json',
                data: {
                    data : result
                },
                success: function () {
                    window.location.href = "/control/admin/portfolio/edit?section=media&id="+prt_id
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    window.location.href = "/control/admin/portfolio/edit?section=media&id="+prt_id
                }
            });
        }, 500);

    });
    // open modal default
    $('#addElement').modal('show');
});

