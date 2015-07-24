nv.addGraph(function() {
    d3.text("data/data.csv", function(data) {
        var rawData = d3.csv.parseRows(data);
        var nvData = setupData(rawData);

        var chart = nv.models.discreteBarChart()
                .x(function(d) {
                    if(d.category == 'teacoffee')
                        return 'Tea/Coffee'
                    else
                        return d.category.capitalize()
                })    //Specify the data accessors.
                .y(function(d) { return d.rfp })
                .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
                .showValues(true)       //...instead, show the bar value right on top of each bar.
                //chart.tooltip.contentGenerator(function(data) {})

        d3.select('#chart svg')
            .datum(nvData)
            .call(chart)

        var chart2 = nv.models.discreteBarChart()
            .x(function(d) { return d.category.capitalize() })    //Specify the data accessors.
            .y(function(d) { return d.cost })
            .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
            .showValues(true)       //...instead, show the bar value right on top of each bar.

        nv.utils.windowResize(chart.update);

        chart.discretebar.dispatch.on("elementClick", function(e) {
            $('#chart-detail').css('display', 'initial');
            d3.select('#chart-detail svg')
                .datum(e.data.categories)
                .call(chart2)

            nv.utils.windowResize(chart2.update);
        });

        var chartTotal = nv.models.pieChart()
            .x(function(d) { return d.category })
            .y(function(d) { return d.percent })
            .donut(true)
            .title('Total')
            .showLegend(false);

        d3.select('#chart-total svg')
            .datum(totalData)
            .call(chartTotal)


        nv.utils.windowResize(chartTotal.update);
    });

});
