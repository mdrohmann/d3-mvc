var d3 = require('d3');

function Legend2dView(view, configuration) {
    this.view = view;
    this.xshift = 0;
    this.yshift = 0;
    this.outer_margin = {top: 0, left: 0, right: 0, bottom: 0};
    this.entry_height = 15;
    this.legend_margin = 5;
    this.configuration = configuration;
    this.width = 110; // assumed width (update the plot twice to get the right value)

    this.configure(configuration);
}

Legend2dView.prototype = {};

Legend2dView.prototype.configure = function(configuration) {
    if (configuration.hasOwnProperty('pos')) {
        this.pos = configuration.pos;
    } else {
        this.pos = 'outer right';
    }
    this.configure_position();
};

Legend2dView.prototype.configure_position = function() {

    if (this.pos === 'outer right' || this.pos === 'default') {
        this.outer_margin.right = this.width;
        this.xshift = this.view.width() - (this.outer_margin.right + 5);
        this.yshift = 0;
    } else {
        throw {
            name: 'ValueError',
            message: 'Invalid legend position: ' + this.pos
        };
    }
};

Legend2dView.prototype.axis_margin = function() {
    return this.outer_margin;
};

Legend2dView.prototype.legend_icon = function (unused1, unused2) {
    return undefined;
};

Legend2dView.prototype.display = function () {
    var svg = this.view.axis.svg;
    var view = this.view;
    var adapter = view.adapter();

    var legend_box = svg.selectAll('.legend_with_box')
        .data([this]);

    var mouseover_func = function (d) {
        d3.selectAll('.drawing_area .' + d.key)
            .classed('highlight', true);
        d3.select(this)
            .classed('highlight', true);
    };
    var mouseleave_func = function (d) {
        d3.selectAll('.drawing_area .' + d.key)
            .classed('highlight', false);
        d3.select(this)
            .classed('highlight', false);
    };
    var eh = this.entry_height,
        lm = this.legend_margin;
    legend_box.enter()
      .append('g')
        .attr('class', 'legend_with_box')
      .append('g')
        .attr('class', 'legend')
      .append('text')
        .attr('class', 'title')
        .attr('dy', '.71em')
        .style('font-weight', 'bold')
        .text('Legend');

    legend_box
        .attr('transform', function(d) {
            return "translate(" + d.xshift + "," + d.yshift + ")";
        });
    legend_box.select('.title')
        .attr('transform', function(d) { return 'translate(18, ' + d.legend_margin + ')'; });

    var data = adapter.data().map(
        function(d, i) { d.yshift = (eh * (i+1) + lm); return d; });
    var entries = svg.select('.legend').selectAll('.entry')
        .data(data, function (d) { return d.key; });

    var entries_enter = entries.enter()
      .append('g')
        .attr('class', 'entry')
        .on('mouseover', mouseover_func)
        .on('mouseleave', mouseleave_func);
    entries_enter
      .append('text')
        .attr('x', 18)
        .attr('dy', '.71em');

    entries_enter
      .append('g')
        .attr('class', 'icon');

    entries
        .attr('transform',
             function (d) {
                 return "translate(0, " + d.yshift + ")";
             });
    entries.select('.icon')
        .each(function (d, i) {
            view.legend_icon(i, d3.select(this));
        });
    entries.select('text')
        .text(function (d) { return d.name; });

    entries.exit()
        .remove();

    try {
        var rect = svg.select(".legend").node().getBBox();
        var offset = 2;
        this.width = rect.width + 2 * offset + 2;
        this.configure_position();
        var pathinfo = [
            {x: rect.x - offset, y: rect.y - offset},
            {x: rect.x + rect.width + offset, y: rect.y - offset},
            {x: rect.x + rect.width + offset, y: rect.y + rect.height + offset},
            {x: rect.x - offset, y: rect.y + rect.height + offset},
            {x: rect.x - offset, y: rect.y - offset},
        ];

        var d3line = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });

        var legend_with_box = svg.select('.legend_with_box');
        var legend_rect = legend_with_box.selectAll('.legend-box')
            .data([pathinfo]);
        legend_rect.enter()
          .append('path')
            .attr('class', 'legend-box')
            .style('stroke', 'black')
            .style('stroke-width', '1')
            .style('fill', 'none');

        legend_rect
            .attr('d', function (d) { return d3line(d); });

        legend_rect.exit().remove();
    } catch (ignore) {}
};

Legend2dView.prototype.update = function() {
    this.configure(this.configuration);
    this.display();
};

module.exports = Legend2dView;

/* vim: set sw=4: */
