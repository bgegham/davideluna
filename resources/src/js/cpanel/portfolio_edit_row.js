function getParameterByName(name) {
    name    = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex   = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {

    $(".page-name").find("span").html("Portfolio: EDIT ONE ROW");

    var $addNewRow          = $("#addNewRow");
    var $edit_modal_text    = $("#editModalText");
    var $edit_modal_image   = $("#editModalImage");
    var $edit_modal_video   = $("#editModalVideo");

    // old data
    $.ajax({
        type: 'GET',
        url: '/control/admin/portfolio/section/json/'+ getParameterByName('rowId'),
        success: function (data) {

                var $repeatedData = data.content;

                $repeatedData.forEach(function (item) {

                    switch( item["node"] ) {
                        case "text":
                            var d  = $($("<div>"))
                                .addClass(item.className)
                                .attr("id", item.id)
                                .attr("data-layout", item.layout)
                                .attr("data-node", item.node)
                                .attr("data-asterisk", item.asterisk)
                                .attr("data-bold", item.styles.bold)
                                .attr("data-alignment", item.styles.textAlign)
                                .attr("data-family", item.styles.fontFamily)
                                .fadeIn( "fast" );
                            var fw1 = (item.styles.bold == "header" || item.styles.bold == "all") ? 600 : 100;
                            var fw2 = (item.styles.bold == "all") ? 600 : 100;

                            var s1 = "font-weight:"+fw1+";font-family:"+item.styles.fontFamily+";text-align:"+item.styles.textAlign+";";
                            var s2 = "font-weight:"+fw2+";font-family:"+item.styles.fontFamily+";text-align:"+item.styles.textAlign+";";


                            var a = _actions("text-edit-mod");
                            a.appendTo(d);


                            item.elements.forEach(function (el_) {
                                var c = $(
                                    "<div class='data-rows-count'>" +
                                    "<input name='eng' style='"+s1+"' value='"+ el_.valueHeader.en +"' placeholder='eng' class='form-control width-6 el-header' type='text'>" +
                                    "<input name='rus' style='"+s1+"' value='"+ el_.valueHeader.ru +"' placeholder='rus' class='form-control width-6 el-header' type='text'>" +
                                    "<textarea rows='4' style='"+s2+"' name='eng' placeholder='eng' class='form-control width-6'>"+ el_.valueMain.en +"</textarea>" +
                                    "<textarea rows='4' style='"+s2+"' name='rus' placeholder='rus' class='form-control width-6'>"+ el_.valueMain.ru +"</textarea>" +
                                    "</div>"
                                );
                                c.appendTo(d);
                            });

                            d.appendTo($addNewRow);
                            break;
                        case "image":
                            var d  = $($("<div>"))
                                .addClass(item.className)
                                .attr("id", item.id)
                                .attr("data-layout", item.layout)
                                .attr("data-node", item.node)
                                .fadeIn( "fast" );
                            var a = _actions("image-edit-mod");

                            var c = $(
                                "<div class='clearfix'>" +
                                "<label class='pull-left'>Select image:</label>" +
                                "</div>" +
                                "<div class='form-group'>" +
                                "<div class='input-group'>" +
                                "<span class='input-group-btn'>" +
                                "<span class='btn btn-default btn-file row-image'> Browse&mldr;" +
                                "<input name='image' class='imageview_rowimg inputFile' value='/images/594ecd13dfbc73c810023d99' type='file' data-preview='"+item.id+"'>" +
                                "</span>" +
                                "</span>" +
                                "<input class='form-control file-name' type='text' readonly=''/>" +
                                "</div>" +
                                "<img class='img-upload' id='img"+item.id+"' style='max-width: 100%;' src='/images/"+item.elements+"'/>"+
                                "</div>"
                            );

                            a.appendTo(d);
                            c.appendTo(d);
                            d.appendTo($addNewRow);
                            break;
                        case "video":
                            var d  = $($("<div>"))
                                .addClass(item.className)
                                .attr("id", item.id)
                                .attr("data-layout", item.layout)
                                .attr("data-node", item.node)
                                .fadeIn( "fast" );
                            var a = _actions("video-edit-mod");

                            var _srcVideo = '//img.youtube.com/vi/'+item.elements.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop() + '/0.jpg';
                            var c = $(
                                "<div class='clearfix col-xs-12'>" +
                                "<label class='pull-left'>Select video src:</label>" +
                                "</div>" +
                                "<div class='col-xs-12'>" +
                                "<input name='video' placeholder='video url http://...' class='form-control video-thumb' type='text'  value='"+item.elements+"' type='file' data-preview='"+item.id+"'>" +
                                "<img class='video-demo' id='img"+item.id+"' style='max-width: 100%;' src="+_srcVideo+" />"+
                                "</div>"
                            );

                            a.appendTo(d);
                            c.appendTo(d);
                            d.appendTo($addNewRow);
                            break;
                        default:
                            break;
                    }
                });
                setTimeout(function () {
                    $(".img-upload").each( function() {
                        var _this = $(this);
                        toDataURLB64(_this.attr('src'), function(dataUrl) {
                            _this.attr('src', dataUrl);
                        });
                    });
                    function toDataURLB64(url, callback) {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function() {
                            var reader = new FileReader();
                            reader.onloadend = function() {
                                callback(reader.result);
                            }
                            reader.readAsDataURL(xhr.response);
                        };
                        xhr.open('GET', url);
                        xhr.responseType = 'blob';
                        xhr.send();
                    }

                    initSortable();
                }, 200);


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            window.location.href = "/control/admin/oauth/login";
        }
    });

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
            "<input name='image' id='asd' class='imageview_rowimg inputFile' type='file' data-preview='"+$id+"'>" +
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
        var targetLayoutId = "#layout3";
        var targetLayout = _ref.attr("data-layout");
        if(targetLayout == '6') {
            targetLayoutId = "#layout4";
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

    $("#_addElement").bind("click", function () {
        if( $("#addNewRow").find(".el-create-sort").length >= 2 ){
            alert("Remember! You can create only 2 element in one row section...")
        } else {
            $('#addElement').modal('show');
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
            "<input name='video' value='' placeholder='video url http://...' class='form-control video-thumb' type='text' data-preview='"+$id+"'>" +
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

    // serialize and save
    $("#saveRowEditJson").bind("click", function (e) {
        e.preventDefault();
        $(".loader-ajax").show();
        var result  = [];
        var _data = $("#addNewRow").find(".el-create-sort");

        _data.each(function() {
            var _this = $(this);

            switch( _this.attr("data-node") ) {
                case "image":
                    result.push({
                        node        : _this.attr("data-node"),
                        className   : _this.attr("class"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        elements    : $("img#img"+_this.attr("id")).attr("src")
                    });
                    break;
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
                        className   : _this.attr("class"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        asterisk    : _this.attr("data-asterisk"),
                        styles      : {
                            bold        : _this.attr("data-bold"),
                            textAlign   : _this.attr("data-alignment"),
                            fontFamily  : _this.attr("data-family")
                        },
                        elements    : _elements
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
            var workID  = $("input#prt_id").val().replace(/\"/g, "");
            $.ajax({
                type: 'POST',
                url: '/control/admin/portfolio/edit/media/'+getParameterByName('rowId'),
                dataType: 'json',
                data: {
                    data : result,
                    portId : workID
                },
                success: function () {
                    window.location.href = '/control/admin/portfolio/edit?section=media&id='+workID
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    window.location.href = '/control/admin/portfolio/edit?section=media&id='+workID
                }
            });
        }, 500);

    });

});

