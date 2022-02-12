var AnalyticsController = {
    request: function(url, params) {

        settings.ajax({
            method: params.post ? 'post' : 'get',
            url: `/statistic/${url}${serializeHelper.getQuery(url, params.filters || false, params.pagination || false)}`,
            data: params.post ? params.post : {},
            callback: function(result) {

                if (params.callback) {

                    params.callback(result, params);
                }
            },
            error: function() {

            },
            headers: function(xhr) {

                if (parseInt(xhr.getResponseHeader('x-pagination-page-count'))) {

                    var pagination = $('#show-more');

                    if (!pagination.is(':visible')) {

                        pagination.unbind().click(function(e) {

                            $('#model-table').closest('.ibox-content').addClass('sk-loading');

                            e.preventDefault();

                            params.pagination = true;

                            setTimeout(function() {

                                AnalyticsController.request(url, params);
                            }, 50);
                        });
                    }

                    if (pagination.attr('disabled')) {

                        pagination.unbind();

                        PermissionController.applyPermissions();
                    }

                    if (parseInt(xhr.getResponseHeader('x-pagination-page-count')) > parseInt(xhr.getResponseHeader('x-pagination-current-page'))) {

                        pagination.attr('next-page', parseInt(xhr.getResponseHeader('x-pagination-current-page')) + 1).show();
                    }
                    else {

                        pagination.removeAttr('next-page').hide();
                    }

                    var count = parseInt(xhr.getResponseHeader('x-pagination-total-count')) - parseInt(xhr.getResponseHeader('x-pagination-current-page')) * parseInt(xhr.getResponseHeader('x-pagination-per-page'));

                    pagination.text(`Показать еще (${count})`);
                }
            }
        }, true);
    },
    getData: function(url, callback, child, level, page) {

        var link = `/statistic/${url}`;

        if (page) {

            link = `/statistic/${url}?page=${page}`;
        }

        settings.ajax({
            method: 'get',
            url: link,
            data: {},
            callback: function(result) {

                if (callback) {

                    callback(result, child, level);
                }
            },
            error: function() {

            },
            headers: function(xhr) {

                if (xhr.getResponseHeader('x-pagination-page-count')) {

                    var el = $('#pagination');

                    if (el.data('twbsPagination')) {

                        el.twbsPagination('destroy');
                    }

                    el.twbsPagination({
                        totalPages: xhr.getResponseHeader('x-pagination-page-count'),
                        visiblePages: 6,
                        prev: '<<',
                        next: '>>',
                        first: false,
                        last: false,
                        startPage: page || 1,
                        onPageClick: function (event, page) {

                            AnalyticsController.getData(url, callback, child, level, page);
                        }
                    });
                }
            }
        });
    },
}