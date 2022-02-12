var PermissionController = {
    isDemo: false,
    rules: {
        '3,6': {
            mp: ['wildberries', 'ozon'],
            period: ['week'],
            pagination: false,
            name: '"Standart"'
        },
        '2,5,7': {
            mp: ['wildberries', 'ozon', 'ali', 'beru'],
            period: ['week', 'two_weeks'],
            pagination: true,
            name: '"Gold", "Все включено"'
        },
        '1,4,8': {
            mp: ['wildberries', 'ozon', 'ali', 'beru', 'kazan', 'sber'],
            period: ['week', 'two_weeks', 'month', 'period'],
            pagination: true,
            name: '"Premium"'
        },
    },
    init: function() {

        this.applyPermissions();

        this.eventListener();
    },
    eventListener: function() {

        $('.demo-warning-banner button').click(function() {

            settings.ajax({
                method: 'PATCH',
                baseUrl: 'https://auth.moneyplace.io',
                url: `/api-client-v1/users/${localStorage.user_id}`,
                data: {
                    id_rate: $(this).attr('data-id')
                },
                callback: function(result) {

                    settings.responseHandler(true, 'Тариф успешно изменен! Он вступит в силу через 5 секунд.');

                    localStorage.setItem('rate', result.id_rate);

                    setTimeout(function() {

                        location.reload();
                    }, 4000);
                },
                error: function(error) {

                    settings.responseHandler(false, error);
                },
                headers: function(xhr) {

                }
            }, true);
        });
    },
    applyPermissions: function() {

        /**
         * dates
         */

        if (~location.pathname.indexOf('store/')) {

            return false;
        }

        var currentRate = this.getCurrentRate(localStorage.rate);

        $('.date-selector input').each(function() {

            if (!~currentRate.period.indexOf($(this).val())) {

                $(this).attr('disabled', 'disabled').parent().attr('disabled', 'disabled');
            }
        });

        $('.date-selector label[disabled="disabled"]').unbind().click(function(e) {

            e.stopImmediatePropagation();

            settings.responseHandler(false, `Данный функционал возможен на тарифах: ${PermissionController.getRates('period', $('input', $(this)).val())}`);

            return false;
        });

        /**
         * tabs
         */

        $('.nav.nav-tabs a:not([data-field="type"])').each(function() {

            if ($(this).attr('data-field') && $(this).attr('data-field') != 'q[type][equal]' && !~currentRate.mp.indexOf($(this).attr('data-field-value'))) {

                $(this).attr('disabled', 'disabled').parent().attr('disabled', 'disabled');
            }
        });

        $('.nav.nav-tabs a[disabled="disabled"]').click(function(e) {

            e.stopImmediatePropagation();

            settings.responseHandler(false, `Данный функционал возможен на тарифах: ${PermissionController.getRates('mp', $(this).attr('data-field-value'))}`);

            return false;
        });

        /**
         * pagination
         */

        if ($('#show-more').length) {

            if (!currentRate.pagination) {

                $('#show-more').attr('disabled', 'disabled');
            }

            $('#show-more[disabled="disabled"]').click(function(e) {

                e.stopImmediatePropagation();

                settings.responseHandler(false, `Данный функционал возможен на тарифах: ${PermissionController.getRates('pagination', true)}`);

                return false;
            });
        }

        /**
         * demo mode
         */
        if (this.isDemo) {

            $('body').addClass('demo');

            var access = [
                    '/client/payment',
                    '/client/rates',
                    '/client/partner',
                    '/client/user',
                    '/client/bonus',
                    '/client/faq',
                ],
                isCorrerct = false;

            for (var i in access) {

                if (location.pathname == access[i]) {

                    isCorrerct = true;

                    break;
                }
            }

            if (!isCorrerct) {

                location.replace('/client/rates');
            }

            $('#side-menu li>a').click(function(e) {

                var isCorrect1 = false;

                for (var i in access) {

                    if ($(this).attr('href') == access[i]) {

                        isCorrect1 = true;

                        break;
                    }
                }

                if (!isCorrect1) {

                    e.stopImmediatePropagation();

                    settings.responseHandler(false, `Данный раздел доступен только на оплаченных тарифах!`);

                    return false;
                }

                return true;
            });
        }
        else {

            $('body').removeClass('demo');
        }
    },
    getRates: function(param, value) {

        var rates = [];

        for (var i in this.rules) {

            if (value === true) {

                if (this.rules[i][param]) {

                    rates.push(this.rules[i].name);
                }
            }
            else {

                if (~this.rules[i][param].indexOf(value)) {

                    rates.push(this.rules[i].name);
                }
            }

        }

        return rates.join(', ');
    },
    getCurrentRate: function(id) {

        if (!~['1', '2', '3', '7', '8'].indexOf(id)) {

            this.isDemo = true;
        }

        for (var i in this.rules) {

            if (~i.indexOf(id)) {

                return this.rules[i];
            }
        }
    }
}

$(function() {

    PermissionController.init();
});