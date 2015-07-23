nv.addGraph(function() {
    d3.text("data/data.csv", function(data) {
        var rawData = d3.csv.parseRows(data);
        var passedData = setupData(rawData);
        var nvData = convertTo(passedData);
        var secondaryData;

        var chart = nv.models.discreteBarChart()
                .x(function(d) { return d.category })    //Specify the data accessors.
                .y(function(d) { return d.rfp })
                .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
                .showValues(true)       //...instead, show the bar value right on top of each bar.

        d3.select('#chart svg')
            .datum(nvData)
            .call(chart)

        var chart2 = nv.models.discreteBarChart()
            .x(function(d) { return d.category })    //Specify the data accessors.
            .y(function(d) { return d.cost })
            .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
            .showValues(true)       //...instead, show the bar value right on top of each bar.

        nv.utils.windowResize(chart.update);

        chart.discretebar.dispatch.on("elementClick", function(e) {
            console.log(e);
            secondaryData = convertSpecific(e.data.categories);

            d3.select('#chart-detail svg')
                .datum(secondaryData)
                .call(chart2)
        });

        return chart;
    });

});

//Each bar represents a single discrete quantity.
/*
function exampleData() {
    return  [
        {
            key: "Cumulative Return",
            values: [
                {
                    "category" : "A Label" ,
                    "rfp" : 100
                } ,
                {
                    "category" : "B Label" ,
                    "rfp" : 10
                } ,
                {
                    "category" : "C Label" ,
                    "rfp" : 95
                } ,
                {
                    "category" : "D Label" ,
                    "rfp" : 42
                } ,
                {
                    "category" : "E Label" ,
                    "rfp" : 21
                } ,
                {
                    "category" : "F Label" ,
                    "rfp" : 30
                } ,
                {
                    "category" : "G Label" ,
                    "rfp" : 13.925743130903
                } ,
                {
                    "category" : "H Label" ,
                    "rfp" : 5.1387322875705
                }
            ]
        }
    ]

}*/
