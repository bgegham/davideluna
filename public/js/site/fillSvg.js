$(document).ready(function(){$('img[src$=".svg"]').each(function(){var t=jQuery(this),e=t.attr("src"),r=t.prop("attributes");$.get(e,function(e){var a=jQuery(e).find("svg");a=a.removeAttr("xmlns:a"),$.each(r,function(){a.attr(this.name,this.value)}),t.replaceWith(a)},"xml")})});