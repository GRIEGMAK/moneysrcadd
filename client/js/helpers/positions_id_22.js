var Positions = {
    init: function() {

        var compareLine = $('#show-compare');

        $('#model-table tbody').on('change', 'input', function() {

            if ($('#model-table input:checked').length) {

                compareLine.show();
            }
            else {

                compareLine.hide();
            }
        });

        $('#model-table thead').on('change', 'input', function() {

            if ($(this).is(':checked')) {

                $('#model-table input:not(:checked)').trigger('click');
            }
            else {

                $('#model-table input:checked').trigger('click');
            }


        });

        $('#compare-seo').show();

        $('#model-table').on('click', 'a.get-positions', function(e) {

            e.preventDefault();

            var id = $(this).attr('data-id');

            Positions.getCategoryPositions(id);

            Positions.getKeywordPositions(id);
        });
    },
    getCategoryPositions: function(id) {

        AnalyticsController.request(`product-info/charts/${id}`, {
            callback: Positions.positionModelConstructor,
            pagination: false
        });
    },
    getKeywordPositions: function(id) {

        AnalyticsController.request(`product-info/charts/${id}?keywords=1`, {
            callback: Positions.positionModelConstructor,
            pagination: false
        });
    },
    compareConstructor: function(elements) {

        var html = '';

        for (var i in elements) {

            var matches = {
                diff_matches: elements[i].max_matches - elements[i].min_matches,
                diff_products: elements[i].max_total_products_count - elements[i].min_total_products_count,
                diff_brands: elements[i].max_total_brands_count - elements[i].min_total_brands_count,
                diff_categories: elements[i].max_total_categories_count - elements[i].min_total_categories_count,
            };

            for (var j in matches) {

                if (matches[j] < 0) {

                    matches[j]  = `<sup><span class="decrease">⬇${matches[j]}</span></sup>`;
                }
                else if (matches[j] > 0) {

                    matches[j]  = `<sup><span class="increase">⬆${matches[j]}</span></sup>`;;
                }
                else {

                    matches[j] = '';
                }
            }

            html += `
                    <tr>
                        <td>
                            <img style="width: 12px;margin-right: 8px;margin-top: -2px;" src="/images/${elements[i].keyword.mp}.ico" />
                            <a target="_blank" href="/client/keyword?id=${elements[i].keyword.id}">
                                ${elements[i].keyword.name}
                            </a>
                            <a style="color: #32b797;float: right;" href="https://www.wildberries.ru/catalog/0/search.aspx?search=${elements[i].keyword.name}&xsearch=true" target="_blank"><i class="fa fa-external-link"></i></a>
                        </td>
                        <td>${elements[i].count}</td>
                        <td>${elements[i].max_matches} ${matches.diff_matches}</td>
                        <td>${elements[i].max_total_products_count} ${matches.diff_products}</td>
                        <td>${elements[i].max_total_brands_count} ${matches.diff_brands}</td>
                        <td>${elements[i].max_total_categories_count} ${matches.diff_categories}</td>
                    </tr>
                `;


        }

        var modal = $('#modal');

        $('.modal-title', modal).text('Сравнение позиций');

        if (elements[i].mp == 'ozon') {

            $('.modal-body', modal).html(`
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <td>Ключевое слово</td>
                            <td>Частотность</td>
                            <td>Рекомендации</td>
                            <td>Всего товаров</td>
                            <td>Всего брендов</td>
                            <td>Всего категорий</td>
                        </tr>
                    </thead>
                    <tbody>${html}</tbody>     
                </table>
            `);
        }
        else {

            $('.modal-body', modal).html(`
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <td>Ключевое слово</td>
                            <td>Общие ключи <span style="float: none;" class="information-tooltip" data-toggle="tooltip" data-placement="top" data-original-title="Количество совпадений для выбранных товаров">?</span></td>
                            <td>Рекомендации</td>
                            <td>Всего товаров</td>
                            <td>Всего брендов</td>
                            <td>Всего категорий</td>
                        </tr>
                    </thead>
                    <tbody>${html}</tbody>     
                </table>
            `);
        }

        modal.modal('show');

        $('.information-tooltip', modal).tooltip({
            trigger : 'hover'
        });
    },
    compareSeoConstructor: function(elements) {

        var html = '';

        for (var i in elements) {

            var matches = {
                diff_matches: elements[i].max_matches - elements[i].min_matches,
                diff_products: elements[i].max_total_products_count - elements[i].min_total_products_count,
                diff_brands: elements[i].max_total_brands_count - elements[i].min_total_brands_count,
                diff_categories: elements[i].max_total_categories_count - elements[i].min_total_categories_count,
            };

            for (var j in matches) {

                if (matches[j] < 0) {

                    matches[j]  = `<sup><span class="decrease">⬇${matches[j]}</span></sup>`;
                }
                else if (matches[j] > 0) {

                    matches[j]  = `<sup><span class="increase">⬆${matches[j]}</span></sup>`;;
                }
                else {

                    matches[j] = '';
                }
            }

            var link = '';

            if (elements[i].keyword.mp == 'ozon') {

                link = `https://www.ozon.ru/search/?deny_category_prediction=true&text=${elements[i].keyword.name.replace(' ', '+')}`;
            }
            else {

                link = `https://www.wildberries.ru/catalog/0/search.aspx?search=${elements[i].keyword.name}&xsearch=true`;
            }

            html += `
                <tr>
                    <td>
                        <img style="width: 12px;margin-right: 8px;margin-top: -2px;" src="/images/${elements[i].keyword.mp}.ico" />
                        <a target="_blank" href="/client/keyword?id=${elements[i].keyword.id}">
                            ${elements[i].keyword.name}
                        </a>
                        <a style="color: #32b797;float: right;" href="${link}" target="_blank"><i class="fa fa-external-link"></i></a>
                    </td>
                    <td>${elements[i].count}</td>
                    <td data-avg-position="${elements[i].avg_position}">${elements[i].avg_position}</td>
                    <td data-max-matches="${elements[i].max_matches}">${elements[i].max_matches} ${matches.diff_matches}</td>
                    <td data-product-count="${elements[i].max_total_products_count}">${elements[i].max_total_products_count} ${matches.diff_products}</td>
                    <td data-turnover="${elements[i].turnover}">${settings.intToMoney(elements[i].turnover || 0)}</td>
                    <td><button class="btn btn-danger">X</button></td>
                </tr>
            `;
        }

        var modal = $('#modal');

        $('.modal-title', modal).text('Сравнение позиций');

        $('.modal-body', modal).html(`
            <table class="table table-striped">
                <thead>
                    <tr>
                        <td>Ключевое слово</td>
                        <td>Общие ключи <span style="float: none;" class="information-tooltip" data-toggle="tooltip" data-placement="top" data-original-title="Количество совпадений для выбранных товаров">?</span></td>
                        <td>Средняя позиция</td>
                        <td>Рекомендации</td>
                        <td>Всего товаров</td>
                        <td>Суммарный оборот</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>${html}</tbody>     
            </table>
            <div class="form-group">
                <textarea name="" class="form-control" id="keys" cols="30" rows="10"></textarea>
            </div>
            <div style="display: none;" class="form-group">
                <textarea name="" class="form-control" id="keys-turover" cols="30" rows="10"></textarea>
            </div>
        `);

        modal.modal('show');

        Positions.serializeKeys(modal);

        $('table button', modal).click(function() {

            $(this).closest('tr').remove();

            Positions.serializeKeys(modal);
        });

        if (CommonController.user.id == 1) {

            $('textarea', modal).parent().show();
        }
    },
    serializeKeys: function(modal) {

        var text = '',
            textTurnover = '';

        $('table tbody tr', modal).each(function() {

            text += $(this).find('td a').eq(0).text().trim() + "\r\n";
            textTurnover += `${$(this).find('td a').eq(0).text().trim()};${$(this).find('td').eq(5).attr('data-turnover')};${$(this).find('td').eq(4).attr('data-product-count')};${$(this).find('td').eq(3).attr('data-max-matches')};${$(this).find('td').eq(2).attr('data-avg-position')}\r\n`;
        });

        $('#keys').val(text);
        $('#keys-turover').val(textTurnover);
    },
    positionModelConstructor: function(elements) {

        var html = '',
            tHeader = '<th>Категория</th>',
            graph = [],
            dates = [],
            colors = [
                'green',
                'blue',
                'orange',
                'purple',
                'red',
                'yellow',
                'grey',
            ];


        var modal = $('#modal');

        $('.modal-title', modal).text('Позиции');

        if (!elements.positions && elements[0].category) {

            for (var i in elements[0].date_graph) {

                var date = elements[0].date_graph[i].replace('2020-', '').replace('2021-', '').replace('2022-', '').replace('-', '.');

                tHeader += `<th>${date}</th>`;

                dates.push(date);
            }

            for (var i in elements) {

                var tdHTML = `
                    <td>
                        <img style="width: 12px;margin-right: 8px;margin-top: -2px;" src="/images/${elements[i].category.mp}.ico" />
                        <a target="_blank" href="/client/category?id=${elements[i].category.id}">
                            ${elements[i].category.name}
                            <span style="font-size: 12px;margin-left: 24px;margin-top: -4px;display: block;color: #a5a4a4;">${elements[i].category.path}</span>
                        </a>
                    </td>
                `;

                for (var j in elements[i].position_graph) {

                    var position = elements[i].position_graph[j] ? elements[i].position_graph[j] : '-';

                    if (elements[i].difference_graph[j]) {

                        if (elements[i].difference_graph[j] < 0) {

                            position = `${position} <sup><span class="decrease">⬇${elements[i].difference_graph[j]}</span></sup>`;
                        }
                        else {

                            position = `${position} <sup><span class="increase">⬆${elements[i].difference_graph[j]}</span></sup>`;
                        }
                    }

                    tdHTML += `
                        <td>${position}</td>
                    `;
                }

                html += `<tr>${tdHTML}</tr>`;

                graph.push({
                    label: elements[i].category.name,
                    backgroundColor: ChartsController.colors[`${colors[i]}a`],
                    borderColor: ChartsController.colors[colors[i]],
                    pointBorderColor: "#fff",
                    data: elements[i].position_graph,
                    fill: true,
                    postfix: '',
                    yAxisID: 'y-axis-1',
                });
            }

            $('.modal-body', modal).html(`
                <!--<div style="height: 200px;">
                    <canvas id="position-graph"></canvas>
                </div>-->
                <table class="table table-striped">
                    <thead><tr>${tHeader}</tr></thead>
                    <tbody>${html}</tbody>     
                </table>
            `);

            $('.modal-body', modal).attr('style', 'overflow-x: auto;');
        }

        if (elements.positions && elements.positions[0].keyword) {

            tHeader = '<th>Ключевое слово</th>';

            for (var i in elements.positions[0].date_graph) {

                var date = elements.positions[0].date_graph[i].replace('2020-', '').replace('2021-', '').replace('2022-', '').replace('-', '.');

                tHeader += `<th>${date}</th>`;

                dates.push(date);
            }

            for (var i in elements.positions) {

                var link = '',
                    el = elements.positions[i];

                if (el.keyword.mp == 'ozon') {

                    link = `https://www.ozon.ru/search/?deny_category_prediction=true&text=${el.keyword.name.replace(' ', '+')}`;
                }
                else {

                    link = `https://www.wildberries.ru/catalog/0/search.aspx?search=${el.keyword.name}&xsearch=true`;
                }

                var tdHTML = `
                    <td>
                        <img style="width: 12px;margin-right: 8px;margin-top: -2px;" src="/images/${el.keyword.mp}.ico" />
                        <a target="_blank" href="/client/keyword?id=${el.keyword.id}">
                            ${el.keyword.name}
                        </a>
                        <a style="color: #32b797;float: right;" href="${link}" target="_blank"><i class="fa fa-external-link"></i></a>
                    </td>
                `;

                for (var j in el.position_graph) {

                    var position = el.position_graph[j] ? el.position_graph[j] : '-';

                    if (el.difference_graph[j]) {

                        if (el.difference_graph[j] < 0) {

                            position = `${position} <sup><span class="decrease">⬇${el.difference_graph[j]}</span></sup>`;
                        }
                        else {

                            position = `${position} <sup><span class="increase">⬆${el.difference_graph[j]}</span></sup>`;
                        }
                    }

                    tdHTML += `
                        <td>${position}</td>
                    `;
                }

                html += `<tr>${tdHTML}</tr>`;
            }

            $('.modal-body', modal).append(`
                <!--<div style="height: 200px;">
                    <canvas id="position-graph"></canvas>
                </div>-->
                <div class="row">
                    <div class="col-lg-4">
                        <div class="ibox ">
                            <div class="ibox-title">
                                <h5>Оборот по ключевикам</h5>
                            </div>
                            <div class="ibox-content">
                                <div class="sk-spinner sk-spinner-wave">
                                    <div class="sk-rect1"></div>
                                    <div class="sk-rect2"></div>
                                    <div class="sk-rect3"></div>
                                    <div class="sk-rect4"></div>
                                    <div class="sk-rect5"></div>
                                </div>
                                <h1 class="no-margins">${settings.intToMoney(elements.totals.sum)}</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="ibox ">
                            <div class="ibox-title">
                                <h5>Итого ключевиков</h5>
                            </div>
                            <div class="ibox-content">
                                <div class="sk-spinner sk-spinner-wave">
                                    <div class="sk-rect1"></div>
                                    <div class="sk-rect2"></div>
                                    <div class="sk-rect3"></div>
                                    <div class="sk-rect4"></div>
                                    <div class="sk-rect5"></div>
                                </div>
                                <h1 class="no-margins">${settings.intToMoney(elements.totals.total)}</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="ibox ">
                            <div class="ibox-title">
                                <h5>Ключевиков в ТОП10</h5>
                            </div>
                            <div class="ibox-content">
                                <div class="sk-spinner sk-spinner-wave">
                                    <div class="sk-rect1"></div>
                                    <div class="sk-rect2"></div>
                                    <div class="sk-rect3"></div>
                                    <div class="sk-rect4"></div>
                                    <div class="sk-rect5"></div>
                                </div>
                                <h1 class="no-margins">${settings.intToMoney(elements.totals.top10)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead><tr>${tHeader}</tr></thead>
                    <tbody>${html}</tbody>     
                </table>
            `);
        }

        modal.modal('show');
    }
}

$(function() {

    $('#compare').click(function() {

        var ids = [],
            mp = '';

        $('#model-table input:checked').each(function() {

            ids.push($(this).val());

            mp = $(this).attr('data-mp');
        });

        AnalyticsController.request(`keyword/compare?mp=` + mp, {
            callback: Positions.compareConstructor,
            pagination: false,
            filters: false,
            post: {
                products: ids
            }
        });
    });

    $('#compare-seo').click(function() {

        var ids = [],
            mp = '';

        $('#model-table input:checked').each(function() {

            ids.push($(this).val());

            mp = $(this).attr('data-mp');
        });

        AnalyticsController.request(`keyword/compare?mp=` + mp, {
            callback: Positions.compareSeoConstructor,
            pagination: false,
            filters: false,
            post: {
                products: ids
            }
        });
    });
});