function getParameterByName(t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var a=new RegExp("[\\?&]"+t+"=([^&#]*)"),e=a.exec(location.search);return null===e?"":decodeURIComponent(e[1].replace(/\+/g," "))}$(document).ready(function(){function t(t){if(t.files&&t.files[0]){var a=new FileReader;a.onload=function(a){var e=$(t).attr("data-preview");$("#img"+e).attr("src",a.target.result)},a.readAsDataURL(t.files[0])}}$(".page-name").find("span").html("Portfolio: EDIT ONE ROW");var a=$("#addNewRow"),e=$("#editModalText"),o=$("#editModalImage"),n=$("#editModalVideo");$.ajax({type:"GET",url:"/control/admin/portfolio/section/json/"+getParameterByName("rowId"),success:function(t){var e=t.content;e.forEach(function(t){switch(t.node){case"text":var e=$($("<div>")).addClass(t.className).attr("id",t.id).attr("data-layout",t.layout).attr("data-node",t.node).attr("data-asterisk",t.asterisk).attr("data-bold",t.styles.bold).attr("data-alignment",t.styles.textAlign).attr("data-family",t.styles.fontFamily).fadeIn("fast"),o="header"==t.styles.bold||"all"==t.styles.bold?600:100,n="all"==t.styles.bold?600:100,i="font-weight:"+o+";font-family:"+t.styles.fontFamily+";text-align:"+t.styles.textAlign+";",r="font-weight:"+n+";font-family:"+t.styles.fontFamily+";text-align:"+t.styles.textAlign+";",d=l("text-edit-mod");d.appendTo(e),t.elements.forEach(function(t){var a=$("<div class='data-rows-count'><input name='eng' style='"+i+"' value='"+t.valueHeader.en+"' placeholder='eng' class='form-control width-6 el-header' type='text'><input name='rus' style='"+i+"' value='"+t.valueHeader.ru+"' placeholder='rus' class='form-control width-6 el-header' type='text'><textarea rows='4' style='"+r+"' name='eng' placeholder='eng' class='form-control width-6'>"+t.valueMain.en+"</textarea><textarea rows='4' style='"+r+"' name='rus' placeholder='rus' class='form-control width-6'>"+t.valueMain.ru+"</textarea></div>");a.appendTo(e)}),e.appendTo(a);break;case"image":var e=$($("<div>")).addClass(t.className).attr("id",t.id).attr("data-layout",t.layout).attr("data-node",t.node).fadeIn("fast"),d=l("image-edit-mod"),s=$("<div class='clearfix'><label class='pull-left'>Select image:</label></div><div class='form-group'><div class='input-group'><span class='input-group-btn'><span class='btn btn-default btn-file row-image'> Browse&mldr;<input name='image' class='imageview_rowimg inputFile' value='/images/594ecd13dfbc73c810023d99' type='file' data-preview='"+t.id+"'></span></span><input class='form-control file-name' type='text' readonly=''/></div><img class='img-upload' id='img"+t.id+"' style='max-width: 100%;' src='/images/"+t.elements+"'/></div>");d.appendTo(e),s.appendTo(e),e.appendTo(a);break;case"video":var e=$($("<div>")).addClass(t.className).attr("id",t.id).attr("data-layout",t.layout).attr("data-node",t.node).fadeIn("fast"),d=l("video-edit-mod"),c="//img.youtube.com/vi/"+t.elements.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop()+"/0.jpg",s=$("<div class='clearfix col-xs-12'><label class='pull-left'>Select video src:</label></div><div class='col-xs-12'><input name='video' placeholder='video url http://...' class='form-control video-thumb' type='text'  value='"+t.elements+"' type='file' data-preview='"+t.id+"'><img class='video-demo' id='img"+t.id+"' style='max-width: 100%;' src="+c+" /></div>");d.appendTo(e),s.appendTo(e),e.appendTo(a)}}),setTimeout(function(){function t(t,a){var e=new XMLHttpRequest;e.onload=function(){var t=new FileReader;t.onloadend=function(){a(t.result)},t.readAsDataURL(e.response)},e.open("GET",t),e.responseType="blob",e.send()}$(".img-upload").each(function(){var a=$(this);t(a.attr("src"),function(t){a.attr("src",t)})}),r()},200)},error:function(){window.location.href="/control/admin/oauth/login"}});var l=function(t){return $("<div class='el-control-actions'><span class='fa fa-remove el-remove pull-right' title='Remove'></span><span class='fa fa-edit el-edit pull-right "+t+"' title='Edit'></span><span class='fa fa-arrows-alt el-move pull-right' title='Sort'></span></div>")},i=function(){return"_id_"+Math.floor(9954151998462e4*Math.random())},r=function(){$(".sortable-row").sortable({connectWith:".sortable-row",handle:"span.el-move"}).disableSelection(),$("#saveRowJson").show()},d=function(){$("#addElement").modal("hide"),r()};$(".element-text").on("click",function(){var t=$("<div class='col-xs-12 el-create-sort' data-layout='12' data-asterisk='true' data-bold='header' data-alignment='left' data-family='default' data-node='text' id='"+i()+"'></div>"),e=$("<div class='row-1 data-rows-count'><input name='eng' placeholder='eng' class='form-control width-6 el-header' type='text'><input name='rus' placeholder='rus' class='form-control width-6 el-header' type='text'><textarea rows='4' name='eng' placeholder='eng' class='form-control width-6'></textarea><textarea rows='4' name='rus' placeholder='rus' class='form-control width-6'></textarea></div>"),o=l("text-edit-mod");o.appendTo(t),e.appendTo(t),t.appendTo(a),d()});var s=function(t,a,o,n,l,i){e.attr("data-toggle-col",a),e.find(t).click(),"false"==o?e.find("#asteriskStatus").removeAttr("checked"):e.find("#asteriskStatus").prop("checked",!0),e.find("input[name='text-bold']").each(function(){$(this).val()==n&&$(this).click()}),e.find("input[name='text-alignment']").each(function(){$(this).val()==l&&$(this).click()}),e.find("input[name='text-font-family']").each(function(){$(this).val()==i&&$(this).click()}),e.modal("show")};$(document).on("click","span.text-edit-mod",function(t){t.preventDefault();var a=$(this),e=a.parents("div.el-create-sort"),o="#layout1",n=e.attr("data-layout");"6"==n&&(o="#layout2");var l=e.attr("id"),i="true";"false"===e.attr("data-asterisk")&&(i="false");var r="header";"all"===e.attr("data-bold")&&(r="all"),"none"===e.attr("data-bold")&&(r="none");var d="left";"center"===e.attr("data-alignment")&&(d="center"),"right"===e.attr("data-alignment")&&(d="right");var c="default";"default"!==e.attr("data-family")&&(c="custom"),s(o,l,i,r,d,c)}),$(document).on("click","label.layout-btn",function(t){t.preventDefault();var a=$(this),e=a.parents("div.modal").attr("data-toggle-col"),o=a.find("input").attr("data-class-name"),n=$("#"+e);n.attr("class",""),n.addClass(o+" col-xs-12 el-create-sort"),n.attr("data-layout",a.find("input").attr("value"))}),$(document).on("click","input#asteriskStatus",function(){var t=$(this),a=t.parents("div.modal").attr("data-toggle-col"),e=t.prop("checked"),o=$("#"+a);o.attr("data-asterisk",e)}),$(document).on("click","button#addtextRow",function(){var t=$(this),a=t.parents("div.modal").attr("data-toggle-col"),e=$("#"+a),o=e.find(".data-rows-count").length;if(3>o){var n=$("<div class='row-"+parseInt(o+1)+" data-rows-count'><input name='eng' placeholder='eng' class='form-control width-6 el-header' type='text'><input name='rus' placeholder='rus' class='form-control width-6 el-header' type='text'><textarea rows='4' name='eng' placeholder='eng' class='form-control width-6'></textarea><textarea rows='4' name='rus' placeholder='rus' class='form-control width-6'></textarea></div>");n.appendTo(e)}else t.attr("disabled")}),$(document).on("click","input[name='text-bold']",function(){var t=$(this),a=t.parents("div.modal").attr("data-toggle-col"),e=t.val(),o=$("#"+a);o.attr("data-bold",e),"header"==e&&(o.find("input.form-control").css({"font-weight":600}),o.find("textarea.form-control").css({"font-weight":100})),"all"==e&&(o.find("input.form-control").css({"font-weight":600}),o.find("textarea.form-control").css({"font-weight":600})),"none"==e&&(o.find("input.form-control").css({"font-weight":100}),o.find("textarea.form-control").css({"font-weight":100}))}),$(document).on("click","input[name='text-alignment']",function(){var t=$(this),a=t.parents("div.modal").attr("data-toggle-col"),e=t.val(),o=$("#"+a);o.attr("data-alignment",e),"left"==e&&o.find(".form-control").css({"text-align":"left"}),"center"==e&&o.find(".form-control").css({"text-align":"center"}),"right"==e&&o.find(".form-control").css({"text-align":"right"})}),$(document).on("click","input[name='text-font-family']",function(){var t=$(this),a=t.parents("div.modal").attr("data-toggle-col"),e=t.val(),o=$("#"+a);o.attr("data-family",e),"default"==e&&o.find("input.form-control").css({"font-family":""}),"custom"==e&&o.find("input.form-control").css({"font-family":"custom"})}),$(".element-image").on("click",function(){var t=i(),e=$("<div class='col-xs-12 el-create-sort' data-layout='12' data-node='image' id='"+t+"'></div>"),o=$("<div class='clearfix'><label class='pull-left'>Select image:</label></div><div class='form-group'><div class='input-group'><span class='input-group-btn'><span class='btn btn-default btn-file row-image'> Browse&mldr;<input name='image' id='asd' class='imageview_rowimg inputFile' type='file' data-preview='"+t+"'></span></span><input class='form-control file-name' type='text' readonly=''/></div><img class='img-upload' id='img"+t+"' style='max-width: 100%;' src='/img/cpanel/pictureDefault.png'/></div>"),n=l("image-edit-mod");n.appendTo(e),o.appendTo(e),e.appendTo(a),d()}),$(document).on("click","span.image-edit-mod",function(t){t.preventDefault();var a=$(this),e=a.parents("div.el-create-sort"),o="#layout3",n=e.attr("data-layout");"6"==n&&(o="#layout4");var l=e.attr("id");c(o,l)});var c=function(t,a){o.attr("data-toggle-col",a),o.find(t).click(),o.modal("show")};$(document).on("change",".imageview_rowimg",function(){t(this)}),$(document).on("change",".btn-file.row-image :file",function(t){var a=$(this),e=a.val().replace(/\\/g,"/").replace(/.*\//,"");a.trigger("fileSelect",[t,e]);var o=$(this).parents(".input-group").find(".file-name");o.val(e)}),$(document).on("click","span.el-remove",function(t){t.preventDefault(),confirm("Are you sure?")&&$(this).parents(".el-create-sort").remove()}),$("#_addElement").bind("click",function(){$("#addNewRow").find(".el-create-sort").length>=2?alert("Remember! You can create only 2 element in one row section..."):$("#addElement").modal("show")}),$(".element-video").on("click",function(){var t=i(),e=$("<div class='col-xs-12 el-create-sort' data-layout='12' data-node='video' id='"+t+"'></div>"),o=$("<div class='clearfix col-xs-12'><label class='pull-left'>Video url:</label></div><div class='col-xs-12'><input name='video' placeholder='video url http://...' class='form-control video-thumb' type='text' data-preview='"+t+"'><img class='video-demo' id='img"+t+"' style='max-width: 100%;' src='/img/cpanel/pictureDefault.png'/></div>"),n=l("video-edit-mod");n.appendTo(e),o.appendTo(e),e.appendTo(a),d()}),$(document).on("change",".video-thumb",function(){var t=$(this).val().match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();11==t.length&&$(".video-demo").attr("src","//img.youtube.com/vi/"+t+"/0.jpg")}),$(document).on("click","span.video-edit-mod",function(t){t.preventDefault();var a=$(this),e=a.parents("div.el-create-sort"),o="#layout5",n=e.attr("data-layout");"6"==n&&(o="#layout6");var l=e.attr("id");u(o,l)});var u=function(t,a){n.attr("data-toggle-col",a),n.find(t).click(),n.modal("show")};$("#saveRowEditJson").bind("click",function(t){t.preventDefault(),$(".loader-ajax").show();var a=[],e=$("#addNewRow").find(".el-create-sort");e.each(function(){var t=$(this);switch(t.attr("data-node")){case"image":a.push({node:t.attr("data-node"),className:t.attr("class"),id:t.attr("id"),layout:t.attr("data-layout"),elements:$("img#img"+t.attr("id")).attr("src")});break;case"text":var e=[];t.find(".data-rows-count").each(function(){e.push({valueHeader:{en:$(this).find("input[name='eng']").val(),ru:$(this).find("input[name='rus']").val()},valueMain:{en:$(this).find("textarea[name='eng']").val(),ru:$(this).find("textarea[name='rus']").val()}})}),a.push({node:t.attr("data-node"),className:t.attr("class"),id:t.attr("id"),layout:t.attr("data-layout"),asterisk:t.attr("data-asterisk"),styles:{bold:t.attr("data-bold"),textAlign:t.attr("data-alignment"),fontFamily:t.attr("data-family")},elements:e});break;case"video":a.push({node:t.attr("data-node"),className:t.attr("class"),id:t.attr("id"),layout:t.attr("data-layout"),elements:$("#"+t.attr("id")).find("input.video-thumb").val()})}}),setTimeout(function(){var t=$("input#prt_id").val().replace(/\"/g,"");$.ajax({type:"POST",url:"/control/admin/portfolio/edit/media/"+getParameterByName("rowId"),dataType:"json",data:{data:a,portId:t},success:function(){window.location.href="/control/admin/portfolio/edit?section=media&id="+t},error:function(){window.location.href="/control/admin/portfolio/edit?section=media&id="+t}})},500)})});