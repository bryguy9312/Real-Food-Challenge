var View = function(settings) {
    var self = this;
    self.charts = [];
    self.settings = settings;
    self.build();
};

View.prototype.build = function() {
    var self = this;
    /*d3.json("data/data.json", function(error, response){
        debugVars.data = response;
        debugMsg('Data Loaded!');
        var categorized = dataCategorize(response)
        var initialData = initData(categorized);
        var categoryResults = {};
        // Loops through each of the categories and breaks them down into the four components of real food.
        for(category in categorized) {
            var realFoodData = realData(categorized[category]);
            categoryResults[category] = realFoodData;
        }
        debugVars.categoryResults = categoryResults;

        data = initialData;

        //method to contain all graphing
        var bindData = merge_options(initialData, categoryResults);*/
    data = [
        {
            'category': 'baked',
            'fakeFood': 32225,
            'realFood': 391,
            'totalFood': 32616,
            'total': 391.68,
            'rfp': 9.78,
            'categories':
            [
                {
                    'category': 'ecological',
                    'cost': 391.68
                },
                {
                    'category': 'fair',
                    'cost': 0
                },
                {
                    'category': 'humane',
                    'cost': 0
                },
                {
                    'category': 'local',
                    'cost': 0
                },
                {
                    'category': 'total',
                    'cost': 391.68
                }
                ]
        },
        {
            'category': 'beverages',
            'fakeFood': 67297,
            'realFood': 7303,
            'totalFood': 74600,
            'rfp': 72.225,
            'categories':
                [
                    {
                        'category': 'ecological',
                        'cost': 6912
                    },
                    {
                        'category': 'fair',
                        'cost': 2916
                    },
                    {
                        'category': 'humane',
                        'cost': 0
                    },
                    {
                        'category': 'local',
                        'cost': 269
                    },
                    {
                        'category': 'total',
                        'cost': 7303
                    }
                ]

        }
    ];
    //View 1 BarGraph
    self.charts.push(new BarGraph({
        data:data
    }));
    //This needs to be changed so that it implements
    self.charts.push(new BarGraph({
        data:data[0].categories,
        yVar: 'cost',
        hoverTitle: 'cost($): ',
        id: 'svg2'
    }));

    d3.select('#svg1').selectAll('rect').on('click', function(d) {
       self.charts.push(new BarGraph({
           data: d.categories,
           yVar: 'cost',
           hoverTitle: 'cost($)',
           id: 'svg2'
       }));
    });
    //View 2 BarGraph

    self.buildControls();

      /*  self.charts.push(new BarGraph({data:initialData}));
        self.buildControls();

    });*/
};

View.prototype.buildControls = function() {
    //no controls yet
};

debugVars.barsGraph = new BarGraph({data:data});