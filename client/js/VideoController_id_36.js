var companyVideo = {
    __preview: '#transit-video-trigger',
    __delay: 100,
    scripts: false,
    videoWidth: false,
    videoHeight: false,
    init: function(id, bool, item) {

        this.appendHtml(id);

        if (!this.scripts) {

            this.initScripts();
        }

        if (item && !this.checkLocalStorage(item)) {

            return 1;
        }

        setTimeout(function() {

            companyVideo.showPreview(id, bool);
        }, this.__delay);

        var videoPlayerElement = document.querySelector('.js-transit-video-player');


        $('.js-close-trigger-x, .js-close-trigger').click(function() {

            companyVideo.closePrivew();
            companyVideo.setLocalStorage(item);
        });

        $('.click-zone, .presentation-video-btn').click(function(e) {

            e.preventDefault();

            companyVideo.openPopup();

        });

        $('.seen-already').click(function() {

            companyVideo.setLocalStorage(item);
            companyVideo.closePrivew();
        });

        $('.js-close').click(function() {

            companyVideo.play.pauseVideo();
            companyVideo.hideVideo();

            companyVideo.setLocalStorage(item);
        });

        if (!bool) {

            $(window).on('resize', function() {
                companyVideo.resize();
            })
        }
    },
    openPopup: function() {

        companyVideo.play.playVideo();
        companyVideo.videoWidth = 640;
        companyVideo.videoHeight = 360;
        companyVideo.resize();

        companyVideo.showVideo();
    },
    appendHtml: function(id) {

        //LgBI43jie2I

        var wrapper = $('#transit-video-trigger'),
            btn = '';

        if (id == 'lw9KLm1C0mU') {

            btn = `<a style="margin: 10px auto;display: block;width: 300px;" href="https://mnpl.info/pdf" target="_blank" class="btn btn-warning">Оплатить каталог проверенных оптовиков</a>`;
        }

        if (id == 'hjpdOSwQ0es' && 0) {

            //btn = `<button style="margin: 10px auto;display: block;width: 300px;" id="order-statistic" target="_blank" class="btn btn-warning">Заказать подбор товара</button>`;
        }

        if (wrapper.length) {

            wrapper.remove();

            $('#transit-video-popup').remove();
        }

        if (!$('#transit-video-popup').length) {

            $('body').append(`
                <div id="transit-video-trigger" class="js-transit-video-trigger" trigger-delay="5">
                    <h4>Как пользоваться сервисом</h4>
                    <img class="play" src="/images/play-140.png" alt="play">
                    <div class="click-zone"></div>
                    <div class="seen-already js-close-trigger"><span>Спасибо, уже видели</span></div>
                    <div class="close js-close-trigger-x"><img src="/images/play-close.png" alt="close"></div>
                </div>
                <div id="transit-video-popup" style="display: none;" class="popup-wnd">
                    <div class="popup-content popup-video">
                        <h2 style="margin-bottom: 40px;font-weight: bold;">Изучите урок полностью, чтобы вам добавились бонусные дни!</h2>
                        <div class="video-wnd">
                            <div class="video">
                                <div class="videoPlayer youtubeMarker js-transit-video-player" id="${id}">
                                    <iframe class="iframe"  video-id="${id}" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" src="https://www.youtube.com/embed/${id}?showinfo=0&amp;controls=1&amp;modestbranding=0&amp;wmode=opaque&amp;enablejsapi=1&amp;"></iframe>
                                </div>
                            </div>
                            ${btn}
                            <!--<div style="position: absolute;width: 4000px;height: 1000px;top: 0;left: 0; z-index: 9999;"></div>-->
                        </div>
                    </div>
                    <div class="close-btn js-close"></div>
                </div>
            `);
        }

        $('#order-statistic').unbind().click(function() {

            companyVideo.productStatistic();
        });
    },
    productStatistic: function() {

        //return false;

        $('.close-btn.js-close').trigger('click');

        gtag('event', 'click_button', {'event_category': 'start_podbor'}); ym(69943126, 'reachGoal', 'start_podbor_click_button');

        var modal = $('#modal');

        $('.modal-title', modal).text('Заказать подбор товара');

        $('#save-data', modal).text('Заказать (7000 руб.)');

        $('.modal-body', modal).html(`
                <div class="form-group">
                    <label for="price">Укажите максимальную закупочную цену</label>
                    <input type='tel' pattern="[0-9\\-]+" class="form-control" name="price" placeholder="1000" id="price">
                </div>
                <div class="form-group">
                    <label for="category">Укажите желаемую категорию (либо напишите ЛЮБАЯ)</label>
                    <input type="text" class="form-control" name="category" placeholder="Смесители" id="category">
                </div>
                <div class="form-group">
                    <label for="turnover">Укажите свой бюджет</label>
                    <input type='tel' pattern="[0-9\\-]+" class="form-control" name="turnover" placeholder="100000" id="turnover">
                </div>
                <div class="form-group">
                    <label for="additional">Другие пожелания</label>
                    <textarea class="form-control" name="additional" id="additional"></textarea>
                </div>
            `);

        modal.modal('show');

        $('#save-data', modal).unbind().click(function() {

            var id = -1,
                data = {},
                errors = false;

            $('input, textarea', modal).each(function() {

                if (!$(this).val()) {

                    settings.responseHandler(false, 'Все поля обязательны для заполнения!')

                    errors = true;

                    return false;
                }
                else {

                    data[$(this).attr('name')] = {
                        field: $(this).parent().find('label').text(),
                        value: $(this).val()
                    }
                }
            });

            if (errors) {

                return false;
            }

            gtag('event', 'click_button', {'event_category': 'start_payment_podbor'}); ym(69943126, 'reachGoal', 'start_payment_podbor_click_button');

            settings.ajax({
                method: 'patch',
                url: `/v1/yoomoney/${id}`,
                data: {
                    data: data
                },
                callback: function(result) {

                    if (result && result.link) {

                        location.replace(result.link);
                    }
                },
                error: function() {

                    settings.responseHandler(false, 'Что-то пошло не так!');
                },
                headers: function() {

                }
            }, true);
        });
    },
    showPreview: function (id, bool) {

        companyVideo.play = companyVideo.initVideo(id);

        if (!bool) {

            $(companyVideo.__preview).addClass('view');
        }
    },
    closePrivew: function() {

        $(companyVideo.__preview).removeClass('view');
    },
    setLocalStorage: function(item) {

        localStorage.setItem(item || 'aboutVideo', 1);
    },
    checkLocalStorage: function(item) {

        if (item) {

            return typeof(localStorage[item]) === "undefined";
        }

        return typeof(localStorage.aboutVideo) === "undefined";
    },
    showVideo: function () {

        $('#transit-video-popup').show().addClass('opened');
    },
    hideVideo: function () {

        $('#transit-video-popup').removeClass('opened');
    },
    initScripts: function () {

        //var tag = document.createElement('script');

        //tag.src = "https://www.youtube.com/iframe_api";
        //var firstScriptTag = document.getElementsByTagName('script')[0];
        //firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.scripts = true;
    },
    initVideo: function (id) {

        return new YT.Player(id, {
            height: '360',
            width: '640',
            videoId: id,
            playerVars: {
                rel: 0,
                showinfo: 0,
                modestbranding: 1,
                //iv_load_policy: 3,
                wmode: 'opaque',
                //disablekb: 0,
                fs: 1,
            },
            events: {
                onStateChange: this.changingState
            }
        });
    },
    changingState: function(e) {

        var container = $(`#get-extra-days .extra-video[data-video-id="${e.target.playerInfo.videoData.video_id}"]`),
            lessons = localStorage.lessons ? JSON.parse(localStorage.lessons) : null;

        if (!e.data && container.length) {

            if (lessons && lessons[container.attr('data-step')]) {

                return 1;
            }

            if (!lessons) {

                lessons = {};
            }

            $('.js-close').trigger('click');

            var data = {
                days: container.attr('data-days'),
                lesson: container.attr('data-lesson'),
                step: container.attr('data-step')
            }

            if (data.days == 5) {

                data.hints = 0;
            }

            if(CommonController.user.hints) {
                settings.ajax({
                    method: 'PATCH',
                    url: `/v1/user/${CommonController.user.id}`,
                    data: data,
                    callback: function(result) {
                            
                        if (parseInt(container.attr('data-step')) == 6) {
                            
                            settings.responseHandler(true, 'Вы получили +5 дней к доступу!');

                            CommonController.user.hints = false;
                        }

                        customVideoController.metrics(container.attr('data-step'), false);
                        
                        lessons[container.attr('data-step')] = 1;
                        
                        localStorage.setItem('lessons', JSON.stringify(lessons));
                        
                        var wrapper = $(`#get-extra-days .extra-video[data-step="${(parseInt(container.attr('data-step')) + 1)}"]`);
                        
                        $(`#get-extra-days .extra-video[data-step="${container.attr('data-step')}"]`).find('.extra-video-label').addClass('active').html(`
                            <img src="/client/img/video-success.png" alt=""> Урок пройден!
                        `);
                        
                        if (wrapper.length) {
                            
                            wrapper.addClass('active');
                            
                            wrapper.find('.extra-video-play').addClass('active');
                        }
                        
                        $('#transit-video-trigger, #transit-video-popup').remove();
                    },
                    error: function() {

                    },
                    headers: function() {
                        
                    }
                }, true);
            }
        }
    },
    getWidthPadding : function() {
        if( window.innerWidth >= 1440 ) {
            return 190;
        }else if( window.innerWidth >= 1280 ) {
            return 160;
        }else{
            return 130;
        }
    },
    getHeightPadding : function() {
        if( window.innerWidth >= 1440 ) {
            return 115;
        }else if( window.innerWidth >= 1280 ) {
            return 100;
        }else{
            return 120;
        }
    },
    resize: function() {

        var ww = ( window.innerWidth - this.getWidthPadding() * 1 );
        var wh = ( window.innerHeight - this.getHeightPadding() * 1 );
        var width = ww;
        var height = wh;

        if(this.videoWidth && this.videoHeight)
        {
            height = Math.round( width / this.videoWidth * this.videoHeight );
            if(wh && ( height > wh ) )
            {
                height = wh;
                width = Math.round( height / this.videoHeight * this.videoWidth );
            }
        }

        $('.js-transit-video-player').css({ width : width / 2, height : height / 2 });
        companyVideo.play.setSize(width, height)
    }

}