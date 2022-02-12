var settings = {
    token: function() {

        return localStorage.token;
    },
    baseUrl: 'https://api.moneyplace.io',
    checkTokenTime: function() {

        var expires_in = localStorage.expires_in;

        !expires_in ? this.exit() : 0;

        var currentTime = new Date();

        if ((expires_in - currentTime.getTime()) < 300000) {

            console.log(expires_in - currentTime.getTime());

            this.getToken(this.checkRefreshToken());
        }

    },
    checkRefreshToken: function() {

        var refresh_token = localStorage.refresh_token;

        if (!refresh_token) {

            this.exit();
        }

        return refresh_token;
    },
    getToken: function(refreshToken) {
        $.ajax({
            url: '/auth/auth.php?method=refreshAccessToken',
            type: 'post',
            async: false,
            data: {
                access_token: refreshToken
            },
            success: function(result) {

                var data = JSON.parse(result);

                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('expires_in', data.expires_in*1000 + new Date().getTime());
                }
                else {

                    settings.exit();
                }
            }
        });
    },
    ajax: function(ajaxParams, bool) {

        this.checkTokenTime();

        $.ajax({
            type: ajaxParams.method,
            url: ajaxParams.baseUrl ? (ajaxParams.baseUrl + ajaxParams.url) : (this.baseUrl + ajaxParams.url),
            dataType: 'json',
            headers: {
                'Authorization' : 'Bearer ' + this.token()
            },
            async: !bool,
            data: ajaxParams.data,
            success: function(result,status,xhr) {

                ajaxParams.callback(result);

                ajaxParams.headers(xhr);

                settings.setBlur();

                if (xhr.getResponseHeader('x-request-entity')) {

                    settings.limitsNotification(xhr.getResponseHeader('x-request-entity'), xhr.getResponseHeader('x-request-limit'), xhr.getResponseHeader('x-request-type'));
                }
            },
            error: function(data,status,xhr) {


                if (data.status == 401) {

                    settings.exit();
                }

                settings.setBlur();

                if (data.getResponseHeader('x-request-entity')) {

                    settings.limitsNotification(data.getResponseHeader('x-request-entity'), data.getResponseHeader('x-request-limit'), data.getResponseHeader('x-request-type'));
                }

                if (data.responseJSON[0]) {

                    ajaxParams.error(data.responseJSON[0].message);
                }
                else {

                    ajaxParams.error();
                }
            }
        });
    },
    setBlur: function() {

        if (CommonController.user && CommonController.user.is_demo) {

            if ($('#model-table').length) {

                var rowsCount = Math.round($('#model-table tbody tr').length / 2);

                $('#model-table tbody tr').each(function() {

                    if ($(this).index() >= rowsCount) {

                        $(this).attr('style', '-webkit-filter: blur(4px);');

                        $('a, input', $(this)).click(function(e) {

                            e.preventDefault();

                            return false;
                        });
                    }
                });

                $('#show-more').hide();
            };
        }
    },
    limitsNotification: function(entity, limit, type) {

        var enities = {
                'product': 'товары',
                'product-type': 'типы товаров',
                'category': 'категории',
                'seller': 'продавцы',
                'brand': 'бренды',
                'keyword': 'ключевые слова'
            },
            cat = type == 'search' ? 'поиска' : 'применения фильтра',
            resp = true;

        if (limit * 1 < 0) {

            resp = false;
            limit = 0;
        }

        if (limit == 1) {

            $('#modal-demo-request').modal();
        }

        settings.responseHandler(resp, `${settings.declOfNum(limit, ['Остался', 'Осталось', 'Осталось'])} ${limit} ${settings.declOfNum(limit, ['бесплатный', 'бесплатных', 'бесплатных'])} ${cat} по "${enities[entity]}" на сегодня! Лимиты обнулятся через 24 часа.`);
    },
    responseHandler: function(bool, text) {

        bool ? toastr.success(text) : toastr.error(text);
    },
    validate: function(el, errorBlockId) {

        var errorBlockId = errorBlockId || $('section', el).eq(0).attr('data-id');

        var types = {
                string: {
                    pattern: '',
                    response: function(name) {
                        return 'Поле "' + name + '" должно быть строкой!';
                    }
                },
                number: {
                    pattern: /^\d+$/i,
                    response: function(name) {
                        return 'Поле "' + name + '" должно быть числом!';
                    }
                },
                url: {
                    pattern: /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    response: function(name) {
                        return 'Некорректная ссылка!';
                    }
                },
                urlnothttp: {
                    pattern: /^(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    response: function(name) {
                        return 'Некорректная ссылка!';
                    }
                },
                email: {
                    pattern: /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i,
                    response: function(name) {
                        return 'Некорректный почтовый адрес!';
                    }
                }
            },
            errorsCount = 0;


        $('input, select, textarea', el).each(function() {

            if (!$(this).attr('data-validate-field') || ($(this).attr('data-validate-field') && !$(this).is(':visible'))) {

                return true;
            }

            var els = $(this),
                fieldValue = $(this).val(),
                fieldName = $('[for="'+$(this).attr('id')+'"]').text() || $(this).attr('placeholder'),
                fieldRequired = parseInt($(this).attr('data-validate-field').split(':')[0]) ? true : false,
                fieldType = $(this).attr('data-validate-field').split(':')[1],
                addOutline = function(el, bool) {

                    var el = !el.is(':visible') ? el : el;

                    if (bool) {
                        el.css('outline', 'none');
                        el.find('label').hide();
                    }
                    else {
                        el.css('outline', '1px solid #de2727');
                        el.find('label').show();
                    }

                };

            if (fieldRequired) {

                if (!fieldValue) {

                    settings.response_handler(false, 1, 'Поле "' + fieldName + '" обязательно для заполнения!');

                    addOutline(els, false);

                    errorsCount++;

                    return false;
                }

                if (els.attr('type') == 'checkbox' && !els.is(':checked')) {
                    settings.response_handler(false, 1, 'Для регистрации необходимо принять условия обработки персональных данных и агентского договора!');

                    errorsCount++;

                    return false;
                }

                addOutline(els, true);
            }

            if (fieldType) {

                for (var i in types) {

                    if (i == fieldType && fieldValue) {

                        if (types[i].pattern && !types[i].pattern.test(fieldValue)) {

                            settings.response_handler(false, errorBlockId, types[i].response(fieldName));

                            addOutline(els, false);

                            errorsCount++;

                            return false;
                        }

                        break;
                    }

                    addOutline(els, true);
                }

            }

        });

        if ($('#pass').length && $('#repass').length && $('#pass').val() != $('#repass').val()) {

            settings.response_handler(false, 1, 'Пароли не совпадают!');

            errorsCount++;
        }

        return !errorsCount;

    },
    getTime: function(created_at, full, month) {

        var months = {
            0: ' января ',
            1: ' февраля ',
            2: ' марта ',
            3: ' апреля ',
            4: ' мая ',
            5: ' июня ',
            6: ' июля ',
            7: ' авгруста ',
            8: ' сентября ',
            9: ' октября ',
            10: ' ноября ',
            11: ' декабря '
        }

        var theDate = new Date(created_at * 1000),
            full_date = theDate.getDate()+'.'+(theDate.getMonth()+1<10?('0'+(theDate.getMonth()+1)):theDate.getMonth()+1)+'.'+theDate.getFullYear(),
            full_date_width_time = full_date+' в '+theDate.getHours()+':'+(theDate.getMinutes()<10?('0'+theDate.getMinutes()):theDate.getMinutes()),
            stringDate = theDate.getDate() + months[theDate.getMonth()] + theDate.getFullYear();

        return full ? full_date_width_time : (month ? stringDate : full_date);

    },
    toUNIX: function(date, bool) {

        return bool ? Date.UTC(date.split('.')[2],date.split('.')[1]-1,date.split('.')[0], 23, 59, 59)/1000 : Date.UTC(date.split('.')[2],date.split('.')[1]-1,date.split('.')[0], 0, 0, 0)/1000;
    },
    btnPreloader: function(bool, data_id) {

        if (bool && data_id) {

            $('button[data-id="' + data_id + '"]>span').hide();
            $('button[data-id="' + data_id + '"] .btn-preloader-img').show();

            $('a[data-id="' + data_id + '"]>span').hide();
            $('a[data-id="' + data_id + '"] .btn-preloader-img').show();
        }
        else {

            $('button[data-id="' + data_id + '"]>span').show();
            $('button[data-id="' + data_id + '"] .btn-preloader-img').hide();

            $('a[data-id="' + data_id + '"]>span').show();
            $('a[data-id="' + data_id + '"] .btn-preloader-img').hide();
        }
    },
    timeToDate: function (time) {

        if (time && ~time.indexOf(':')) {

            var data = {
                    days: {
                        value: Math.floor(parseInt(time.split(':')[0])/24) || 0,
                        label: '&nbsp;д.&nbsp;'
                    },
                    hours: {
                        value: 0,
                        label: '&nbsp;ч.&nbsp;'
                    },
                    minutes: {
                        value: parseInt(time.split(':')[1]),
                        label: '&nbsp;мин.'
                    }
                },
                result = '';

            data.hours.value = parseInt(time.split(':')[0]) - data.days.value*24 || 0;

            for (var i in data) {

                result += data[i].value ? data[i].value + data[i].label : '';
            }

            return result;
        }

        return '';
    },
    declOfNum: function(number, titles, id) {

        var number = parseInt(number),
            cases = [2, 0, 1, 1, 1, 2],
            result = titles[(number%100 > 4 && number%100 < 20) ? 2 : cases[(number%10 < 5) ? number%10 : 5]];

        if (!id) return result;

        $('#' + id).text(result);
    },
    getDaysFromBeginingOfMonth: function(date) {

        var dayEnd = new Date(date).getDate();

        if (new Date().getMonth() != new Date(date).getMonth()) {

            dayEnd += (new Date(date).getMonth() - new Date().getMonth()) * 30;
        }

        return dayEnd;
    },
    allGetParams: function() {

        var getParams = window.location.search.substring(1).split('&'),
            params = {};

        for (var i in getParams) {

            params[getParams[i].split('=')[0]] = getParams[i].split('=')[1] ? getParams[i].split('=')[1] : null;
        }

        return params;
    },
    getParamsToString: function() {

        var params = this.allGetParams(),
            result = [];

        for (var i in params) {

            if (params[i]) {

                result.push(`${i}=${params[i]}`);
            }
        }

        if (result.length) {

            return '?' + result.join('&');
        }

        return '?';
    },
    serializeTabs: function() {

        var result = [];

        $('.nav-tabs a.active').each(function() {

            if ($(this).attr('data-field')) {

                result.push(`${$(this).attr('data-field')}=${$(this).attr('data-field-value')}`);
            }
        });

        return result.join('&');
    },
    intToMoney: function(money) {

        var multiplier = '';

        if (money && money < 0) {

            money = money * -1;

            multiplier = '-';
        }

        var postfix = money.toString().split('.');

        if (postfix.length > 1 && postfix[1].length > 2) {

            money = Math.round(money * 100) / 100;
        }

        return multiplier + money.toString().replace(/./g, function(c, i, a) {

            return i && c !== "." && ((a.split('.')[0].length - i) % 3 === 0) ? ',' + c : c;
        });
    },
    getPrettyDate: function(date, year) {

        var parts = date.split('-'),
            months = {
                '01': 'января',
                '02': 'февраля',
                '03': 'марта',
                '04': 'апреля',
                '05': 'мая',
                '06': 'июня',
                '07': 'июля',
                '08': 'августа',
                '09': 'сентября',
                '10': 'октября',
                '11': 'ноября',
                '12': 'декабря',
            },
            date = `${parseInt(parts[2])} ${months[parts[1]]}`;

        if (year) {

            return `${date} ${parts[0]}`;
        }

        return date;
    },
    truncateString: function(str, num) {

        if (str.length <= num) {

            return str;
        }
        return str.slice(0, num) + '...';
    },
    setCookie: function(name, value, days, multi) {

        var expires = "";

        if (days) {

            var date = new Date();

            date.setTime(date.getTime() + (days*24*60*60*1000));

            expires = "; expires=" + date.toUTCString();
        }

        var domain = '';

        if (multi) {

            domain = `; domain=.moneyplace.io`;
        }

        document.cookie = name + "=" + (value || "") + domain + expires + "; path=/";
    },
    getCookie: function(name) {

        var nameEQ = name + "=";

        var ca = document.cookie.split(';');

        for(var i=0;i < ca.length;i++) {

            var c = ca[i];

            while (c.charAt(0) == ' ') c = c.substring(1, c.length);

            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }

        return null;
    },
    exit: function() {

        var id_user = localStorage.user_id;

        localStorage.clear();

        localStorage.setItem('getme5', id_user);

        location.replace('/');
    },
    sendTrackData: function(countLocal, type) {

        if (localStorage.user_id) {

            if (localStorage.getme5 && !countLocal) {

                return false;
            }

            var data = this.getTrackData();

            data.type = type || 'session';

            setTimeout(function() {

                FingerprintJS.load({token: 'Xim59tBea1X3c902IRGc'})
                    .then(fp => fp.get({ extendedResult: true }))
                    .then(function(result) {

                        data.id_fingerprint = result.visitorId;

                        settings.ajax({
                            method: 'post',
                            url: `/v1/track`,
                            data: data,
                            callback: function(result) {


                            },
                            error: function() {

                            },
                            headers: function() {

                            }
                        }, true);
                    });

            }, 400);
        }
    },
    getTrackData: function() {

        if (!localStorage.getme5) {

            if (localStorage.user_id) {

                localStorage.setItem('getme5', localStorage.user_id);
            }
            else {

                localStorage.setItem('getme5', Math.round((new Date()).getTime() / 1000));
            }

        }

        var data = {
            id_yandex: 0,
            id_fingerprint: '',
            id_localstorage: '',
            browserName: '',
            browserVersion: '',
            os: '',
            osVersion: '',
            platform: '',
        };

        try {

            if (typeof Fingerprint2 != 'undefined') {

                Fingerprint2.get(function (components) {
                    var values = components.map(function (component) { return component.value })
                    data.id_fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
                })

                data.id_yandex = settings.getCookie('_ym_uid');
                data.id_localstorage = localStorage.getme5;

                if (typeof bowser != 'undefined') {

                    var browser = bowser.getParser(window.navigator.userAgent);

                    data.browserName = browser.parsedResult.browser.name;
                    data.browserVersion = browser.parsedResult.browser.version;

                    data.os = browser.parsedResult.os.name;
                    data.osVersion = browser.parsedResult.os.version;

                    data.platform = browser.parsedResult.platform.type;
                }

            }
        }
        catch (e) {}

        return data;
    },
    getOrSetLocalStorage: function(key, value) {

        if (!localStorage[key] || value) {

            localStorage.setItem(key, value);
        }

        return localStorage[key];
    }
};

