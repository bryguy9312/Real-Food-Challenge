var View = function(settings) {
    var self = this;
    self.charts = [];
    self.settings = settings;
    self.build();
};

View.prototype.build = function() {
    var self = this;
    //TEST DATA, NEED TO PASS IN REAL DATA
    data = {
        'baked': {
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
        'beverages': {
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
};
    self.charts.push(new BarGraph({data:data}));
    self.buildControls();
};

View.prototype.buildControls = function() {
    //no controls yet
};

debugVars.barsGraph = new BarGraph({data:data});