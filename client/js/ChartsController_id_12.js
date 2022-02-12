var ChartsController = {
    labels: [],
    colors: {
        blue: "rgb(28,132,198)",
        blue2: "rgb(28,132,198, 0.5)",
        bluea: "rgba(28,132,198, 0.3)",
        green: "rgba(26,179,148,0.7)",
        green2: "rgba(26,179,148)",
        greena: "rgba(26,179,148,0.5)",
        grey: "rgb(220,220,220)",
        greya: "rgba(220,220,220,0.3)",
        orange: "rgb(255, 159, 64)",
        orangea: "rgba(255, 159, 64, 0.3)",
        purple: "rgb(153, 102, 255)",
        purplea: "rgba(153, 102, 255, 0.3)",
        red: "rgb(255, 99, 132)",
        reda: "rgba(255, 99, 132, 0.3)",
        yellow: "rgb(255, 205, 86)",
        yellowa: "rgba(255, 205, 86, 0.3)"
    },
    plotChart: function(data, config, element) {

        if (this[element]) {

            this[element].destroy();
        }

        this[element] = new Chart(document.getElementById(element).getContext("2d"), {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: data
            },
            options: {
                responsive: true,
                stacked: false,
                maintainAspectRatio: false,
                hoverMode: 'index',
                tooltips: {
                    callbacks: {
                        label: function(label, index) {
                            return `${data[label.datasetIndex].label}: ${settings.intToMoney(label.yLabel)} ${data[label.datasetIndex].postfix}`;
                        }
                    },
                    displayColors: false,
                    intersect: true,
                },
                scales: {
                    yAxes: config
                },
            },
        });
    },
    plotScatterChart: function(elements, element, min, max) {

        if (this[element]) {

            this[element].destroy();
        }

        var labels = [],
            data = []

        for (var i in elements) {

            labels.push(elements[i].x);
            data.push(elements[i].y);
        }

        Chart2.plugins.register({
            getLinePosition: function (chart, pointIndex) {
                const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point

                window.test = meta;

                return meta.xScale.left + meta.xScale.width * pointIndex / meta.xScale.max;
            },
            renderVerticalLine: function (chartInstance, pointIndex) {
                const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
                const scale = chartInstance.scales.x;
                const context = chartInstance.ctx;

                // render vertical line
                context.beginPath();
                context.strokeStyle = "#ed5565";
                context.moveTo(lineLeftOffset, scale.top);
                context.lineTo(lineLeftOffset, 0);
                context.stroke();
            },

            afterDatasetsDraw: function (chart, easing) {
                if (chart.config.lineAtIndex) {
                    for (var i in chart.config.lineAtIndex) {

                        this.renderVerticalLine(chart, chart.config.lineAtIndex[i]);
                    }
                    //chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
                }
            }
        });

        window.mychart = new Chart2(document.getElementById(element).getContext("2d"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    barPercentage: 0.7,
                    barThickness: 2,
                    maxBarThickness: 3,
                    minBarLength: 2,
                    backgroundColor: ChartsController.colors.blue,
                    data: data
                }]
            },
            lineAtIndex: [min, max],
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        tick: {
                            min: 40,
                            beginAtZero: false,
                        },
                        offset: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Цена (руб.)'
                        }
                    },
                    y: {
                        type: 'linear',
                        scaleLabel: {
                            display: true,
                            labelString: 'Продажи (шт.)'
                        }
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function(label, index) {
                            return `${label.value} шт. куплено по цене ${label.label} руб.`;
                        }
                    },
                    displayColors: false,
                    intersect: true,
                },
                legend: {
                    display: false
                }
            }
        });

        this[element] = mychart;
    },
    plotScatterChart2: function(data, element, els) {

        /*
        if (this[element]) {

            this[element].destroy();
        }

        var min = els[0].x,
            max = els[els.length - 1].x;

        this[element] = new Chart(document.getElementById(element).getContext("2d"), {
            data: data,
            type: 'line',
            options: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        type: 'linear',
                        gridLines: {
                            drawOnChartArea: true
                        },
                        ticks: {
                            beginAtZero: false,
                            //max: max,
                            min: min,
                            //stepSize: max > 1000 ? 100 : 50,
                            callback: function(label, index, labels) {return settings.intToMoney(label);},
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Цена (руб.)'
                        }
                    }],
                    yAxes: [{
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            callback: function(label, index, labels) {return settings.intToMoney(label);},
                            fontColor: ChartsController.colors.blue
                        },
                        gridLines: {
                            drawOnChartArea: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Продажи (шт.)'
                        }
                    }]
                },
                tooltips: {
                    enabled: false
                },
                elements: {
                    point:{
                        radius: 0
                    }
                },
            }
        });

         */
    },
    preparePriceData: function(elements) {

        var result = [];

        for (var i in elements) {

            result.push({
                x: parseInt(i),
                y: parseInt(elements[i])
            });
        }

        return result;
    },
    prepareData: function(elements, resultChart, resultTabs) {

        this.labels = [];

        for (var i in elements) {

            if (~elements[i].date.indexOf('20-')) {

                var date = elements[i].date.split('20-')[1].replace('-', '.').split('.');
            }
            else if (~elements[i].date.indexOf('21-')) {

                var date = elements[i].date.split('21-')[1].replace('-', '.').split('.');
            }
            else {

                var date = elements[i].date.split('22-')[1].replace('-', '.').split('.');
            }

            this.labels.push(`${date[1]}.${date[0]}`);

            for (var j in resultChart) {

                if (j == 'position') {

                    if (elements[i][j]) {

                        resultChart[j].push(elements[i][j]);
                    }
                }
                else {

                    resultChart[j].values.push(elements[i][j]);
                }
            }

            for (var j in resultTabs) {

                resultTabs[j].value += parseInt(elements[i][j]);
            }
        }

        for (var i in resultTabs) {

            if (resultTabs[i].round) {

                resultTabs[i].value = (Math.round(resultTabs[resultTabs[i].round[0]].value / resultTabs[resultTabs[i].round[1]].value)) || 0;
            }

            if (elements.length > 1) {

                if (i == 'total_amount') {

                    resultTabs[i].value = elements[elements.length - 1][i];
                }

                if (elements[elements.length - 2][i]) {

                    resultTabs[i].difference = Math.round(elements[elements.length - 1][i] * 100 / elements[elements.length - 2][i]);
                }
                else {

                    resultTabs[i].difference = 200;
                }

                if (resultTabs[i].difference) {

                    if (resultTabs[i].difference > 100) {

                        resultTabs[i].difference  = resultTabs[i].difference - 100;

                        resultTabs[i].isIncrease = true;
                    }
                    else {

                        resultTabs[i].difference  = 100 - resultTabs[i].difference;

                        resultTabs[i].isIncrease = false;
                    }
                }
                else {

                    resultTabs[i].isIncrease = null;
                }
            }
        }

        return [resultChart, resultTabs];
    },
    prepareOrderedGraphData: function(elements) {

        var result = [];

        for (var i in elements) {

            result.push(elements[i].total_sale);
        }

        return result;
    },
    prepareGraphData: function (element) {

        var result = [];

        for (var i in element.date_graph) {

            result.push({
                sales: element.sale_graph[i],
                date: (new Date(element.date_graph[i])).getTime()
            });
        }

        result.sort(function (a,b) { return a.date-b.date});


        var data = [];

        for (var i in result) {

            data.push(result[i].sales);
        }

        return data;
    }
}

