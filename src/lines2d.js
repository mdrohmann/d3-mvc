var d3 = require('d3');
var Axis2d = require('./axis2d.js');

function Lines2dView(view) {
    this.view = view;
    this.model = view.model;
}

Lines2dView.prototype = {};

Lines2dView.prototype.display = function () {
    this.view.axis.update();
    var svg = this.view.axis.draw_area;
    var adapter = this.view.axis.adapter();

    var line = d3.svg.line()
        .interpolate('cardinal')
        .x(function (d) { return d[0]; })
        .y(function (d) { return d[1]; });

    var lines = svg.selectAll('.line')
        .data(adapter.data(), function(d) { return d.name; });

    /* one graph for each model */
    // enter
    lines.enter()
      .append('path')
        .attr('class', function(d) { return 'line ' + d.name; })
        .attr('d', function(d) {
            var ds = d3.transpose([d.x.map(d.xscale), d.y.map(d.yscale)]);
            return line(ds);
        });

    // update not necessary

    // exit
    lines.exit()
        .remove();

};

module.exports = Lines2dView;

/* vim: set sw=4: */
