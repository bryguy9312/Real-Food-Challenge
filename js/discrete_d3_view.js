var View = function(settings) {
    var self = this;
    self.charts = [];
    self.settings = settings;
    self.build();
};



View.prototype.build = function() {
    var self = this;



    //View 1 BarGraph
    self.charts.push(new BarGraph({
        data:passedData
    }));

    self.charts.push(new BarGraph({
        data:passedData[10].categories,
        yVar: 'cost',
        id: 'svg2'
    }));

    d3.select('#svg1').selectAll('rect').on('click', function(d) {
        d3.select('#svg2').remove();
        self.charts.push(new BarGraph({
           data: d.categories,
           yVar: 'cost',
           id: 'svg2'
       }));
    });
    //View 2 BarGraph

    self.buildControls();

};

View.prototype.buildControls = function() {
    //no controls yet
};