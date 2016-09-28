'use strict';
(function() {
    var $scrollTop;

    $(document).ready(function() {
        handleScroll();
        timeline();
    });

    function handleScroll() {
        $scrollTop = $(window).scrollTop();
        $(window).scroll(function() {
            $scrollTop = $(window).scrollTop();
            if ($scrollTop > 10) {
                $('.masthead').stop(true, true).addClass('nav-scrolled', 500);
            } else {
                $('.masthead').stop(true, true).removeClass('nav-scrolled', 500);
            }
        });
    }

    function timeline() {
        var $timelineBlocks = $('.cd-timeline-block'),
            offset = 0.8;

        //hide timeline blocks which are outside the viewport
        hideBlocks($timelineBlocks, offset);

        //on scolling, show/animate timeline blocks when enter the viewport
        $(window).on('scroll', function() {
            (!window.requestAnimationFrame) ? setTimeout(function() {
                showBlocks($timelineBlocks, offset);
            }, 100): window.requestAnimationFrame(function() {
                showBlocks($timelineBlocks, offset);
            });
        });

        function hideBlocks(blocks, offset) {
            blocks.each(function() {
                ($(this).offset().top > $(window).scrollTop() + $(window).height() * offset) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
            });
        }

        function showBlocks(blocks, offset) {
            blocks.each(function() {
                ($(this).offset().top <= $(window).scrollTop() + $(window).height() * offset && $(this).find('.cd-timeline-img').hasClass('is-hidden')) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
            });
        }
    }
})();