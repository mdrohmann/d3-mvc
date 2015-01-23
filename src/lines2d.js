var d3 = require('d3');
var Axis2d = require('./axis2d.js');

function Lines2dView(view, configuration) {
    this.view = view;
    this.model = view.model;
    this.configure(configuration);
}

Lines2dView.prototype = {};

Lines2dView.prototype.configure = function(configuration) {
    this.interpolation = configuration.interpolation || 'linear';
    this.color = configuration.color || this.view.color_scale();
};

Lines2dView.prototype.display = function () {
    this.view.axis.update();
    var svg = this.view.axis.draw_area;
    var adapter = this.view.adapter();
    var color = this.color;
    color.domain(this.view.get_names());

    var line = d3.svg.line()
        .interpolate(this.interpolation)
        .x(function (d) { return d[0]; })
        .y(function (d) { return d[1]; });

    var lines = svg.selectAll('.line')
        .data(adapter.data(), function(d) { return d.name; });

    /* one graph for each model */
    // enter
    lines.enter()
      .append('path')
        .attr('class', function(d) { return 'line ' + d.name; })
        .style('stroke', function(d) { return color(d.name); })
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
