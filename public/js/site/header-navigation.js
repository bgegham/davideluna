(function () {
    var scrollTop = $(window).scrollTop();
    if(scrollTop > 100) {
        $('.nav-slider-container').addClass('scrolled-navigation');
        $('#nav-hamburger').addClass('span-black');
    } else {
        $('.nav-slider-container').removeClass('scrolled-navigation');
        $('#nav-hamburger').removeClass('span-black');
    }

    $('#nav-hamburger').bind("click", function () {
        $('body').toggleClass('no-overflow');
        $(this).parents('.nav-slider-container').toggleClass('responsive');
        $(this).toggleClass('open');
    });

    $(window).scroll(function () {
        scrollTop = $(window).scrollTop();

        if(scrollTop > 100) {
            $('.nav-slider-container').addClass('scrolled-navigation');
            $('#nav-hamburger').addClass('span-black');
        } else {
            $('.nav-slider-container').removeClass('scrolled-navigation');
            $('#nav-hamburger').removeClass('span-black');
        }

        if(scrollTop > 400 && window.innerWidth >= 580 ){
            $(".header-nav-slider-block > .nav-slider-container").css({
                top : "-85px"
            });
        } else {
            $(".header-nav-slider-block > .nav-slider-container").css({
                top : "0"
            });
        }
    });

    $('.mouse-btn').click(function() {
        $('html,body').animate({
                scrollTop: $('.scroll-from-header').offset().top - $('.nav-slider-container').height()}, 1000);
        return false;
    });

    // set video height equal to image height

    var getImageHeight = function () {
        var imgs = $('.slider-item-block img');

        for(var i = 0; i < imgs.length; i++) {
            if(imgs[i].clientHeight) {
                return imgs[i].clientHeight;
            }
        }

    };

    $(document).ready(function() {
        var imgHeight = getImageHeight();
        $('.slider-item-block').height(imgHeight);
        $('.slider-item-block iframe').height(imgHeight);
    });

    $(window).resize(function () {
        var imgHeight = getImageHeight();
        $('.slider-item-block').height(imgHeight);
        $('.slider-item-block iframe').height(imgHeight);
    });
})();

$( window ).ready(function() {
    setTimeout(function () {
        //open site content
        $(".siteLoader").fadeOut();
    }, 800);
});

jQuery(document).ready(function($){

    var slidesWrapper = $('.cd-hero-slider');

    //check if a .cd-hero-slider exists in the DOM
    if ( slidesWrapper.length > 0 ) {
        var primaryNav = $('.cd-primary-nav'),
            navigationMarker = $('.cd-marker'),
            slidesNumber = slidesWrapper.children('li').length,
            visibleSlidePosition = 0,
            autoPlayId,
            xNext = $('#cycle-next'),
            xPrew = $('#cycle-prev'),
            autoPlayDelay = 5000;

        xPrew.hide();

        //upload videos (if not on mobile devices)
        uploadVideo(slidesWrapper);

        function uploadVideo(container) {
            container.find('.cd-bg-video-wrapper').each(function(){
                var video = $(this).find(".vjs-default-skin");
                video.css({
                    width : $(".cd-hero-slider").width(),
                    height: $(".cd-hero-slider").height()
                });
            });

            $(window).resize(function () {
                $('.cd-hero-slider').find('.cd-bg-video-wrapper').each(function(){
                    var _video = $(this).find(".vjs-default-skin");
                    _video.css({
                        width : $(".cd-hero-slider").width(),
                        height: $(".cd-hero-slider").height()
                    });
                });
            });
        }

        //autoplay slider
        setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);

        //on mobile - open/close primary navigation clicking/tapping the menu icon
        primaryNav.on('click', function(event){
            if($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
        });

        xNext.on('click', function (event) {
            event.preventDefault();
            var activePosition = slidesWrapper.find('li.selected').index();
            nextSlide(slidesWrapper.find('.selected'), slidesWrapper, activePosition  + 1);
            //this is used for the autoplay
            visibleSlidePosition = activePosition;

            setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);

            if(slidesNumber-1 == activePosition+1){
                xNext.hide();
            }
            xPrew.show();
        });

        xPrew.on('click', function (event) {
            event.preventDefault();
            var activePosition = slidesWrapper.find('li.selected').index()-1;
            prevSlide(slidesWrapper.find('.selected'), slidesWrapper, activePosition);
            //this is used for the autoplay
            visibleSlidePosition = activePosition;

            //reset autoplay
            setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
            if(activePosition == 0){
                xPrew.hide();
            } else {
                xPrew.show();
            }
            xNext.show();
        });


    }

    function nextSlide(visibleSlide, container, n){
        visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
        checkVideo(visibleSlide, container, n);
    }

    function prevSlide(visibleSlide, container, n){
        visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
        checkVideo(visibleSlide, container, n);
    }

    function setAutoplay(wrapper, length, delay) {
        if(wrapper.hasClass('autoplay')) {
            clearInterval(autoPlayId);
            autoPlayId = window.setInterval(function(){autoplaySlider(length)}, delay);
        }
    }

    function autoplaySlider(length) {
        if( visibleSlidePosition < length - 1) {
            nextSlide(slidesWrapper.find('.selected'), slidesWrapper, visibleSlidePosition + 1);
            visibleSlidePosition +=1;
        } else {
            prevSlide(slidesWrapper.find('.selected'), slidesWrapper, 0);
            visibleSlidePosition = 0;
        }
        updateNavigationMarker(navigationMarker, visibleSlidePosition+1);
    }


    function checkVideo(hiddenSlide, container, n) {
        //check if a video outside the viewport is playing - if yes, pause it
        var hiddenVideo = hiddenSlide.find('video');
        if( hiddenVideo.length > 0 ) hiddenVideo.get(0).pause();

        //check if the select slide contains a video element - if yes, play the video
        var visibleVideo = container.children('li').eq(n).find('video');
        if( visibleVideo.length > 0 ) visibleVideo.get(0).play();
    }

    function updateNavigationMarker(marker, n) {
        marker.removeClassPrefix('item').addClass('item-'+n);
    }

    $.fn.removeClassPrefix = function(prefix) {
        //remove all classes starting with 'prefix'
        this.each(function(i, el) {
            var classes = el.className.split(" ").filter(function(c) {
                return c.lastIndexOf(prefix, 0) !== 0;
            });
            el.className = $.trim(classes.join(" "));
        });
        return this;
    };
});