$(function() {

    /**
     * menu state
     */

    $('.close-canvas-menu, .navbar-minimalize').on('click', function (e) {

        e.preventDefault();

        $("body").toggleClass("mini-navbar");

        settings.setCookie('menu', $("body").hasClass('mini-navbar') ? 'closed' : 'opened', 30);

        SmoothlyMenu();
    });

    if (settings.getCookie('menu')) {

        if (settings.getCookie('menu') == 'closed') {

            $("body").addClass('mini-navbar');
        }
        else {

            $("body").removeClass('mini-navbar');
        }
    }

    /**
     * partner
     */

    if (settings.allGetParams().id_ref) {

        settings.setCookie('id_ref', settings.allGetParams().id_ref, 30, true);
    }

    if (settings.allGetParams().tid) {

        settings.setCookie('tid', settings.allGetParams().tid, 30, true);
    }

    if (settings.allGetParams().subid1) {

        settings.setCookie('subid1', settings.allGetParams().subid1, 30, true);
    }

    /**
     * exit
     */

    $('#logout').click(function(e) {

        e.preventDefault();

        settings.exit();
    });

    /**
     * sorting
     */

    $('body').on('click', '.sorting', function() {

        var currentSortState = $(this).attr('data-state');

        $(this).closest('table').find('th.sorting').each(function() {

            $(this).removeAttr('data-state');
        });

        if (!currentSortState) {

            $(this).attr('data-state', `-${$(this).attr('data-sort')}`);
        }
        else {

            if ($(this).attr('data-sort') == currentSortState) {

                currentSortState = `-${currentSortState}`;
            }
            else {

                currentSortState = $(this).attr('data-sort');
            }

            $(this).attr('data-state', currentSortState);
        }
    });

    /**
     * toastr
     */

    if (typeof toastr != 'undefined') {

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "preventDuplicates": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "7000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        if ($('.information-tooltip.main-search').length) {

            $('.information-tooltip.main-search').tooltip({
                trigger : 'hover'
            });
        }
    }



    if (localStorage.refresh_token || (~document.cookie.indexOf('refresh_token') && settings.allGetParams().new)) {

        if (settings.allGetParams().new) {

            var cookie = document.cookie.split(';');

            if (cookie.length) {

                var data = {};

                for (var i in cookie) {

                    data[cookie[i].split('=')[0].replace(/ /gi, '')] = cookie[i].split('=')[1].replace(/ /gi, '');
                }

                localStorage.setItem('token', data.access_token);
                localStorage.setItem('expires_in', data.expires_in * 1000 + new Date().getTime());
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('role', data.role);
            }

        }

        /*
        var currentTooken = localStorage.token;

        settings.getToken(localStorage.refresh_token);

        if (currentTooken != localStorage.token) {


            if (localStorage.role != 'admin') {

                //location.replace('/client/');
            }
            else {
                //location.replace('/client/');
            }

        }
        */
    }

    settings.sendTrackData();

} ());