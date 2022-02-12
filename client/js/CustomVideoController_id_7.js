var customVideoController = {
    isInited: false,
    video: null,
    currentVideo: null,
    init: function(video) {

        this.currentVideo = video;

        this.setHTML();

        customVideoController.video.play();

        if (!this.isInited) {

            this.eventListeners();

            this.isInited = true;
        }

        this.metrics(video, true);
    },
    metrics: function(id, isFinished) {

        switch (id) {
            case '0':

                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson1'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson1');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson1'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson1');
                }
                break;
            case '1':



                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson2'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson2');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson2'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson2');
                }
                break;
            case '2':

                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson3'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson3');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson3'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson3');
                }
                break;
            case '3':

                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson4'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson4');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson4'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson4');
                }
                break;
            case '4':

                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson5'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson5');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson5'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson5');
                    VK.Goal('view_content');
                }
                break;
            case '5':

                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson6'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson6');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson6'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson6');
                    VK.Goal('view_content');
                }
                break;
            case '6':

                if (isFinished) {

                    gtag('event', 'start_video', {'event_category': 'tutorial', 'event_label': 'lesson7'}); ym(69943126, 'reachGoal', 'tutorial_start_video_lesson7');
                }
                else {

                    gtag('event', 'finish_video', {'event_category': 'tutorial', 'event_label': 'lesson7'}); ym(69943126, 'reachGoal', 'tutorial_finish_video_lesson7');
                    VK.Goal('view_content');
                }
                break;
        }
    },
    initVideos: function() {

        CommonController.getUserInfo();

        var lastVideo = -1;

        for (var i in CommonController.user.lessons) {

            if (CommonController.user.lessons[i]) {

                lastVideo = parseInt(i);

                var wrapper = $(`#get-extra-days .extra-video[data-step="${i}"]`);

                wrapper.addClass('active');

                wrapper.find('.extra-video-label').addClass('active').html(`
                    <img src="/client/img/video-success.png" alt=""> Урок пройден!
                `);

                wrapper.find('.extra-video-play').addClass('active');
            }
        }

        var wrapper = $(`#get-extra-days .extra-video[data-step="${(lastVideo + 1)}"]`);

        if (wrapper.length) {

            wrapper.addClass('active');

            wrapper.find('.extra-video-play').addClass('active');
        }
    },
    setHTML: function() {

        $('#custom-video .video').html(`
            <video controls class="video" id="video" preload="metadata">
                <source src="/client/video/${this.currentVideo}.mp4" type="video/mp4"></source>
            </video>
        `);

        this.video = document.getElementById('video');

        this.video.controls = false;

        this.video.addEventListener('ended', function() {

            var container = $(`#get-extra-days .extra-video[data-step="${customVideoController.currentVideo}"]`),
                data = {
                    days: container.attr('data-days'),
                    lesson: container.attr('data-lesson'),
                    step: container.attr('data-step')
                }

            if (data.days == 2) {

                data.hints = 0;
            }

            $('.js-close').trigger('click');

            settings.ajax({
                method: 'PATCH',
                url: `/v1/user/${CommonController.user.id}`,
                data: data,
                callback: function(result) {

                    settings.responseHandler(true, 'Ваш демо-доступ продлен!');

                    customVideoController.initVideos();
                },
                error: function() {

                },
                headers: function() {

                }
            }, true);

            customVideoController.metrics(customVideoController.currentVideo, false);
        });
    },
    eventListeners: function() {

        $('.js-close').click(function() {

            customVideoController.video.pause();

            customVideoController.closeWinodw();

            customVideoController.initVideos();

            $('#custom-video .video').html('');
        });
    },
    openWindow: function() {

        $('#custom-video').addClass('opened');
    },
    closeWinodw: function() {

        $('#custom-video').removeClass('opened');
    },
}