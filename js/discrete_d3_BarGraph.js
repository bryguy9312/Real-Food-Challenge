"use strict";


var data;
var BarGraph = function(settings){
    var self = this;
    self.defaults = {
        margin: {
            left:50,
            bottom: 50,
            top: 50,
            right: 50
        },
        xVar: 'category',
        yVar: 'rfp',
        hoverTitle: 'rfp(%):',
        id: "svg1",
        totalHeight: 600,
        totalWidth: 600
    };
    self.settings = $.extend(false, self.defaults, settings);
    self.settings.height = self.settings.totalHeight - self.settings.margin.bottom - self.settings.margin.top;
    self.settings.width  = self.settings.totalWidth - self.settings.margin.left - self.settings.margin.right;
    self.rectFunc = function(rect) {
        debugMsg('=======rectFunc executing=======');
        debugMsg('self.width: ' + self.settings.width);
        debugMsg('self.index: ' + self.settings.index);
        debugMsg('self.margin.right: ' + self.settings.margin.right);
        console.log(self.settings.data);
        console.log(rect);

        rect.attr('width', self.xScale(20))
            .attr('height', function(d) {
                return self.settings.height - self.yScale(d[self.settings.yVar])
            })
            .attr('fill', '#D74523')
            .attr('x', function(d, index) {
                return  (self.xScale((index * 30)));
            })
            .attr('y', function(d) {
                return (self.yScale(d[self.settings.yVar]));
            })
            .attr('title', function(d) {
                debugMsg('rectFunc title');
                 return self.settings.hoverTitle + d[self.settings.yVar];
            });
        debugMsg('=======rectFunc ending=======')
    };

    self.build();
};

BarGraph.prototype.setScales = function() {
    debugMsg('setting scales');
    var self = this;
    var yMin = 0;
    var yMax = d3.max(self.settings.data, function(d) { return (d[self.settings.yVar])});

    self.xScale = d3.scale.linear().range([0, self.settings.width]).domain([0, self.settings.width]);
    self.yScale = d3.scale.linear().range([self.settings.height, 0]).domain([yMin, yMax]);
    debugVars.yScale = self.yScale;
    self.xAxis = d3.svg.axis().scale(self.xScale).orient('bottom').ticks(0);
    self.yAxis = d3.svg.axis().scale(self.yScale).orient('left');
    debugMsg('scales set');
};

BarGraph.prototype.build = function() {
    debugMsg('building');
    var self = this;
    //creates a 400x400 svg in the body, this will need to be modified to fit in the final html
    self.svg = d3.select('body').append('svg').attr('height', self.settings.totalHeight).attr('width', self.settings.totalWidth).attr('id', this.settings.id);

    //G for bars
    self.g = self.svg.append('g')
        .attr('transform', 'translate(' + self.settings.margin.left + ',' + self.settings.margin.top + ')')
        .attr('height', self.settings.height)
        .attr('width', self.settings.width);

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
    //enter new elements
    bars.enter().append('rect').call(self.rectFunc);
    // exit elements that may have left
    bars.exit().remove();
    //transition all rects to new self.settings.data??
    self.g.selectAll('rect').transition().duration(1500).call(self.rectFunc);

    self.xAxisG.call(self.xAxis);
    self.yAxisG.call(self.yAxis);
    debugMsg('drawing done');
    debugVars.self = self;

    self.svg.selectAll('.bartext').data(self.settings.data).enter().append('text')
        .attr('class', 'bartext')
        .attr('text-anchor', 'middle')
        .attr('x', function(d, i) { return self.xScale(i*50)})
        .attr('y', self.settings.totalHeight - 10)
        .text(function(d) {return d.category});


    self.svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", self.settings.width / 2)
        .attr("y", self.settings.totalHeight-15)
        .text(self.settings.xVar);
    self.svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("y", 5)
        .attr("x", - self.settings.totalHeight/2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(self.settings.yVar);
};

BarGraph.prototype.addHover = function() {
    $('rect').tooltip({
        'container': 'body',
        'placement': 'bottom'
    });
};


