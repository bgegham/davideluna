$(document).ready(function(){function t(t){if(t.files&&t.files[0]){var e=new FileReader;e.onload=function(t){$(".custom-input-file.tpadd").css("background-image","url("+t.target.result+")")},e.readAsDataURL(t.files[0])}}function e(t){if(t.files&&t.files[0]){var e=new FileReader;e.onload=function(e){$(t).parents("div.tpedit").css("background-image","url("+e.target.result+")")},e.readAsDataURL(t.files[0])}}function i(t){if(t.files&&t.files[0]){var e=new FileReader;e.onload=function(e){var i=$(t).attr("data-preview");$("#"+i).attr("src",e.target.result)},e.readAsDataURL(t.files[0])}}$(".morePortfolio").bind("click",function(){$(".portfolio-more-control").hide();var t=this;$(".morePortfolio").removeClass("active"),$(t).addClass("active"),setTimeout(function(){$("#more_"+$(t).attr("data-more").replace(/\"/g,"")).show()},100)}),$(".sortPriority").bind("click",function(){$(".sortable").sortable({connectWith:".item-sort"}).disableSelection(),$(this).hide(),$(".savePriority").show()}),$(".savePriority").show(),$(".savePriority").bind("click",function(){var t=[],e=$(".gridster ul").find("li[data-priority]");$.each(e,function(e,i){t.push({priority:$(i).attr("data-priority").replace(/\"/g,""),data_sizey:parseInt($(i).attr("data-sizey")),data_sizex:parseInt($(i).attr("data-sizex")),data_col:parseInt($(i).attr("data-col")),data_row:parseInt($(i).attr("data-row"))})}),$.ajax({type:"POST",url:"/control/admin/portfolio/priority",dataType:"json",data:{priority:t},success:function(){document.location.reload()},error:function(){document.location.reload()}}),$(this).hide(),$(".sortPriority").show()}),$(".publishPortfolio").bind("click",function(){if(confirm("Are you sure?")){var t=$(this).attr("data-publish").replace(/\"/g,"");$.ajax({type:"POST",url:"/control/admin/portfolio/publish",dataType:"json",data:{id:t},success:function(){document.location.reload()},error:function(){document.location.reload()}})}}),$(".unpublishPortfolio").bind("click",function(){if(confirm("Are you sure?")){var t=$(this).attr("data-unpublish").replace(/\"/g,"");$.ajax({type:"POST",url:"/control/admin/portfolio/unpublish",dataType:"json",data:{id:t},success:function(){document.location.reload()},error:function(){document.location.reload()}})}}),$("#metaImagePath").change(function(){i(this)}),$("#metaImagePath1").change(function(){i(this)}),$("#metaImagePath2").change(function(){i(this)}),$(document).on("change",".btn-file.meta-image :file",function(){var t=$(this),e=t.val().replace(/\\/g,"/").replace(/.*\//,"");t.trigger("fileselect",[e])}),$(".btn-file.meta-image :file").on("fileselect",function(t,e){var i=$(this).parents(".input-group").find(":text"),o=e;i.length?i.val(o):o&&alert(o)}),$("#imageview_tpadd").change(function(){t(this)}),$("input.tpadd[name='layout']").bind("click",function(){"image"==$(this).val()?($("#imageview_tpadd").attr("required","required"),$("#videourl_tpadd").removeAttr("required")):($("#imageview_tpadd").removeAttr("required"),$("#videourl_tpadd").attr("required","required"))}),$(".sortPriorityTP").bind("click",function(){$(".sortable").sortable({connectWith:".banners-sort",placeholder:"ui-state-highlight"}).disableSelection(),$(this).hide(),$(".savePriorityTP").show()}),$(".savePriorityTP").bind("click",function(){var t=$("input#prt_id").val().replace(/\"/g,""),e=[],i=$(".sortable").find("div[data-priority]");$.each(i,function(t,i){e.push($(i).attr("data-priority").replace(/\"/g,""))}),$.ajax({type:"POST",url:"/control/admin/portfolio/sort/topsleder/"+t,dataType:"json",data:{priority:e},success:function(){document.location.reload()},error:function(){document.location.reload()}}),$(this).addClass("disabled")}),$(".imageview_etp").change(function(){e(this)}),$("input.speditLay[name='layout']").bind("click",function(){"image"==$(this).val()?$("#videourlTPEDIT").removeAttr("required"):$("#videourlTPEDIT").attr("required","required")}),$(".removeSliderItem").bind("click",function(){var t=$(this).attr("data-remove").replace(/\"/g,""),e=$("input#prt_id").val().replace(/\"/g,"");t&&confirm("Are you sure?")&&$.ajax({type:"POST",url:"/control/admin/portfolio/del/topsleder/"+e,dataType:"json",data:{id:t},success:function(){document.location.reload()},error:function(){document.location.reload()}})}),$(".sortRowPort").bind("click",function(){$(".sortable").sortable({connectWith:".single-row-port-view",placeholder:"ui-state-highlight-row"}).disableSelection(),$(this).hide(),$(".saveRowPort").show()}),$(".saveRowPort").bind("click",function(){var t=$("input#prt_id").val().replace(/\"/g,""),e=[],i=$(".sortable").find("div[data-priority]");$.each(i,function(t,i){e.push($(i).attr("data-priority").replace(/\"/g,""))}),$.ajax({type:"POST",url:"/control/admin/portfolio/sort/sections/"+t,dataType:"json",data:{priority:e},success:function(){document.location.reload()},error:function(){document.location.reload()}}),$(this).addClass("disabled")}),$(".removeRowSection").bind("click",function(){var t=$(this).attr("data-remove").replace(/\"/g,""),e=$("input#prt_id").val().replace(/\"/g,"");t&&confirm("Are you sure?")&&$.ajax({type:"POST",url:"/control/admin/portfolio/del/sections/"+e,dataType:"json",data:{id:t},success:function(){document.location.reload()},error:function(){document.location.reload()}})})});