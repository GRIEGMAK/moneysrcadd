var HintsController = {
    user: null,
    init: function() {

        this.setTopLines();

        this.showAboutVideo();

        if (settings.allGetParams().showform) {

            companyVideo.productStatistic();
        }
    },
    showAboutVideo: function() {

        if (CommonController.user.hints && !localStorage.aboutVideo) {

            localStorage.setItem('aboutVideo', 1);

            $('#modal-about-viedo').modal('show');
        }
    },
    extraDays: function(force) {

        if (force || CommonController.user.hints) {

            /*var counter = 0;

            for (var i in CommonController.user.lessons) {

                if (CommonController.user.lessons[i]) {

                    counter++;
                }
            }

            if (counter == 5) {

                return false;
            }

            $('#close-extra-video').click(function() {

                if (prompt('После закрытия данного блока, видео будут недоступны, уверены?')) {

                    $('#get-extra-days').hide();

                    localStorage.setItem('hideLesssons', 1);
                }
            });

            if (!localStorage.hideLesssons) {

                $('#get-extra-days').show();

                customVideoController.initVideos();

                $('#get-extra-days').on('click', '.extra-video.active', function() {

                    $('#get-extra-days').toggleClass('sk-loading');

                    var videoID = $(this).attr('data-step');

                    setTimeout(function() {

                        $('#get-extra-days').toggleClass('sk-loading');

                        customVideoController.init(videoID);
                        customVideoController.openWindow();
                    }, 1000);
                });
            }*/

            if (CommonController.user.hints) {

                if (localStorage.lessons) {

                    var lessons = JSON.parse(localStorage.lessons);

                    this.isVideosDone = true;

                    for (var i=0; i<=6; i++) {

                        this.isVideosDone &= parseInt(lessons[i]) === 1;
                    }

                    for (var i in lessons) {

                        var lastVideo = 0;

                        if (lessons[i]) {

                            lastVideo = parseInt(i);

                            var wrapper = $(`#get-extra-days .extra-video[data-step="${i}"]`);

                            wrapper.addClass('active');

                            wrapper.find('.extra-video-label').addClass('active').html(`
                                <img src="/client/img/video-success.png" alt=""> Урок пройден!
                            `);

                            wrapper.find('.extra-video-play').addClass('active');
                        }

                        var wrapper = $(`#get-extra-days .extra-video[data-step="${(lastVideo + 1)}"]`);

                        if (wrapper.length) {

                            wrapper.addClass('active');

                            wrapper.find('.extra-video-play').addClass('active');
                        }
                    }
                }



                $('#close-extra-video').click(function() {

                    if (confirm('После закрытия данного блока, видео будут недоступны, уверены?')) {

                        $('#get-extra-days').hide();

                        localStorage.setItem('hideLesssons', 1);
                    }
                });
            }
            else {

                $('#close-extra-video').hide();

                $('#get-extra-days h2').eq(0).text('Просмотренные видео');

                $(`#get-extra-days .extra-video`).addClass('active');
                $(`#get-extra-days .extra-video .extra-video-label`).remove();
                $(`#get-extra-days .extra-video .extra-video-play`).addClass('active');
            }

            $('#get-extra-days').show();

            if (!localStorage.hideLesssons) {

                $('#get-extra-days').on('click', '.extra-video.active', function() {

                    companyVideo.init($(this).attr('data-video-id'), true);

                    $('#get-extra-days').toggleClass('sk-loading');

                    customVideoController.metrics($(this).attr('data-step'), true);

                    if (CommonController.user.id == 1) {

                        setTimeout(function() {

                            $('#get-extra-days').toggleClass('sk-loading');
                            companyVideo.openPopup();
                        }, 1000);
                    }
                    else {

                        setTimeout(function() {

                            $('#get-extra-days').toggleClass('sk-loading');
                            companyVideo.openPopup();
                        }, 3500);
                    }
                });
            }
        }

        if (CommonController.user.id == 1) {


        }
    },
    setTopLines: function() {

        //$('#get-course').show();

        if (location.pathname == '/client/rates') {

            //$('#get-discount').show();

            $('#get-discount button').click(function() {

                $('#modal-promo').modal('show');

                $('#apply-for-promo').unbind().click(function() {

                    settings.ajax({
                        method: 'patch',
                        url: `/v1/user/${CommonController.user.id}`,
                        data: {
                            //hints: 1,
                            d: 1
                        },
                        callback: function(result) {

                            settings.responseHandler(true, 'Спасибо за заявку, менеджер свяжется с вами ближайшее время!');

                            $('#modal-promo').modal('hide');

                            $('#get-discount').hide();
                        },
                        error: function(error) {

                            settings.responseHandler(false, 'Что-то пошло не так, отпишите нам в чат!');
                        },
                        headers: function(xhr) {}
                    }, true);
                });
            });
        }

        if ((CommonController.user.id > 6410 && CommonController.user.hints)) {

            //$('#watch-about').show();

            if (CommonController.user.id > 9391 && CommonController.user.id < 9500) {

            }
            else {

                //$('#get-discount').show();
            }

            /*if (CommonController.user.rate_end_at) {

                var x = setInterval(function() {

                    var time = CommonController.user.rate_end_at - Math.round((new Date()).getTime() / 1000);

                    if (time > 0) {

                        var days = Math.floor(time / (3600 * 24)),
                            hours = Math.floor((time - days * 3600 * 24) / 3600),
                            minutes = Math.floor((time - days * 3600 * 24 - hours * 3600) / 60),
                            seconds = Math.floor((time - days * 3600 * 24 - hours * 3600 - minutes * 60));

                        var result = [];

                        if (days) {

                            result.push(days > 9 ? days : `0${days}`);
                        }

                        if (hours || days) {

                            result.push(hours > 9 ? hours : `0${hours}`);
                        }

                        if (minutes || (hours || days)) {

                            result.push(minutes > 9 ? minutes : `0${minutes}`);
                        }

                        if (seconds || (minutes || hours || days)) {

                            result.push(seconds > 9 ? seconds : `0${seconds}`);
                        }

                        $('#get-discount strong').text(result.join(':'));
                    }
                    else {

                        $('#get-discount').hide();

                        clearInterval(x);
                    }
                }, 1);
            }*/

            $('#watch-about a').click(function() {

                /**
                 settings.ajax({
                    method: 'patch',
                    url: `/v1/user/${CommonController.user.id}`,
                    data: {
                        hints: 1
                    },
                    callback: function(result) {},
                    error: function(error) {},
                    headers: function(xhr) {}
                }, true);
                 */
            });


        }
    },
    initMain: function() {

        return false;
        if (CommonController.user.hints && !localStorage.mainVideo) {

            companyVideo.init('TRulLMcJoxM', true, 'mainVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 10000);
        }
    },
    initProducts: function() {

        return false;
        if (CommonController.user.hints && !localStorage.productsVideo) {

            companyVideo.init('0FHEshEnaNE', true, 'productsVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 3000);
        }
    },
    initSeller: function() {

        return false;
        if (CommonController.user.hints && !localStorage.sellerVideo) {

            companyVideo.init('aLfmCswg6Oc', true, 'sellerVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 3000);
        }
    },
    initCategories: function() {

        return false;
        if (CommonController.user.hints && !localStorage.categoriesVideo) {

            companyVideo.init('46MCC8Oer7s', true, 'categoriesVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 3000);
        }
    },
    initAnalyse: function() {

        return false;
        if (CommonController.user.hints && !localStorage.analyseVideo) {

            companyVideo.init('grbi8YNRLIU', true, 'analyseVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 3000);
        }
    },
    initLists: function() {

        return false;
        if (CommonController.user.hints && !localStorage.listsVideo) {

            companyVideo.init('Gi-kvmRJ4CY', true, 'listsVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 3000);
        }
    },
    initPartner: function() {

        return false;
        if (CommonController.user.hints && !localStorage.partnerVideo) {

            companyVideo.init('rzsYGK8NYYM', true, 'partnerVideo');

            setTimeout(function() {

                companyVideo.openPopup();
            }, 3000);

            settings.ajax({
                method: 'PATCH',
                baseUrl: 'https://auth.moneyplace.io',
                url: `/api-client-v1/users/${localStorage.user_id}`,
                data: {
                    hints: 0
                },
                callback: function(result) {

                },
                error: function(error) {

                },
                headers: function(xhr) {

                }
            }, true);
        }
    },
    modal: function() {

        if (settings.allGetParams().r && CommonController.user.id > 13031) {

            settings.ajax({
                method: 'patch',
                url: `/v1/user/${CommonController.user.id}`,
                data: {
                    r: 1
                },
                callback: function(result) {

                    settings.responseHandler(true, 'Демо-доступ на 2 дня активируется через 5 минут!');

                    setTimeout(function() {

                        location.replace('/client/rates');
                    }, 4000);
                },
                error: function(error) {


                },
                headers: function(xhr) {

                }
            }, true);
        }

        if ((CommonController.user.hints && CommonController.user.id > 13031)) {

            var modal = $('#modal-special'),
                currentHTML = $('.modal-content', modal).html();

            if (!CommonController.user.schedule.length && !localStorage.schedule) {

                HintsController.constaructScheduleContent(modal, false);
            }
            else {

                $('#modal-after-schedule').modal('show');

                /*
                var html = '';

                if (localStorage.schedule) {

                    html = `${localStorage.schedule}`;
                }

                $('.modal-title', modal).text('Ожидание экскурсии');
                $('.modal-body', modal).html(`
                    <p>Встретимся на онлайн-экскурсии ${html} (московское время). Мы отправим ссылку на экскурсию в месседжер за 15 минут до начала</p>
                    <p><strong>Для чего мы сделали экскурсию?</strong></p>
                    <p>С целью сразу показать вам как работать в сервисе, чтобы вы не тратили бесплатный премиум доступ на самостоятельное обучение, а сразу приступили к эффективному анализу.</p>
                    <p>После прохождения эксурсии откроется премиум доступ на 2 дня к полному функционалу сервиса</p>
                    <button id="reschedule" class="btn btn-primary btn-xs" style="margin: 20px auto;">Переназначить дату</button>
                `);

                modal.modal('show');

                $('#save-schedule').hide().unbind();

                $('#reschedule', modal).unbind().click(function() {

                    $('.modal-content', modal).html(currentHTML);

                    HintsController.constaructScheduleContent(modal, true);
                });

                 */
            }
        }
    },
    constaructScheduleContent: function(modal, reschedule) {

        var moscowHours = new Date().getUTCHours() + 3,
            settingDate = 'now';

        if (moscowHours > 20) {

            settingDate = '+1d';

            $('#schedule-late').text('завтра');
        }
        else {

            $('#modal-special input[type="radio"]').each(function() {

                if ($(this).val() <= moscowHours) {

                    $(this).attr('disabled', 'disabled');
                }
            });
        }

        modal.modal('show');

        $.fn.datepicker.dates['en'] = {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: [ "Вс",
                "Пн",
                "Вт",
                "Ср",
                "Чт",
                "Пт",
                "Сб"],
            daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            months: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь"
            ],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today"
        };

        var tomorrow = new Date();

        tomorrow.setDate(tomorrow.getDate() + 2);

        $('#schedule-date').datepicker({
            format: 'dd.mm.yyyy',
            minDate: 0,
            endDate: tomorrow
        }).datepicker("setDate", settingDate).datepicker("setStartDate", settingDate);

        $('#save-schedule').click(function() {

            settings.ajax({
                method: 'post',
                url: `/v1/user-schedule`,
                data: {
                    date: $('#schedule-date').val(),
                    time: $('input[name="time"]:checked').val(),
                    reschedule: reschedule
                },
                callback: function(result) {

                    settings.responseHandler(true, 'Вы успешно записались, мы свяжется с Вами!');

                    localStorage.setItem('schedule', $('#schedule-date').val() + ' в ' + $('input[name="time"]:checked').val() + ':00');

                    setTimeout(function() {

                        location.reload();
                    }, 1000);

                },
                error: function(error) {

                    settings.responseHandler(false, error);
                },
                headers: function(xhr) {

                }
            }, true);
        });
    }
}

$(function() {

    HintsController.init();
});