//Debug Functions
var debugMode = true;
var debugVars = {};

var debugMsg = function(msg) {
    if (debugMode)
        console.log('<<<|DEBUG|>>> ' + msg);
};

//Asynchronous function, all manipulation should occur in here.
debugMsg('Data Loading!')
d3.json("data/data.json", function(error, data){
    debugVars.data = data;
    debugMsg('Data Loaded!')
    var categorized = dataCategorize(data)
    var initialData = initData(categorized);
});

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

var initData = function(data) {
    debugMsg('Creating initial data!');
    var initialData = {};
    // Iterates through each category
    for (var category in data) {
        if (data.hasOwnProperty(category)) {
            debugVars.category = category;
            var realFood = 0;
            var fakeFood = 0;
            // Iterates through each food item
            data[category].map(function(food) {
                    if(checkRealFood(food))
                        realFood += parseFloat(food.Cost);
                    else
                        fakeFood += parseFloat(food.Cost);
            });
            initialData[category] = {
                'realFood' : realFood,
                'fakeFood' : fakeFood,
                'totalFood' : realFood + fakeFood
            }
        } else
            debugMsg("Execution error! Unidentified key passed!")
    }
    debugMsg('Initial data created!');
    debugVars.initialData = initialData;
    return initialData;
};

var checkRealFood = function(entry) {
    if (entry.Disqualifier == 'yes')
        return false;
    return (entry.Local == 'yes' || entry.Fair == 'yes' || entry.Ecological == 'yes' || entry.Humane == 'yes');
}

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