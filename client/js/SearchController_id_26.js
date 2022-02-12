var SearchController = {
    url: 'products',
    link: 'product',
    param: 'q[name][like]',
    mp: 'wildberries,ozon,ali,beru',
    mpMark: {
        wildberries: 'checked',
        ozon: 'checked',
        ali: 'checked',
        beru: 'checked',
        kazan: '',
        sber: '',
    },
    init: function() {

        this.setAutocomplite();

        this.eventListener();
    },
    eventListener: function() {


        $('#search-form').submit(function(e) {

            e.preventDefault();

            if ($('input', $(this)).val()) {

                location.replace(`/client/${SearchController.url}?${SearchController.param}=${$('input', $(this)).val()}`);
            }
            else {

                settings.responseHandler(false, 'Поисковое поле не может быть пустым!');
            }
        });
    },
    setSearchParams: function(url, param, link) {

        this.url = url;
        this.param = param;
        this.link = link;

        return this;
    },
    getUrl: function() {

        if (~this.url.indexOf('categories')) {

            return `${this.url}?sort=-count&q[count][more]=0&per-page=20`;
        }

        if (~this.url.indexOf('product')) {

            if (~this.param.indexOf('sku')) {

                return `${this.url}?per-page=19`;
            }

            return `${this.url}?sort=position&q[position][more]=0&per-page=19`;
            //return `${this.url}?sort=position&per-page=19`;
        }

        return `${this.url}?per-page=19`;
    },
    getParam: function() {

        return this.param;
    },
    getLink: function() {

        return this.link;
    },
    getMp: function() {

        return this.mp ? `&q[mp][in]=${this.mp}` : '';
    },
    setMp: function(container) {

        var mp = [];

        $('input', container).each(function () {

            if ($(this).is(':checked')) {

                mp.push($(this).val());
                SearchController.mpMark[$(this).val()] = 'checked';
            }
            else {

                SearchController.mpMark[$(this).val()] = '';
            }
        });

        if (mp.length) {

            this.mp = mp.join(',');
        }

        return this;
    },
    setAutocomplite: function() {

        $('#top-search').autocomplete({
            serviceUrl: `https://api.moneyplace.io/search/${this.getUrl()}${this.getMp()}`,
            minChars: 3,
            paramName: this.getParam(),
            preventBadQueries: false,
            transformResult: function(response, q, headers) {

                var total = headers.getResponseHeader('x-pagination-total-count');

                return {
                    suggestions: $.map(response, function(dataItem) {
                        return {
                            value: dataItem.name,
                            mp: dataItem.mp,
                            id: dataItem.id,
                            path: dataItem.path || null,
                            count: dataItem.count || null,
                            total: total
                        };
                    })
                };
            },
            ajaxSettings: {
                dataType: 'json',
                headers: {
                    'Authorization' : 'Bearer ' + settings.token()
                },
                crossDomain: true
            },
            maxHeight: 590,
            width: 800,
            onSelect: function (suggestion) {


            },
            beforeRender: function (container, suggestions) {

                container.prepend(`
                    <div class="choose-mp">
                        <label>
                            <input type="checkbox" name="q[mp][in]" value="wildberries" ${SearchController.mpMark.wildberries} class="i-checks"> Wildberries 
                        </label>
                        <label>
                            <input type="checkbox" name="q[mp][in]" ${SearchController.mpMark.ozon} value="ozon" class="i-checks"> Ozon 
                        </label>
                        <label>
                            <input type="checkbox" name="q[mp][in]" ${SearchController.mpMark.ali} value="ali" class="i-checks"> AliExpress 
                        </label>
                        <label>
                            <input type="checkbox" name="q[mp][in]" ${SearchController.mpMark.beru} value="beru" class="i-checks"> Я.Маркет 
                        </label>
                        <label>
                            <input type="checkbox" name="q[mp][in]" ${SearchController.mpMark.kazan} value="kazan" class="i-checks"> KazanExpress 
                        </label>
                        <label>
                            <input type="checkbox" name="q[mp][in]" ${SearchController.mpMark.sber} value="sber" class="i-checks"> СберМегаМаркет 
                        </label>
                    </div>
                `);

                container.append(`
                    <a class="view-all-results" data-total="${suggestions[0].total}" href="/client/${SearchController.url}?q[name][like]=${$('#top-search').val()}">
                        Смотреть все: ${suggestions[0].total} 
                    </a>
                `);

                container.find('.autocomplete-suggestion').each(function(i, suggestion) {

                    var path = '';

                    if (~SearchController.getUrl().indexOf('categories')) {

                        path = `<br /><span>${suggestions[i].path} (товары: ${suggestions[i].count})</span>`;
                    }

                    var href = `/client/${SearchController.getLink()}?id=${suggestions[i].id}`;

                    if (~SearchController.getUrl().indexOf('type')) {

                        href = `/client/${SearchController.getLink()}?q[name][like]=${suggestions[i].value}`;
                    }

                    $(suggestion).html(`
                        <img style="width: 12px;margin-right: 8px;margin-top: -2px;" src="/images/${suggestions[i].mp}.ico" />
                        <a href="${href}">
                            ${$(suggestion).html()}
                            ${path}
                        </a>
                    `);
                });

                if (localStorage.user_id == 0) {

                    $('.i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                        handle: 'checkbox'
                    });

                    $('input', container).on('ifToggled', function(event) {

                        SearchController.setMp(container).setAutocomplite();

                        $('#top-search').focus()
                    });
                }
                else {

                    $('input', container).on('change', function(event) {

                        SearchController.setMp(container).setAutocomplite();

                        $('#top-search').focus()
                    });
                }


            }
        });

        $('.autocomplete-suggestions').on('click', '.view-all-results', function(e) {

            if (!SearchController.validateResults($(this).attr('data-total'))) {

                e.preventDefault();
            }
        });
    },
    validateResults: function(number) {

        if (parseInt(number) > 5000) {

            settings.responseHandler(false, 'Ваш запрос слишком обширный, пожалуйста, конкретизируйте его, чтобы результат поиска выдавал не более 5000 наименований. Также воспользуйтесь разделом «Категории» для глобальной выдачи, либо выберите нужный маркетплейс.');

            return false;
        }

        return true;
    }
}

$(function() {

    SearchController.init();

    $('#search-selector li.search-selector').click(function() {

        $('#search-helper').text($(this).text().charAt(0).toLocaleLowerCase() + $(this).text().slice(1));

        SearchController.setSearchParams($(this).attr('data-search-url'), $(this).attr('data-search-param'), $(this).attr('data-link')).setAutocomplite();

        $('#top-search').focus();
    });

    $('#search-selector li.mp-search').unbind();
});