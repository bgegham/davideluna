(function () {
    $('.open-member-description').click(function() {
        $(this).parents('.overlay').toggleClass('show-member-description');
        if($(this).hasClass('mdi-chevron-up')) {
            $(this).removeClass('mdi-chevron-up').addClass('mdi-chevron-down');
        } else {
            $(this).removeClass('mdi-chevron-down').addClass('mdi-chevron-up');
        }
    });
})();

$(document).ready(function () {
    $(".open-team-desc").bind("click", function () {
        $(this).parents('.team-member').find(".team-reveal").slideToggle('fast');
    });

    $(".close-team-desc").bind("click", function () {
        $(this).parents('.team-member').find(".team-reveal").slideToggle('fast');
    });

});