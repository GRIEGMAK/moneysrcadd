var RouterController = {
    defaultPage: 'dashboard',
    container: $('#page-content'),
    templatesPath: '/client/templates/',
    init: function() {

        this.handleCurrentState();

        History.Adapter.bind(window, 'statechange', function() {

            var state = History.getState();

            $('#page-preloader').show();

            RouterController.container.load(state.data.load_url);
        });
    },
    handleCurrentState: function() {

        this.setActiveLink(document.location.pathname);

        this.container.load(`${this.templatesPath}${this.getCurrentPath()}.html?id=${new Date().getTime()}`, function() {
            //if ($('.dynamic-content title').length == 1)
            //    location.replace('/404.html');
        });
    },
    getCurrentPath: function() {

        return document.location.pathname == "/client/" ? this.defaultPage : document.location.pathname.split('/').slice(2).join('/');
    },
    setState: function(template, title, url) {

        if (url != `/client/${this.getCurrentPath()}`) {


        }

        this.loadHandler(false);

        History.pushState({
            load_url: `${this.templatesPath}${template}.html?id=${new Date().getTime()}`
        }, title, url);

    },
    setActiveLink: function(url) {

        $('#side-menu li').removeClass('active');

        $(`#side-menu a[href="${url}"]`).parent().addClass('active');
    },
    loadHandler: function(status) {

        if (status) {

            this.container.show();

            PermissionController.applyPermissions();

            CommonController.setPeriodOption();
        }
        else {

            this.container.hide();
        }
    }
}

$(function() {

    RouterController.init();

    $('#side-menu a').on('click', function(e) {

        if ($(this).attr('target')) return true;

        e.preventDefault();

        RouterController.setActiveLink($(this).attr('href'));

        RouterController.setState($(this).attr('href').split('/')[2], $(this).text(), $(this).attr('href'));
    });

    $('body').on('click', '.autocompvare-suggestions .autocompvare-suggestion a', function(e) {

        e.preventDefault();

        RouterController.setState($(this).attr('href').split('?')[0].split('/')[2], $('>', $(this)).text(), $(this).attr('href'));
    });
});