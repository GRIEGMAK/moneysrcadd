var serializeHelper = {
    getQuery: function(currentUrl, filters, pagination) {

        var url = settings.allGetParams(),
            tabs = $('.nav.nav-tabs a.active'),
            paginationEl = $('#show-more'),
            date = $('.date-selector input:checked'),
            allowedGetParams = {
                'q[name][like]': 1
            },
            result = [];

        for (var i in url) {

            if (url[i] && allowedGetParams[i]) {

                result.push(`${i}=${url[i]}`);
            }
        }

        tabs.each(function() {

            if ($(this).attr('data-field')) {

                result.push(`${$(this).attr('data-field')}=${$(this).attr('data-field-value')}`);
            }
        });

        if (pagination && paginationEl.is(':visible') && paginationEl.attr('next-page')) {

            result.push(`page=${paginationEl.attr('next-page')}`);
        }

        if (date.length) {

            if (date.val() == 'period') {


                result.push(`q[date][between]=${settings.toUNIX($('#date').val().split(' - ')[0])},${settings.toUNIX($('#date').val().split(' - ')[1])}`);
            }

            result.push(`${date.attr('name')}=${date.val()}`);
        }

        if (filters) {

            if ($('.sorting[data-state]').length) {

                result.push(`sort=${$('.sorting[data-state]').attr('data-state')}`);

                if ($('#price-from').length && parseInt($('#price-from').val())) {

                    result.push(`q[price][between]=${$('#price-from').val()},${$('#price-to').val()}`);
                }

                if ($('.only-new').length && $('.only-new input').is(":checked")) {

                    result.push(`${$('.only-new input').attr('name')}=1`);
                }
            }

            if ($('.custom-filters').length) {

                $('.custom-filters .row').each(function() {

                    if ($(this).attr('data-field')) {

                        var from = $('input', $(this)).eq(0).val(),
                            to = $('input', $(this)).eq(1).val();

                        if (from || to) {

                            result.push(`${$(this).attr('data-field')}=${from || 0},${to || 9999999}`);
                        }
                    }
                });
            }
        }

        return result.length ? (currentUrl && ~currentUrl.indexOf('?') ? '&' + result.join('&') : '?' + result.join('&')) : '';
    },
    filtersQuery: function(el) {

        var query = [];

        $('select, input', el).each(function() {

            if ($(this).val()) {

                query.push(`${$(this).attr('name')}=${$(this).val()}`);
            }
        });

        return query.join('&');
    },
    serialize: function(el) {

        var data = {};

        $('select, input, textarea', el).each(function() {

            if ($(this).hasClass('date')) {

                if ($(this).val()) {

                    data[$(this).attr('name')] = settings.toUNIX($(this).val());
                }
            }
            else {

                if ($(this).attr('type') == 'checkbox') {

                    data[$(this).attr('name')] = $(this).is(':checked') ? 1 : 0;
                }
                else {

                    data[$(this).attr('name')] = $(this).val();
                }
            }
        });

        return data;
    },
    serializeFilters: function(filters, sort) {

        var searchString = [];

        $('input, select, textarea', filters).each(function() {

            if ($(this).val()) {

                if ($(this).attr('id') && $(this).attr('id') == 'date') {

                    searchString.push(`period=${settings.toUNIX($(this).val().split(' - ')[0])},${settings.toUNIX($(this).val().split(' - ')[1])}`);
                }
                else if ($(this).attr('id') && $(this).attr('id') == 'single-date') {

                    searchString.push(`date=${settings.toUNIX($(this).val())}`);
                }
                else {

                    searchString.push(`${$(this).attr('name')}=${$(this).val()}`)
                }
            }
        });

        if (sort) {

            searchString.push(`sort=${$('.sorting[data-state]', sort).attr('data-state')}`);
        }

        var store = $('.store-selector input:checked');

        if (store.length && store.val()) {

            searchString.push(`${store.attr('name')}=${store.val()}`);
        }

        return searchString.join('&');
    }
}