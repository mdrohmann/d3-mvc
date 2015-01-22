var d3 = require('d3');

function Scatter2dView(view) {
    this.view = view;
    this.model = view.model;
}

Scatter2dView.prototype = {};

Scatter2dView.prototype.display = function () {
    this.view.axis.update();
    var svg = this.view.axis.draw_area;
    var adapter = this.view.axis.adapter();

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

module.exports = Scatter2dView;

/* vim: set sw=4: */
