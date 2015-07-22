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
    /*var passedData = [
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
    ];*/


    //View 1 BarGraph
    self.charts.push(new BarGraph({
        data:passedData
    }));
    //This needs to be changed so that it implements
    /*self.charts.push(new BarGraph({
        data:data[0].categories,
        yVar: 'cost',
        hoverTitle: 'cost($): ',
        id: 'svg2'
    }));*/

    d3.select('#svg1').selectAll('rect').on('click', function(d) {
        d3.select('#svg2').remove();
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

/*
 ********************************
 * DATA MANIPULATION FUNCTIONS  *
 ********************************
 */

var setupData = function(rawData) {
    transformedData = dataTransform(rawData);
    debugVars.transformedData = transformedData;
    var categorized = dataCategorize(transformedData);
    var formattedData = initData(categorized);
    var categoryResults = {};
    // Loops through each of the categories and breaks them down into the four components of real food.

    for(var i = 0; i < formattedData.length; i++) {
        if(formattedData[i].category != 'total') {
            var category = formattedData[i].category;
            var realFoodData = realData(categorized[category]);
            formattedData[i]['categories'] = realFoodData;
        } else {
            var totalRealFood = realData(transformedData);
            formattedData[i]['categories'] = totalRealFood;
        }
    }
    debugVars.formattedData = formattedData;
    return formattedData;
}
// Transforms the data from CSV to the JSON-esque format.
var dataTransform = function(rawData) {
    debugMsg('Data Transforming!');
    var key;
    var transformedData = [];
    rawData.map(function(rawRow) {
        // Sets the key
        if(!key)
            key = rawRow;
        else {
            if(checkValid(rawRow)) {
                var transformedRow = {};
                // Iterate through the row data;
                for(var i = 0; i < rawRow.length; i++) {
                    var fieldTitle = key[i];
                    // Checks if the category doesn't exist, then labels it "uncategorized"
                    if(key[i] == 'Category' && rawRow[i] == '')
                        rawRow[i] = 'uncategorized';
                    transformedRow[fieldTitle] = rawRow[i];
                }
                transformedData.push(transformedRow);
            }
        }
    });
    debugMsg('Data Transformed!');
    debugVars.key = key;
    return transformedData;
};

/**
 * Removes any entries that do not have a name or cost.
 */
var checkValid = function(rawRow) {
    valid = true;
    // rawRow[0] = item name; rawRow[11] = item cost
    if (rawRow[0] == '' || rawRow[11] == '') {
        valid = false;
    }
    if (valid == false)
        debugMsg("Entry has failed the test: " + rawRow);
    return valid;
}

/**
 * Organizes the raw data into categories.
 * @param {Object[]} data - The raw data from the json file.
 * @return {Object[]} categorized - The data sorted into categories.
 */
var dataCategorize =  function(data) {
    debugMsg('Categorizing data!');
    var categorized = {};
    data.map(function(entry){
        var category = entry.Category;
        if(!categorized.hasOwnProperty(category))
            categorized[category] = [];
        categorized[category].push(entry);
    });
    debugMsg('Data categorized!');
    debugVars.categorized = categorized;
    return categorized;
};

/**
 * Creates the data for Real Food Value.
 * @param {Object[]} data - The categorized data.
 * @return {Object[]} initialData - Calculated Real Food Value totals.
 */
var initData = function(categorizedData) {
    debugMsg('Creating initial data!');
    var initialData = [];
    // Iterates through each category
    var totalRealFood = 0;
    var totalFakeFood = 0;
    for (var category in categorizedData) {
        // Checks that the key exists in the data set
        if (categorizedData.hasOwnProperty(category)) {
            var realFood = 0;
            var fakeFood = 0;
            // Iterates through each food item
            categorizedData[category].map(function(food) {
                if(checkRealFood(food)) {
                    realFood += parseFloat(food.Cost);
                    totalRealFood += parseFloat(food.Cost);
                } else {
                    fakeFood += parseFloat(food.Cost);
                    totalFakeFood += parseFloat(food.Cost);
                }
            });
            initialData.push({
                'category' : category,
                'realFood' : realFood,
                'fakeFood' : fakeFood,
                'totalFood' : realFood + fakeFood,
                'rfp' : (realFood / (realFood + fakeFood)) * 100
            })
        } else
            debugMsg("Execution error! Unidentified key passed!")
    }
    initialData.push({
        'category': 'total',
        'realFood': totalRealFood,
        'fakeFood': totalFakeFood,
        'totalFood': totalRealFood + totalFakeFood,
        'rfp': (totalRealFood / (totalRealFood + totalFakeFood)) * 100
    });
    debugMsg('Initial data created!');
    debugVars.initialData = initialData;
    return initialData;
};

/**
 * Breaks down real food into the four categories (Local, Fair, Ecological, Humane).
 * NOTE: Duplicates are added, so there is a chance that you will go over 100%. Still pending fix.
 * @param {Object[]} category - An organized category.
 * @return {Object[]} categorized - The total amount of real food divided into the categories.
 */
var realData = function(category) {
    //debugMsg('Creating real data!');
    var realFood = {
        'local' : 0,
        'fair' : 0,
        'ecological' : 0,
        'humane': 0,
        'total' : 0
    };
    var realFood = [
        {
            'category': 'ecological',
            'cost' : 0
        },
        {
            'category': 'fair',
            'cost' : 0
        },
        {
            'category': 'humane',
            'cost' : 0
        },
        {
            'category': 'local',
            'cost' : 0
        },
        {
            'category': 'total',
            'cost' : 0
        }
    ]
    category.map(function(food) {
        if(checkRealFood(food)) {
            if(food.Ecological == 'yes')
                realFood[0].cost += parseFloat(food.Cost);
            if(food.Fair == 'yes')
                realFood[1].cost += parseFloat(food.Cost);
            if(food.Humane == 'yes')
                realFood[2].cost += parseFloat(food.Cost);
            if(food.Local == 'yes')
                realFood[3].cost += parseFloat(food.Cost);
            realFood[4].cost += parseFloat(food.Cost);
        }
    });
    debugVars.realFood = realFood;
    //debugMsg('Real data created!');
    return realFood;
};

/**
 * Creates the data for Real Food Value.
 * @param {Object[]} data - The categorized data.
 * @return {Object[]} initialData - Calculated Real Food Value totals.
 */
var checkRealFood = function(entry) {
    if (entry.Disqualifier == 'yes')
        return false;
    return (entry.Local == 'yes' || entry.Fair == 'yes' || entry.Ecological == 'yes' || entry.Humane == 'yes');
};