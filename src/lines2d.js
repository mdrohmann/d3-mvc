var d3 = require('d3');
var Axis2d = require('./axis2d.js');

function Lines2dView(view) {
    this.view = view;
    this.model = view.model;
    this.container = view.container;
    this.axis = new Axis2d(view);
}

Lines2dView.prototype = {};

Lines2dView.prototype.update = function () {
    this.axis.update();
    var svg = this.axis.draw_area;
    var adapter = this.axis.adapter();

    var lines = svg.selectAll('.circle_container')
        .data(adapter.data(), function(d) { return d.name; });

    /* one graph for each model */
    // enter
    var lines_enter_update = lines.enter()
      .append('g')
        .attr('class', function(d) { return 'circle_container ' + d.name; });

    // update not necessary

    // exit
    lines.exit()
        .remove();

    /* plot the graphs */
    var scatters = lines_enter_update.selectAll('.circle')
        .data(function (d) { return d3.transpose([d.x.map(d.xscale), d.y.map(d.yscale)]); });

    // enter
    var scatters_update_enter = scatters.enter()
      .append('circle')
        .attr('class', 'circle');

    // update and enter
    scatters_update_enter
        .transition()
        .duration(100)
        .attr('r', 3)
        .attr('cx', function(d) { return d[0]; })
        .attr('cy', function(d) { return d[1]; });

    // exit
    scatters.exit()
        .remove();
};

module.exports = Lines2dView;

/* vim: set sw=4: */