jQuery(document).ready(function($){
    var overlayNav = $('.cd-overlay-nav'),
        overlayContent = $('.cd-overlay-content'),
        navigation = $('.cd-primary-nav'),
        toggleNav = $('.cd-nav-trigger');

    //inizialize navigation and content layers
    layerInit();
    $(window).on('resize', function(){
        window.requestAnimationFrame(layerInit);
    });

    //open/close the menu and cover layers
    toggleNav.on('click', function(){
        if(!toggleNav.hasClass('close-nav')) {
            //it means navigation is not visible yet - open it and animate navigation layer
            toggleNav.addClass('close-nav');

            overlayNav.children('span').velocity({
                translateZ: 0,
                scaleX: 1,
                scaleY: 1,
            }, 500, 'easeInCubic', function(){
                navigation.addClass('fade-in');
            });
        } else {
            //navigation is open - close it and remove navigation layer
            toggleNav.removeClass('close-nav');

            overlayContent.children('span').velocity({
                translateZ: 0,
                scaleX: 1,
                scaleY: 1,
            }, 500, 'easeInCubic', function(){
                navigation.removeClass('fade-in');

                overlayNav.children('span').velocity({
                    translateZ: 0,
                    scaleX: 0,
                    scaleY: 0,
                }, 0);

                overlayContent.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    overlayContent.children('span').velocity({
                        translateZ: 0,
                        scaleX: 0,
                        scaleY: 0,
                    }, 0, function(){overlayContent.removeClass('is-hidden')});
                });
                if($('html').hasClass('no-csstransitions')) {
                    overlayContent.children('span').velocity({
                        translateZ: 0,
                        scaleX: 0,
                        scaleY: 0,
                    }, 0, function(){overlayContent.removeClass('is-hidden')});
                }
            });
        }
    });

    function layerInit(){
        var diameterValue = (Math.sqrt( Math.pow($(window).height(), 2) + Math.pow($(window).width(), 2))*2);
        overlayNav.children('span').velocity({
            scaleX: 0,
            scaleY: 0,
            translateZ: 0,
        }, 50).velocity({
            height : diameterValue+'px',
            width : diameterValue+'px',
            top : -(diameterValue/2)+'px',
            left : -(diameterValue/2)+'px',
        }, 0);

        overlayContent.children('span').velocity({
            scaleX: 0,
            scaleY: 0,
            translateZ: 0,
        }, 50).velocity({
            height : diameterValue+'px',
            width : diameterValue+'px',
            top : -(diameterValue/2)+'px',
            left : -(diameterValue/2)+'px',
        }, 0);
    }
});