$(document).ready(function(){$(".sortPriority").bind("click",function(){$(".sortable").sortable({connectWith:".banners-sort"}).disableSelection(),$(this).hide(),$(".savePriority").show()}),$(".savePriority").bind("click",function(){var o=[],t=$(".sortable").find("div[data-priority]");$.each(t,function(t,r){o.push($(r).attr("data-priority").replace(/\"/g,""))}),$.ajax({type:"POST",url:"/control/admin/headers/priority",dataType:"json",data:{priority:o},success:function(){document.location.reload()},error:function(){document.location.reload()}}),$(this).addClass("disabled")}),$(".removeHeader").bind("click",function(){var o=$(this).attr("data-remove").replace(/\"/g,"");o&&confirm("Are you sure?")&&$.ajax({type:"POST",url:"/control/admin/headers/remove",dataType:"json",data:{id:o},success:function(){document.location.reload()},error:function(){document.location.reload()}})})});