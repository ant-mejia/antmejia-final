var animBusy = false;

/**
 * changeNavColor description
 *  - Checks if window scroll position is less than 3/4 of the window height
 *  - Removes class 'solid' if previous condition is met and header has class
 *  - Sets the header background color to about 3/4 of the window height
 *  - If the window scroll reaches past that point, the header gets the class of 
 *    solid and the background color is changed
 */
function changeNavColor() {
    if ($(window).scrollTop() <= ($(window).height() * 0.75)) {
        if ($('header').hasClass('solid')) {
            $('header').removeClass('solid');
        }
        var x = $(window).scrollTop();
        $("header").css({
            "background-color": "rgba(255,255,255," + x / ($(window).height() * 0.752) + ")",
        });
    } else {
        $('header').addClass('solid').css("background-color", "rgba(255,255,255,0.992)");
    }
}


/**
 * [pxScroll description]
 * - Handles the main image parallax scrolling
 * - Queries the class parallax and moves the top 30% slower than all other elements
 */
function pxScroll() {
    $('.parallax').css('top', '-' + (($(window).scrollTop() * 0.7)) + 'px');
}



/**
 * [curSlide description]
 * - Init Slideshow
 * @type {Number}
 */
var curSlide = 0;



/**
 * [slide description]
 *  - Holds functions for slideshow
 * @type {Object}
 */
var slide = {
    /**
     * [moveLeft description]
     * - Checks to see if slideshow is in the process of animating
     * - If it isnt, it sets the target slideshow to the current slideshow +1
     * - Selects the current slideshow 'slide' class with eq() and fades out the text in the wrapper
     * - Appends div with class 'curtain' to slideshow
     * - Animates class 'curtain' and on complete, removes it
     * - Animates the target slide into view by setting 'left' property to 0
     * - Before doing so, it formats the z-index on the slides so you can see the actual slide
     * - On complete, if there's a video in the slide, it starts playing it and animates the slide text and adds 1 to 'curSlider' variable
     */
    moveLeft: function() {
        if (animBusy === false) {
            animBusy = true;
            if (curSlide == $('.slide').length - 1) {
                $('.slide').velocity({
                    left: '-110%'
                }, {
                    duration: 1700,
                    delay: 300,
                    easing: 'easeOut',
                    complete: function() {
                        curSlide -= ($('.slide').length - 1);
                        $('.slide').eq(curSlide).find('.bar').velocity("transition.expandIn", { delay: 1000 });
                        $('.slide').eq(curSlide).find('h1').velocity("transition.slideDownIn", { delay: 1300 });
                        $('.slide').eq(curSlide).find('h2').velocity("transition.slideUpIn", { delay: 1500 });
                        $('.slide').eq(curSlide).find('a').velocity("transition.slideDownIn", { delay: 1500 });
                    }
                });
            }
            var targetSlide = $('.slide').eq(curSlide + 1);
            console.log(targetSlide);
            console.log(curSlide);
            $('.slide').eq(curSlide).find('.slide-wrapper').children().velocity("transition.fadeOut", { stagger: 200, drag: true });
            $('.slideshow').append('<div class="curtain"></div>');
            $('.curtain').velocity({
                left: '-100%'
            }, {
                duration: 2100,
                delay: 200,
                easing: "easeInOutQuad",
                begin: function() {
                    $(this).css({ 'top': '0', 'left': '100%' });
                },
                complete: function() { $(this).remove(); }
            });
            targetSlide.velocity({
                left: 0
            }, {
                duration: 1700,
                delay: 300,
                easing: 'easeOut',
                begin: function() {
                    $(this).next('.slide').css('z-index', -1);
                    $(this).css({ 'top': '0', 'left': '100%', 'z-index': 'auto' });
                    $(this).find('.vid-curtain').velocity({ opacity: 1 }, { easing: 'easeIn' });
                },
                complete: function() {
                    if ($(this).find('video').length) {
                        $(this).find('video').get(0).play();
                    };
                    $(this).find('.bar').velocity("transition.expandIn", { delay: 1000 });
                    $(this).find('h1').velocity("transition.slideDownIn", { delay: 1300 });
                    $(this).find('h2').velocity("transition.slideUpIn", { delay: 1500 });
                    $(this).find('a').velocity("transition.slideDownIn", { delay: 1500 });
                    curSlide += 1;
                    animBusy = false;
                }
            });
        }
    },
};



var slideInterval = setInterval(function() {
    slide.moveLeft()
}, 20000);



/**
 * [document.ready() description]
 * - Main Function
 * - Waits til page is loaded before executing functions
 */
$(document).ready(function() {
    pxScroll();
    /**
     * [ScrollReveal description]
     * - Uses the ScrollReveal plugin
     * - Gets all elements inside class 'page-section' and attaches the reveal function
     */
    window.sr = ScrollReveal();
    sr.reveal('.page-section *');

    /**
     * - Gets all anchor elements that have an 'href' attribute that starts with '#'
     * - Prevents default behavior of clicking this link
     * - Animates the scroll to the intended target with Velocity.js
     */
    $('a[href^="#"]').bind("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(this).attr("href");
        $(target).velocity("scroll", {
            duration: 1400,
            offset: 0,
            easing: "easeInOutQuart"
        });
    });

    /**
     * - Binds the parallax scrolling function to scrolling the page
     */
    $(window).bind('scroll', function() {
        pxScroll();
    });


    /**
     * [description]
     * Autoplay slideshow and stop playing on class 'arrowright' click
     */
    setTimeout(function() {
        slideInterval;
    }, 5000)
    $('.arrowright').click(function() {
        slide.moveLeft();
        clearInterval(slideInterval);
    });

    /**
     * - Animate Slide Wrapper In
     */
    $('.slide').first().find('.slide-wrapper .bar').velocity("transition.expandIn", { delay: 1000 });
    $('.slide').first().find('.slide-wrapper h1').velocity("transition.slideDownIn", { delay: 1300 });
    $('.slide').first().find('.slide-wrapper h2').velocity("transition.slideUpIn", { delay: 1500 });
    $('.slide').first().find('.slide-wrapper a').velocity("transition.slideDownIn", { delay: 1500 });

    $('.big-button').click(function() {
        $('.main-slide').velocity("transition.slideDownOut");
    });

    /**
     * [if description]
     *  - If there is no id 'top', add class 'solid' to header
     *  - If there is, trigger changeNavColor() function
     */
    if ($('#top').length <= 0) {
        $("header").addClass('solid');
    } else {
        changeNavColor();
        $(window).scroll(function() {
            changeNavColor();
        });
    }
    /**
     * [Form Tab Description]
     * - Toggles form tabs
     */
    $('.form-tab').click(function() {
        if ($(this).hasClass('active') == false) {
            $('.form-tab').toggleClass('active');
            $('.formset').toggleClass('hide');
            $(document).prop('title', 'ATOM - ' + $('.form-tab.active').text());
        }
    });

    $('#login').submit(function(e) {
        e.preventDefault();
        window.location.replace('profile.html');
    });
});
