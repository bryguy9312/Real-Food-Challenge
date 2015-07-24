chartApp.controller('ChartController', ['$scope', function($scope) {
    debugMsg('alternativeData')
    var alternativeData = [];
    $scope.selectedCategory;
    d3.text("data/alternatives.csv", function(data) {
        var rawData = d3.csv.parseRows(data);
        debugVars.rawData = rawData;

        alternativeData = processAlternatives(rawData);
        debugVars.alternativeData = alternativeData;

        $scope.altData = alternativeData;
        $scope.$apply(function() {
            debugMsg("apply was run!");
            $scope.altData = alternativeData;
        });
    });

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
                $('#chart-alternatives').css('display', 'initial');
                d3.select('#chart-detail svg')
                    .datum(e.data.categories)
                    .call(chart2)

                $scope.$apply(function() {
                    debugMsg("apply was run!");
                    $scope.selectedCategory = {'category' : e.data.category};
                });
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

}]);


