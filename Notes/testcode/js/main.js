

//Debug Functions
var debugMode = true;
var debugVars = {};

var debugMsg = function(msg) {
    if (debugMode)
        console.log('<<<|DEBUG|>>> ' + msg);
};

//Asynchronous function, all manipulation should occur in here.
// !!! IMPORTANT !!! formattedData is the data formatted exactly to specification.
debugMsg('Data Loading!');
var passedData = [];

d3.text("data/data.csv", function(data) {
    var rawData = d3.csv.parseRows(data);
    passedData = setupData(rawData);
});

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
    if (rawRow[0] == '' || rawRow[1] == '' || rawRow[11] == '') {
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

