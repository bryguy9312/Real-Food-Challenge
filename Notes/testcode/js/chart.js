nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.category })    //Specify the data accessors.
            .y(function(d) { return d.rfp })
            .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
            .showValues(true)       //...instead, show the bar value right on top of each bar.
        ;

    d3.select('#chart svg')
        .datum(exampleData())
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});

//Each bar represents a single discrete quantity.
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

}