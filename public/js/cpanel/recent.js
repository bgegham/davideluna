$(document).ready(function(){$(".sortPriority").bind("click",function(){$(".sortable").sortable({connectWith:".item-sort"}).disableSelection(),$(this).hide(),$(".savePriority").show()}),$(".savePriority").bind("click",function(){var t=[],o=$(".sortable").find("div.item-sort[data-priority]");$.each(o,function(o,r){t.push($(r).attr("data-priority").replace(/\"/g,""))}),$.ajax({type:"POST",url:"/control/admin/recent/priority",dataType:"json",data:{priority:t},success:function(){document.location.reload()},error:function(){document.location.reload()}}),$(this).hide(),$(".sortPriority").show()}),$(".removeRecent").bind("click",function(){var t=$(this).attr("data-remove").replace(/\"/g,"");t&&confirm("Are you sure?")&&$.ajax({type:"POST",url:"/control/admin/recent/remove",dataType:"json",data:{id:t},success:function(){document.location.reload()},error:function(){document.location.reload()}})})});