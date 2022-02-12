var pagination = {
    currentPage: 1,
    init: function(el, xhr, handler) {

        if (!el.is(':visible')) {

            el.show();

            el.click(function() {


            });
        }
    }
}