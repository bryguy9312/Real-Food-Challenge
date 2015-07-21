var View = function(settings) {
    var self = this;
    self.charts = [];
    self.settings = settings;
    self.build();
};

View.prototype.build = function() {
    var self = this;
    d3.json("data/data.json", function(error, response){
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
        var bindData = merge_options(initialData, categoryResults);
        self.charts.push(new BarGraph({data:initialData}));
        self.buildControls();

    });
    /*data = [
                {
                    'category': 'baked',
                    'fakeFood': 32225,
                    'realFood': 391,
                    'totalFood': 32616,
                    'ecological': 391.68,
                    'fair': 0,
                    'humane': 0,
                    'local': 0,
                    'total': 391.68
                },
                {
                    'category': 'beverages',
                    'fakeFood': 67297,
                    'realFood': 7303,
                    'totalFood': 74600,
                    'ecological': 6912,
                    'fair': 2916,
                    'humane': 0,
                    'local': 269,
                    'total': 7303
                }
            ]
    self.charts.push(new BarGraph({data:data}));
    self.buildControls();*/
};

View.prototype.buildControls = function() {
    //no controls yet
};

debugVars.barsGraph = new BarGraph({data:data});