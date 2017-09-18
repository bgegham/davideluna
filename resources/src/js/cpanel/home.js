$(document).ready(function () {

    var $homeContent = $("#homeContent");

    // old data
    $.ajax({
        type: 'GET',
        url: '/control/admin/home/json',
        success: function (data) {

            if(data.content.length == 0){
                $("<h2 id='emptyData' class='text-center'>Create first element</h2>").appendTo($homeContent);
                $("#saveFormJson").hide();
            } else {

                // console.log(data.content);

                var $repeatedData = data.content;
                $repeatedData.forEach(function (item) {
                    switch( item["node"]) {
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

                            var c    = $(
                                "<input name='eng' style='"+s1+"' value='"+ item.elements.valueHeader.en +"' placeholder='eng' class='form-control width-6 el-header' type='text'>" +
                                "<input name='rus' style='"+s1+"' value='"+ item.elements.valueHeader.ru +"' placeholder='rus' class='form-control width-6 el-header' type='text'>" +
                                "<textarea rows='4' style='"+s2+"' name='eng' placeholder='eng' class='form-control width-6'>"+ item.elements.valueMain.en +"</textarea>" +
                                "<textarea rows='4' style='"+s2+"' name='rus' placeholder='rus' class='form-control width-6'>"+ item.elements.valueMain.ru +"</textarea>"
                            );
                            var a = _actions("text-edit-mod");
                            a.appendTo(d);
                            c.appendTo(d);
                            d.appendTo($homeContent);
                            break;
                        case "hr":
                            var d  = $($("<div>"))
                                .addClass(item.className)
                                .attr("id", item.id)
                                .attr("data-layout", item.layout)
                                .attr("data-node", item.node)
                                .fadeIn( "fast" );
                            var a = _actions("text-line-mod");
                            var c    = $(
                                "<hr/>"
                            );
                            a.appendTo(d);
                            c.appendTo(d);
                            d.appendTo($homeContent);
                            break;
                        case "space":
                            var d  = $($("<div>"))
                                .addClass(item.className)
                                .attr("id", item.id)
                                .attr("data-layout", item.layout)
                                .attr("data-node", item.node)
                                .attr("data-height", item.styles.height)
                                .attr("style", "height:"+item.styles.height+"px")
                                .fadeIn( "fast" );
                            var a = _actions("divider-space-mod");
                            a.appendTo(d);
                            d.appendTo($homeContent);
                            break;
                        default:
                            break;
                    }
                });
                setTimeout(function () {
                    initSortable();
                }, 200);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            window.location.href = "/control/admin/oauth/login";
        }
    });


    var $edit_modal_text = $('#editModalText');
    var $edit_modal_dline = $('#editModalDivLine');
    var $edit_modal_dspace = $('#editModalDivSpace');

    var $addNewModalClose = function () {
        $('#addNew').modal('hide');
        initSortable();
    };
    $edit_modal_text.bind('hide', function () {
        initSortable();
    });
    var initSortable = function () {
        $( ".sortable-row" ).sortable({
            connectWith: ".sortable-row",
            handle: 'span.el-move'
        }).disableSelection();
        $("#emptyData").hide();
        $("#saveFormJson").show();
    };
    var $modalEditOpenText = function (targetLayoutId, refId, $asterisk, $bold, $alignment, $family) {
        $edit_modal_text.attr("data-toggle-col", refId);
        $edit_modal_text.find(targetLayoutId).click();
        if($asterisk == "false"){
            $edit_modal_text.find("#asteriskStatus").removeAttr('checked');
        } else {
            $edit_modal_text.find("#asteriskStatus").prop('checked',true);
        }
        $edit_modal_text.find("input[name='text-bold']").each(function( index ) {
            if($(this).val() == $bold){
                $(this).click();
            }
        });
        $edit_modal_text.find("input[name='text-alignment']").each(function( index ) {
            if($(this).val() == $alignment){
                $(this).click();
            }
        });
        $edit_modal_text.find("input[name='text-font-family']").each(function( index ) {
            if($(this).val() == $family){
                $(this).click();
            }
        });

        //
        $edit_modal_text.modal('show');
    };
    var $modalEditOpenDivLine = function (targetLayoutId, refId) {
        $edit_modal_dline.attr("data-toggle-col", refId);
        $edit_modal_dline.find(targetLayoutId).click();
        //
        $edit_modal_dline.modal('show');
    };
    var $modalEditOpenDivSpace = function (targetLayoutId, refId, height) {
        $edit_modal_dspace.attr("data-toggle-col", refId);
        $edit_modal_dspace.find(targetLayoutId).click();
        $edit_modal_dspace.find("#spaceHeight").val(height);
        //
        $edit_modal_dspace.modal('show');
    };

    var _actions = function (type) {
        return $("<div class='el-control-actions'>" +
            "<span class='fa fa-remove el-remove pull-right' title='Remove'></span>" +
            "<span class='fa fa-edit el-edit pull-right "+type+"' title='Edit'></span>" +
            "<span class='fa fa-arrows-alt el-move pull-right' title='Sort'></span>" +
            "</div>");
    };
    var setId = function () {
        // create random ID
        return "_id_"+Math.floor(Math.random() * 99541519984619999);
    };

    $(".element-text").bind("click", function () {

        var $newEl      = $("<div class='col-xs-12 el-create-sort' " +
            "data-layout='12' " +
            "data-asterisk='true' " +
            "data-bold='header' " +
            "data-alignment='left' " +
            "data-family='default' " +
            "data-node='text' " +
            "id='"+setId()+"'></div>");
        var $content    = $(
            "<input name='eng' placeholder='eng' class='form-control width-6 el-header' type='text'>" +
            "<input name='rus' placeholder='rus' class='form-control width-6 el-header' type='text'>" +
            "<textarea rows='4' name='eng' placeholder='eng' class='form-control width-6'></textarea>" +
            "<textarea rows='4' name='rus' placeholder='rus' class='form-control width-6'></textarea>"
        );
        var $actions = _actions("text-edit-mod");

        $actions.appendTo($newEl);
        $content.appendTo($newEl);
        $newEl.appendTo($homeContent);
        $addNewModalClose();
    });

    $(".element-divider").bind("click", function () {

        var $newEl      = $("<div class='col-xs-12 el-create-sort' " +
            "data-layout='12' " +
            "data-node='hr' " +
            "id='"+setId()+"'></div>");
        var $actions = _actions("divider-line-mod");
        var $content    = $(
            "<hr/>"
        );

        $actions.appendTo($newEl);
        $content.appendTo($newEl);
        $newEl.appendTo($homeContent);
        $addNewModalClose();
    });

    $(".element-space").bind("click", function () {

        var $newEl      = $("<div class='col-xs-12 el-create-sort' " +
            "data-layout='12' " +
            "data-height='50' " +
            "data-node='space' " +
            "id='"+setId()+"'></div>");
        var $actions = _actions("divider-space-mod");

        $actions.appendTo($newEl);
        $newEl.appendTo($homeContent);
        $addNewModalClose();
    });

    $(document).on("click", "span.text-edit-mod" ,  function(e) {
        e.preventDefault();
        var _this       = $(this),
            _ref        = _this.parents('div.el-create-sort');

        // layout
        var targetLayoutId = "#layout1";
        var targetLayout = _ref.attr("data-layout");
        if(targetLayout == '6') {
            targetLayoutId = "#layout2";
        }
        var refId = _ref.attr("id");
        // asterisk
        var $asterisk = "true";
        if(_ref.attr("data-asterisk") === 'false'){
            $asterisk = "false";
        }
        // text bold
        var $bold = "header";
        if(_ref.attr("data-bold") === 'all'){
            $bold = "all";
        }
        if(_ref.attr("data-bold") === 'none'){
            $bold = "none";
        }
        // text alignment
        var $alignment = "left";
        if(_ref.attr("data-alignment") === 'center'){
            $alignment = "center";
        }
        if(_ref.attr("data-alignment") === 'right'){
            $alignment = "right";
        }
        if(_ref.attr("data-alignment") === 'justify'){
            $alignment = "justify";
        }
        // font-family
        var $family = "default";
        if(_ref.attr("data-family") !== 'default'){
            $family = "custom";
        }

        $modalEditOpenText(targetLayoutId, refId, $asterisk, $bold, $alignment, $family);
    });
    $(document).on("click", "span.divider-line-mod" ,  function(e) {
        e.preventDefault();
        var _this       = $(this),
            _ref        = _this.parents('div.el-create-sort');

        // layout
        var targetLayoutId = ".layout1";
        var targetLayout = _ref.attr("data-layout");
        if(targetLayout == '6') {
            targetLayoutId = ".layout2";
        }
        var refId = _ref.attr("id");

        $modalEditOpenDivLine(targetLayoutId, refId);
    });
    $(document).on("click", "span.divider-space-mod" ,  function(e) {
        e.preventDefault();
        var _this       = $(this),
            _ref        = _this.parents('div.el-create-sort');

        // layout
        var targetLayoutId = ".layout1";
        var targetLayout = _ref.attr("data-layout");
        if(targetLayout == '6') {
            targetLayoutId = ".layout2";
        }

        var $_height = _ref.attr("data-height");
        var refId = _ref.attr("id");

        $modalEditOpenDivSpace(targetLayoutId, refId, $_height);
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
    $(document).on("change", "input#spaceHeight" ,  function(e) {
        var _this       = $(this),
            _ref        = _this.parents('div.modal').attr("data-toggle-col"),
            _value      = _this.val();

        var $ref = $("#"+_ref);
        $ref.css({
            "height" : _value + "px"
        });
        $ref.attr("data-height", _value);
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
        if(_value == "justify"){
            $ref.find(".form-control").css({
                "text-align" : "justify"
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

    $(document).on("click", "span.el-remove" ,  function(e) {
        e.preventDefault();
        if(confirm("Are you sure?")){
            $(this).parents(".el-create-sort").remove();
        }
    });

    // serialize and save
    $("#saveFormJson").bind("click", function (e) {
        e.preventDefault();
        var result = [];
        var _data = $homeContent.find(".el-create-sort");
        // console.log(_data);

        _data.each(function() {
            var _this = $(this);

            switch( _this.attr("data-node") ) {
                case "text":
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
                        elements    : {
                            valueHeader : {
                                en : _this.find("input[name='eng']").val(),
                                ru : _this.find("input[name='rus']").val(),
                            },
                            valueMain   : {
                                en : _this.find("textarea[name='eng']").val(),
                                ru : _this.find("textarea[name='rus']").val()
                            }
                        }
                    });
                    break;
                case "hr":
                    result.push({
                        node        : _this.attr("data-node"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        className   : _this.attr("class"),
                        styles      : null,
                        elements    : {
                            hr : "hr"
                        }
                    });
                    break;
                case "space":
                    result.push({
                        node        : _this.attr("data-node"),
                        id          : _this.attr("id"),
                        layout      : _this.attr("data-layout"),
                        className   : _this.attr("class"),
                        styles      : {
                            height  : _this.attr("data-height")
                        },
                        elements    : null
                    });
                    break;
                default:
                    break;
            }

        });

        // save on db
        setTimeout(function () {
            $.ajax({
                type: 'POST',
                url: '/control/admin/home',
                dataType: 'json',
                data: {
                    data : result
                },
                success: function () {
                    document.location.reload();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    document.location.reload();
                }
            });
        }, 100);

    });

});