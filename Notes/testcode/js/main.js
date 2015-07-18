//Debug Functions
var debugMode = true;
var debugVars = {};

var debugMsg = function(msg) {
    if (debugMode)
        console.log('<<<|DEBUG|>>> ' + msg);
}

//Asynchronous function, all manipulation should occur in here.
d3.json("data/data.json", function(error, data){
    debugVars.data = data;
    debugMsg('Data Loaded!')
    dataCategorize(data)
});

var dataCategorize =  function(data) {
    debugMsg('Categorizing data!');
    var categorized = {};
    data.map(function(entry){
        var category = entry.Category;
        categorized[category] = entry;
    });
    debugMsg('Data categorized!');
    debugVars.categorized = categorized;
}