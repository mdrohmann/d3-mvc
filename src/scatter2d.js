var d3 = require('d3');

function Scatter2dView(view, configuration) {
    this.view = view;
    this.configure(configuration);
}

Scatter2dView.prototype = {};

Scatter2dView.prototype.configure = function(configuration) {
    this.color = configuration.color || this.view.color_scale();
};

Scatter2dView.prototype.legend_icon = function(index, selection) {
    var color = this.color;
    color.domain(this.view.get_names());
    var name = this.view.adapter().name(index);
    var c = color(name);

    selection.append('circle')
        .attr('class', 'circle ' + name)
        .style('fill', c)
        .attr('r', 3)
        .attr('cx', 8)
        .attr('cy', 3);
};

Scatter2dView.prototype.display = function () {
    this.view.axis.update();
    var svg = this.view.axis.draw_area;
    var adapter = this.view.adapter();
    var color = this.color;
    color.domain(this.view.get_names());

    var data = adapter.data();

    var lines = svg.selectAll('.circle_container')
        .data(data, function(d) { return d.key; });

    /* one graph for each model */
    // enter
    lines.enter()
      .append('g');

    lines.attr('class', function(d) { return 'circle_container ' + d.key; })
        .style('fill', function (d) { return color(d.name); });

    // update not necessary

    // exit
    lines.exit()
        .remove();

    /* plot the graphs */
    var scatters = lines.selectAll('.circle')
        .data(function (d) { return d3.transpose([d.x.map(d.xscale), d.y.map(d.yscale)]); });

    // enter
    scatters.enter()
      .append('circle')
        .attr('class', 'circle');

    // update and enter
    scatters
        .transition()
        .duration(300)
        .attr('r', 3)
        .attr('cx', function(d) { return d[0]; })
        .attr('cy', function(d) { return d[1]; });

    // exit
    scatters.exit()
        .remove();
};

module.exports = Scatter2dView;

/* vim: set sw=4: */
