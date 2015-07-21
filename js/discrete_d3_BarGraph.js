"use strict";

var data = {};
var BarGraph = function(settings){
    var self = this;
    self.defaults = {
        margin: {
            left:50,
            bottom: 100,
            top: 50,
            right: 50
        },
        xVar: 'category',
        yVar: 'RFP',
        width: 25
    };
    self.settings = $.extend(false, self.defaults, settings);
    self.settings.height = 400 - self.settings.margin.bottom - self.settings.margin.top;
    self.settings.width  = 400 - self.settings.margin.left - self.settings.margin.right;

    self.rectFunc = function(rect) {
        debugMsg('=======rectFunc executing=======')
        debugMsg('self.width: ' + self.settings.width);
        debugMsg('self.index: ' + self.settings.index);
        debugMsg('self.margin.right: ' + self.settings.margin.right);
        console.log(self.settings.data);
        console.log(rect);

        rect.attr('width', self.xScale(15))

            .attr('height', function(d) {
                return self.xScale((d.realFood / d.totalFood) * 1000)
            })

            .attr('fill', 'blue')

            .attr('x', function(d, index) {
                return  (self.xScale((index * 20)));
            })

            .attr('y', function(d, index) {
                return (self.settings.height - self.xScale((d.realFood / d.totalFood) * 1000));
            })

            .attr('title', function(d) {
                debugMsg('rectFunc title');
                 return d.category + ": $" + (d.realFood/ d.totalFood);
            });
        debugMsg('=======rectFunc ending=======')
    };

    self.build();
};

BarGraph.prototype.setScales = function() {
    debugMsg('setting scales');
    var self = this;
    var yMin = 0;
    var yMax = 100;

    self.xScale = d3.scale.linear().range([0, self.settings.width]).domain([0, self.settings.width]);
    self.yScale = d3.scale.linear().range([self.settings.height, 0]).domain([yMin, yMax]);

    self.xAxis = d3.svg.axis().scale(self.xScale).orient('bottom');
    self.yAxis = d3.svg.axis().scale(self.yScale).orient('left');
    debugMsg('scales set');
};

BarGraph.prototype.build = function() {
    debugMsg('building');
    var self = this;
    //creates a 400x400 svg in the body, this will need to be modified to fit in the final html
    self.svg = d3.select('body').append('svg').attr('height', 400).attr('width', 400);

    //G for bars
    self.g = self.svg.append('g')
        .attr('transform', 'translate(' + self.settings.margin.left + ',' + self.settings.margin.top + ')')
        .attr('height', self.settings.height)
        .attr('width', self.settings.width);
    debugVars.g = self.g;

    //G for x axis
    self.xAxisG = self.svg.append('g')
        .attr('transform', 'translate(' + self.settings.margin.left + ',' + (self.settings.height + self.settings.margin.top) + ')')
        .attr('class', 'axis');

    //G for y axis
    self.yAxisG = self.svg.append('g')
        .attr('transform', 'translate(' + self.settings.margin.left + ',' + (self.settings.margin.top) + ')')
        .attr('class', 'axis');

    self.draw();
    self.addHover();
    debugMsg('building done');
};

BarGraph.prototype.draw = function() {
    debugMsg('drawing');
    var self = this;
    self.setScales();
    // bind self.settings.data
    debugMsg('binding data to rectangles');
    var bars = self.g.selectAll('rect').data(self.settings.data);
    debugMsg("data is bound to rectangles, logging bound data");
    console.log(self.settings.data);
    //enter new elements
    bars.enter().append('rect').call(self.rectFunc);
    console.log(bars);
    // exit elements that may have left
    bars.exit().remove();
    //transition all rects to new self.settings.data??
    self.g.selectAll('rect').transition().duration(1500).call(self.rectFunc);

    self.xAxisG.call(self.xAxis);
    self.yAxisG.call(self.yAxis);
    debugMsg('drawing done');
    debugVars.self = self;
};

BarGraph.prototype.addHover = function() {
    $('rect').tooltip({
        'container': 'body',
        'placement': 'bottom'
    })
};

