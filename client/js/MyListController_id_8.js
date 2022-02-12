var MyListController = {
    types: {},
    currentFolders: {},
    init: function() {

        this.eventListener();
    },
    eventListener: function() {

        $('#wrapper').on('click', '.add-to-my-list', function() {

            if (!MyListController.currentFolders[$(this).attr('type')]) {

                MyListController.constructModalAdd($(this).attr('type'), $(this));
            }
            else {

                MyListController.addToFolder({
                    id_folder: parseInt(MyListController.currentFolders[$(this).attr('type')]),
                    mp: $(this).attr('data-mp'),
                    id_mp: $(this).attr('data-id'),
                }, {
                    callback: function() {

                        settings.responseHandler(true, 'Товар успешно добавлен!');
                    }
                });
            }
        });

        $('#wrapper').on('click', '.remove-from-my-list', function() {

            var _self = $(this);

            settings.ajax({
                method: 'get',
                url: `/v1/folder-entity?q[id_folder][equal]=${_self.attr('data-folder-id')}&q[id_mp][equal]=${_self.attr('data-id')}`,
                data: {},
                callback: function(result) {

                    if (result.length) {

                        MyListController.deleteEntity({
                            id: result[0].id
                        }, {
                            callback: function() {

                                settings.responseHandler(true, 'Товар успешно удален!');

                                _self.closest('tr').remove();
                            }
                        });
                    }
                },
                error: function() {

                },
                headers: function(xhr) {


                }
            }, true);


        });
    },
    getList: function(type, params) {

        settings.ajax({
            method: 'get',
            url: `/v1/folder?q[type][equal]=${type}&sort=-created_at&per-page=100`,
            data: {},
            callback: function(result) {

                if (params.callback) {

                    params.callback(result, params);
                }
            },
            error: function() {

            },
            headers: function(xhr) {


            }
        }, true);
    },
    getTypes: function() {

        settings.ajax({
            method: 'get',
            url: `/v1/folder/types`,
            data: {},
            callback: function(result) {

                MyListController.types = result
            },
            error: function() {

            },
            headers: function(xhr) {

            }
        }, true);
    },
    serializeModal: function() {

        var data = {};

        $('#modal input, #modal select').each(function() {

            if ($(this).val()) {

                data[$(this).attr('name')] = $(this).val();
            }
        });

        return data;
    },
    createFolder: function(data, params) {

        settings.ajax({
            method: 'post',
            url: `/v1/folder`,
            data: data,
            callback: function(result) {

                if (params.callback) {

                    params.callback(result);
                }
            },
            error: function(err) {

                settings.responseHandler(false, err);
            },
            headers: function(xhr) {

            }
        }, true);
    },
    updateFolder: function(data, params, id) {

        settings.ajax({
            method: 'patch',
            url: `/v1/folder/${id}`,
            data: data,
            callback: function(result) {

                if (params.callback) {

                    params.callback(result);
                }
            },
            error: function(err) {

                settings.responseHandler(false, err);
            },
            headers: function(xhr) {

            }
        }, true);
    },
    deleteEntity: function(data, params) {

        settings.ajax({
            method: 'delete',
            url: `/v1/folder-entity/${data.id}`,
            data: data,
            callback: function(result) {

                if (params.callback) {

                    params.callback(result);
                }
            },
            error: function(err) {

                settings.responseHandler(false, err);
            },
            headers: function(xhr) {

            }
        }, true);
    },
    deleteFolder: function(id, params) {

        settings.ajax({
            method: 'delete',
            url: `/v1/folder/${id}`,
            data: {},
            callback: function(result) {

                if (params.callback) {

                    params.callback(result);
                }
            },
            error: function(err) {

                settings.responseHandler(false, err);
            },
            headers: function(xhr) {

            }
        }, true);
    },
    addToFolder: function(data, params) {

        settings.ajax({
            method: 'post',
            url: `/v1/folder-entity`,
            data: data,
            callback: function(result) {

                if (params.callback) {

                    params.callback(result);
                }
            },
            error: function(err) {

                settings.responseHandler(false, err);
            },
            headers: function(xhr) {

            }
        }, true);
    },
    constructModal: function(type) {

        var modal = $('#modal');

        $('.modal-title', modal).text('Создание "папки" с товарами');
        $('.modal-body', modal).html(`
            <div class="form-group">
                <input type="text" name="name" placeholder="Название" class="form-control" />
                <input type="hidden" name="type" value="${type}" />
            </div>
        `);

        modal.modal('show');
    },
    constructRenameModal: function(id, name) {

        var modal = $('#modal');

        $('.modal-title', modal).text('Переименование');
        $('.modal-body', modal).html(`
            <div class="form-group">
                <input type="text" data-id="${id}" name="name" placeholder="Название" value="${name}" class="form-control" />
            </div>
        `);

        modal.modal('show');
    },
    constructModalAdd: function(type, el) {

        var modal = $('#modal');

        $('.modal-title', modal).text('Отслеживание');
        $('.modal-body', modal).html(`
            <div class="form-group">
                <select type="text" name="id_folder" placeholder="Название" class="form-control"></select>
                <input type="hidden" name="type" value="${type}" />
            </div>
            <div class="form-group">
                <div class="checkbox m-r-xs">
                    <input type="checkbox" checked id="checkbox1">
                    <label for="checkbox1">
                        Установить по умолчанию до обновления страницы
                    </label>
                </div>
            </div>
        `);

        modal.modal('show');

        $.fn.modal.Constructor.prototype.enforceFocus = function() {};

        $('select', modal).select2({
            dropdownParent: modal,
            width: 300,
            multiple: false,
            ajax: {
                url: "https://api.moneyplace.io/v1/folder",
                dataType: 'json',
                delay: 250,
                headers: {
                    'authorization': `Bearer ${localStorage.token}`
                },
                data: function (params) {

                    return {
                        'q[name][like]': params.term,
                        'per-page': 20,
                        'sort': '-created_at',
                        'q[type][equal]': type
                    };
                },
                processResults: function (data, params) {

                    var results = [];

                    for (var i in data) {

                        results.push({
                            id: data[i].id,
                            text: data[i].name
                        });
                    }

                    return {
                        results: results
                    };
                },
                cache: true
            },
            language: {
                noResults: function() {

                    return "<a class='btn btn-success create-folder' style='color: #fff'>Создать папку</a>";
                }
            },
            escapeMarkup: function(markup) {

                return markup;
            },
            placeholder: 'Выберите или создайте папку',
        });

        modal.on('click', '.create-folder', function() {

            if (confirm(`Создать папку "${$('.select2-search__field', modal).val()}"?`)) {

                MyListController.createFolder({
                    name: $('.select2-search__field', modal).val(),
                    type: type
                }, {
                    callback: function(result) {

                        settings.responseHandler(true, 'Папка успешно созадна!');

                        if ($('input[type="checkbox"]', modal).is(':checked')) {

                            MyListController.currentFolders[type] = result.id;
                        }

                        MyListController.destroyModel();

                        MyListController.addToFolder({
                            id_folder: result.id,
                            mp: el.attr('data-mp'),
                            id_mp: el.attr('data-id'),
                        }, {
                            callback: function() {

                                settings.responseHandler(true, 'Товар успешно добавлен!');
                            }
                        });
                    }
                });
            }
        });

        $('#save-data', modal).click(function() {

            if (!$('select', modal).val()) {

                settings.responseHandler(false, 'Выберите или создайте папку!');
            }
            else {

                if ($('input[type="checkbox"]', modal).is(':checked')) {

                    MyListController.currentFolders[type] = $('select', modal).val();
                }

                MyListController.addToFolder({
                    id_folder: parseInt($('select', modal).val()),
                    mp: el.attr('data-mp'),
                    id_mp: el.attr('data-id'),
                }, {
                    callback: function() {

                        settings.responseHandler(true, 'Товар успешно добавлен!');
                    }
                });

                MyListController.destroyModel();
            }
        });
    },
    destroyModel: function() {

        var modal = $('#modal');

        $('.modal-title', modal).text('');
        $('.modal-body', modal).html('');

        $('#save-data', modal).unbind();

        modal.unbind().modal('hide');
    }
}

$(function() {

    MyListController.init();
})