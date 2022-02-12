var ProductTableController = {
    html: '',
    graphs: [],
    uppendHTML: function (element) {

        element.append(this.html);

        return this;
    },
    insertHTML: function(element) {

        if (this.html) {

            element.html(this.html);
        }
        else {

            element.html('По данному запросу ничего не найдено!');
        }

        return this;
    },
    insertThead: function(element, html) {

        element.html(html);

        return this;
    },
    applyGraphs: function() {

        for (var i in this.graphs) {

            $(`#${this.graphs[i].key}`).sparkline(this.graphs[i].elements, {
                type: 'bar',
                lineColor: '#17997f',
                fillColor: '#1ab394',
                chartRangeMin: 0,
                height: '40px',
                width: '80px',
            });
        }

        return this;
    },
    generateHTML: function(elements, fields, type) {

        this.html = '';

        for (var i in elements) {

            var rowHTML = '';

            for (var j in fields) {

                rowHTML += fields[j](elements[i]);
            }

            this.html += `
                <tr>
                    ${rowHTML}
                </tr>
            `;

            try {

                var key;

                if (type) {

                    key = `sparkline${elements[i][type].id}`;
                }
                else {

                    key = `sparkline${elements[i].product.id}`;
                }

                this.graphs.push({
                    elements: ChartsController.prepareGraphData(elements[i]),
                    key: key
                });
            }
            catch ($e) {}

        }

        return this;
    },
    prepareCategoryLink: function(element, cut) {

        if (element.category) {

            var path = element.category.path;

            if (cut) {

                var splitted = path.split('/');

                path = settings.truncateString(splitted[splitted.length - 1], cut);
            }

            return `
                <a class="category-link" href="/client/category?id=${element.category.id}">
                    <img style="width: 12px;margin-top: -2px;" src="/images/${element.category.mp}.ico" />
                    ${path}
                </a>
            `;
        }

        return '';
    },
    prepareSeller: function(element, withoutImage) {

        if (element.seller) {

            var name = element.seller.name == 'unknown' ? 'Неизвестно' : element.seller.name,
                html = `<a href="/client/seller?id=${element.seller.id}">${name}</a>`;

            if (withoutImage) {

                return html;
            }

            return `
                <img style="width: 12px;margin-top: -4px;" src="/images/${element.seller.mp}.ico" />
                ${html}
            `;
        }

        return `-`;
    },
    prepareImage: function(element) {

        return new Promise(function (resolve, reject) {

            var img = new Image()

            img.onload = function() {

                if (img.height > img.width) {

                    var koeff = img.height / 96;

                    resolve(`
                        <div class="col-lg-3" style="padding: 0;">
                            <img style="height: 96px; width: ${img.width / koeff}px; margin: 0 auto;float: right;" src="${element.product.image}">          
                        </div>
                    `);
                }
                else {

                    resolve(`
                        <div class="col-lg-3">
                            <img style="width: 90px;" src="${element.product.image}">
                        </div>
                    `);
                }
            }

            img.onerror = reject

            img.src = element.product.image
        });
    },
    prepareDiscount: function(element) {

        return Math.round(element.product.rate * 10) / 10;
    },
    prepareBrand: function(element) {

        if (element.brand) {

            return `
                <img style="width: 12px;margin-top: -4px;" src="/images/${element.brand.mp}.ico" />
                <a href="/client/brand?id=${element.brand.id}">${element.brand.name}</a>
            `;
        }

        return `-`;
    },
    prepareSale: function(element, isProduct) {

        if ((element.product && element.product.discount) || isProduct) {

            var product;

            if (isProduct) {

                product = element;
            }
            else {

                product = element.product;
            }

            return `
                <span class="old-price-percent">(-${product.discount}%)</span>
                <span class="old-price">${settings.intToMoney(product.price_with_discount)}&nbsp;руб.</span>
            `;
        }

        return '';
    },
    prepareAmount: function(element) {

        if (element.mp == 'ali') {

            return '-';
        }

        if (~serializeHelper.getQuery().indexOf('fbs')) {

            return element.product.store_amount;
        }

        return element.product.amount;
    }
}