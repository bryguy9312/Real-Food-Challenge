//Debug Functions
var debugMode = true;
var debugVars = {};

var debugMsg = function(msg) {
    if (debugMode)
        console.log('<<<|DEBUG|>>> ' + msg);
};

//Asynchronous function, all manipulation should occur in here.
debugMsg('Data Loading!');
d3.json("data/data.json", function(error, data){
    debugVars.data = data;
    debugMsg('Data Loaded!');
    var categorized = dataCategorize(data)
    var initialData = initData(categorized);
    var categoryResults = {};
    // Loops through each of the categories and breaks them down into the four components of real food.
    for(category in categorized) {
        var realFoodData = realData(categorized[category]);
        categoryResults[category] = realFoodData;
    }
    debugVars.categoryResults = categoryResults;

    //method to contain all graphing
    var view = new View();

});

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
        if(category == "")
            category = "uncategorized";
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
var initData = function(data) {
    debugMsg('Creating initial data!');
    var initialData = [];
    // Iterates through each category
    for (var category in data) {
        // Checks that the key exists in the data set
        if (data.hasOwnProperty(category)) {
            var realFood = 0;
            var fakeFood = 0;
            // Iterates through each food item
            data[category].map(function(food) {
                if(checkRealFood(food))
                    realFood += parseFloat(food.Cost);
                else
                    fakeFood += parseFloat(food.Cost);
            });
            initialData.push({
                'category' : category,
                'realFood' : realFood,
                'fakeFood' : fakeFood,
                'totalFood' : realFood + fakeFood,
                'rfp' : (realFood / fakeFood) * 100
            })
        } else
            debugMsg("Execution error! Unidentified key passed!")
    }
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
    category.map(function(food) {
        if(checkRealFood(food)) {
            if(food.Local == 'yes')
                realFood.local += parseFloat(food.Cost);
            if(food.Fair == 'yes')
                realFood.fair += parseFloat(food.Cost);
            if(food.Ecological == 'yes')
                realFood.ecological += parseFloat(food.Cost);
            if(food.Humane == 'yes')
                realFood.humane += parseFloat(food.Cost);
            realFood.total += parseFloat(food.Cost);
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


//helper function that merges two objects
var merge_options = function(obj1,obj2){
    var obj3 = {};

    return obj3;
};


/*
 Category 1: Initial Data #rfpover!rfp
 {
 category: {
 'realFood': #,
 'fakeFood': #,
 'totalCost': #,
 }
 }

 Category 2: Upon being clicked, this data is required #barexplosion
 {
 category: {
 'realFood': #,
 'ecological': $,
 'humane': $,
 'fair': $,
 'local': $,
 }
 }

 Category 3: Fake foods?
 */

/*
 Total Costs
 Cost of Real Food
 Costs of Fake Food
 Total Costs


 */

/* Simplifies the data to
 var dataSimplify = function(data) {
 debugMsg('Data simplifying!');
 var simplifiedData = [];
 // [ { "label" : #, "value" : $} ]
 for (var key in data) {
 if (data.hasOwnProperty(key)) {
 var label = key;
 var value = data[key].length;
 simplifiedData.push({
 'label' : label,
 'value' : value
 });
 } else
 debugMsg("Execution error! Unidentified key passed!")
 }
 debugVars.simplifiedData = simplifiedData;
 debugMsg('Data Simplified!');
 return simplifiedData;
 }
 */