var CommonController = {
    release: 3,
    user: {},
    hideStore: 23891,
    init: function() {

        this.updates();

        this.getUserInfo();

        this.setSearchOption();

        this.setEventListeners();

        this.setMobilePanel();
    },
    setMobilePanel: function() {

        if ($('#page-wrapper').width() < 1200) {

            $('body').addClass('small-screen');

            //$('#mobile-mesage').show();
        }
    },
    setEventListeners: function() {

        $('#search-form li').click(function() {

            settings.getOrSetLocalStorage('search', `[data-search-param="${$(this).attr('data-search-param')}"][data-link="${$(this).attr('data-link')}"]`);
        });

        if (!~location.pathname.indexOf('store')) {

            $('#page-content').on('click', 'label', function() {

                if ($(this).find('input').val() != 'period') {

                    settings.getOrSetLocalStorage('period', $(this).find('input').val());
                }

            });
        }
    },
    updates: function() {

        if (!localStorage.release || localStorage.release != this.release) {

            $('#release .label').show();
        }

        $('#release').click(function() {

            localStorage.setItem('release', CommonController.release);

            $('#release .label').hide();
        });
    },
    setPeriodOption: function() {

        var option = settings.getOrSetLocalStorage('period');

        if (option && $('.date-selector label').length && !~location.pathname.indexOf('store')) {

            $('.date-selector').find(`input[value="${option}"]`).parent().trigger('click');
        }
    },
    setSearchOption: function() {

        var option = settings.getOrSetLocalStorage('search');

        if (option) {

            $(`#search-form li${option}`).trigger('click');
        }
    },
    getUserInfo: function() {

        settings.ajax({
            method: 'get',
            baseUrl: 'https://auth.moneyplace.io',
            url: `/api-client-v1/users/${localStorage.user_id}?expand=rate`,
            data: {},
            callback: function(result) {

                CommonController.user = result;

                localStorage.setItem('rate', result.id_rate);

                PermissionController.applyPermissions();

                if (localStorage.ozonTest) {

                    CommonController.hideStore = 2;
                }

                if (result.hints || !result.is_phone_verified || !result.is_questioned) {

                    $('nav.navbar-default a').eq(4).addClass('bonus-menu-item');
                }

                /**
                 * tochka bank partner and gecourse
                 */

                if (!result.got_extra_bonus) {

                    var bonus = false,
                        other = null;

                    if (result.id_ref == 2797 || result.id_ref == 95573 || result.id_ref == 78678) {

                        bonus = true;
                    }

                    if (~[111, 13032, 13879, 60774].indexOf(result.id_ref)) {

                        other = result.id_ref;
                    }

                    if (settings.getCookie('id_ref')) {

                        if (settings.getCookie('id_ref') == 2797 || settings.getCookie('id_ref') == 95573 || settings.getCookie('id_ref') == 78678) {

                            bonus = true;
                        }

                        if (~[111, 13032, 13879, 60774].indexOf(settings.getCookie('id_ref'))) {

                            other = settings.getCookie('id_ref');
                        }
                    }

                    if (bonus) {

                        settings.ajax({
                            method: 'PATCH',
                            url: `/v1/user/${result.id}`,
                            data: {
                                tochka: 1,
                            },
                            callback: function(result) {


                            },
                            error: function(msg) {

                                settings.responseHandler(false, msg);
                            },
                            headers: function(xhr) {

                            }
                        }, true);
                    }

                    if (other) {

                        settings.ajax({
                            method: 'PATCH',
                            url: `/v1/user/${result.id}`,
                            data: {
                                other: other,
                            },
                            callback: function(result) {


                            },
                            error: function(msg) {

                                settings.responseHandler(false, msg);
                            },
                            headers: function(xhr) {

                            }
                        }, true);
                    }
                }

                if (!localStorage.check_user) {

                    try {

                        FingerprintJS.load({token: 'Xim59tBea1X3c902IRGc'})
                            .then(fp => fp.get({ extendedResult: true }))
                            .then(function(data) {

                                settings.ajax({
                                    method: 'post',
                                    url: `/v1/track`,
                                    data: {
                                        id_user: result.id,
                                        id_yandex: 12,
                                        id_fingerprint: data.visitorId,
                                        id_localstorage: result.id,
                                        type: 'session',
                                        browserName: data.browserName,
                                        browserVersion: data.browserVersion,
                                        os: data.os,
                                        ip: data.ip,
                                        platform: data.device,
                                        osVersion: data.osVersion,
                                    },
                                    callback: function(result) {

                                        localStorage.setItem('check_user', 1);
                                    },
                                    error: function() {

                                    },
                                    headers: function() {

                                    }
                                }, true);
                            });
                    }
                    catch (e) {}

                }

                if (!localStorage.m_time || !settings.getCookie('m_time')) {

                    var loc = localStorage.m_time || 'not',
                        m_time = settings.getCookie('m_time') || 'not',
                        us  = settings.getCookie('m_time') * 1 == result.id ? 'yes' : 'no';

                    if (!localStorage.l10 && result.id > 50000) {

                        FingerprintJS.load({token: 'Xim59tBea1X3c902IRGc'})
                            .then(fp => fp.get({ extendedResult: true }))
                            .then(function(data) {

                                settings.ajax({
                                    method: 'post',
                                    url: `/v1/track`,
                                    data: {
                                        id_user: result.id,
                                        id_yandex: 40,
                                        id_fingerprint: data.visitorId,
                                        id_localstorage: result.id,
                                        type: 'session',
                                        browserName: data.browserName,
                                        browserVersion: data.browserVersion,
                                        os: data.os,
                                        ip: data.ip,
                                        platform: data.device + ' ' + loc + ' ' + m_time + ' ' + us,
                                        osVersion: data.osVersion,
                                    },
                                    callback: function(result) {

                                        localStorage.setItem('l10', 1);
                                    },
                                    error: function() {

                                    },
                                    headers: function() {

                                    }
                                }, true);
                            });
                    }
                }

                if (!localStorage.check_user7 && localStorage.check_user6) {

                    try {

                        if (performance.getEntries()[0].nextHopProtocol != 'h3') {

                            FingerprintJS.load({token: 'Xim59tBea1X3c902IRGc'})
                                .then(fp => fp.get({ extendedResult: true }))
                                .then(function(data) {

                                    settings.ajax({
                                        method: 'post',
                                        url: `/v1/track`,
                                        data: {
                                            id_user: result.id,
                                            id_yandex: 31,
                                            id_fingerprint: data.visitorId,
                                            id_localstorage: result.id,
                                            type: 'session',
                                            browserName: data.browserName,
                                            browserVersion: data.browserVersion,
                                            os: data.os,
                                            ip: data.ip,
                                            platform: data.device + ' ' + performance.getEntries()[0].nextHopProtocol + ' ' + performance.getEntries()[0].name,
                                            osVersion: data.osVersion,
                                        },
                                        callback: function(result) {

                                            localStorage.setItem('check_user7', 1);
                                        },
                                        error: function() {

                                        },
                                        headers: function() {

                                        }
                                    }, true);
                                });

                        }
                    }
                    catch (e) {}

                }

                $('#name').text(result.name);

                var isDemo = '';

                if (result.is_demo) {

                    isDemo = 'demo '
                }

                $('#rate').html(`Тариф: <span style="color: #fff;">${isDemo}${result.rate.name}</span>`);

                var expires = result.rate_end_at ? settings.getTime(result.rate_end_at, true) : 'бессрочный';

                $('#expires').html(`До: <span style="color: #fff;">${expires}</span>`);
            },
            error: function() {

            },
            headers: function(xhr) {


            }
        }, true);
    },
    export: function(url, type, name, el) {

        $.ajax({
            url: 'https://api.moneyplace.io/v1/export',
            data: {
                type: type,
                url: `https://api.moneyplace.io${url}`
            },
            headers: {
                'Authorization' : 'Bearer ' + localStorage.token
            },
            method: 'post',
            dataType: 'binary',
            xhrFields: {
                'responseType': 'blob'
            },
            success: function(data, status, xhr) {

                var link = document.createElement('a'),
                    filename = 'export.csv';console.log(disposition = xhr.getResponseHeader('Content-Disposition'));

                if (xhr.getResponseHeader('content-disposition')) {

                    filename = xhr.getResponseHeader('content-disposition');
                    filename = filename.match(/filename="(.*?)"/)[1];
                    filename = decodeURIComponent(escape(filename));
                }

                link.href = URL.createObjectURL(data);

                link.download = name;

                link.click();

                el.toggleClass('sk-loading');
            },
            error: function() {

                settings.responseHandler(false, 'Выгрузка доступна только на оплаченных тарифах!');

                el.toggleClass('sk-loading');
            }
        });
    }
}

$(function() {

    CommonController.init();
});