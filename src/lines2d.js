var d3 = require('d3');
var Axis2d = require('./axis2d.js');

function Lines2dView(view, configuration) {
    this.view = view;
    this.configure(configuration);
}

Lines2dView.prototype = {};

Lines2dView.prototype.configure = function(configuration) {
    this.interpolation = configuration.interpolation || 'linear';
    this.color = configuration.color || this.view.color_scale();
};

Lines2dView.prototype.legend_icon = function(index, selection) {
    var color = this.color;
    color.domain(this.view.get_names());
    var name = this.view.adapter().name(index);
    var c = color(name);

    selection.append('path')
        .attr('class', 'line ' + name)
        .style('stroke', c)
        .attr('d', 'M0,3L14,3');
};

Lines2dView.prototype.display = function () {
    this.view.axis.update();
    var svg = this.view.axis.draw_area;
    var adapter = this.view.adapter();
    var color = this.color;
    color.domain(this.view.get_names());

    var data = adapter.data();
    var line = d3.svg.line()
        .interpolate(this.interpolation)
        .x(function (d) { return d[0]; })
        .y(function (d) { return d[1]; });

    var lines = svg.selectAll('.line')
        .data(data, function(d) { return d.key; });

    /* one graph for each model */
    // enter
    lines.enter()
      .append('path');

    // enter and update
    lines.attr('class', function(d) { return 'line ' + d.key; })
        .transition()
        .duration(300)
        .style('stroke', function(d) { return color(d.name); })
        .attr('d', function(d) {
            var ds = d3.transpose([d.x.map(d.xscale), d.y.map(d.yscale)]);
            return line(ds);
        });

    // exit
    lines.exit()
        .remove();

};

module.exports = Lines2dView;

/* vim: set sw=4: */
