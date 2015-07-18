//Debug Functions
var debugMode = true;

var debugMsg = function(msg) {
    if (debugMode)
        console.log('<<<|DEBUG|>>> ' + msg);
}

d3.json("data/data.json", function(error, data){
    //Asynchronous function, all manipulation should occur in here.
});