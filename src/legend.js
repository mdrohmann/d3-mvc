var d3 = require('d3');

function Legend2dView(view, configuration) {
    this.view = view;
    this.model = view.model;
    this.xshift = 0;
    this.yshift = 0;
    this.outer_margin = {top: 0, left: 0, right: 0, bottom: 0};
    this.entry_height = 15;
    this.legend_margin = 5;

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
        this.outer_margin.right = 110;
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

    var legend_box = svg.selectAll('.legend')
        .data([1]);

    var eh = this.entry_height,
        lm = this.legend_margin;
    legend_box.enter()
      .append('g')
        .attr('class', 'legend')
        .attr('transform', "translate(" + this.xshift + "," + this.yshift + ")")
      .append('text')
        .attr('class', 'title')
        .attr('dy', '.71em')
        .attr('transform', 'translate(18, ' + lm + ')')
        .style('font-weight', 'bold')
        .text('Legend');

    var entries = svg.select('.legend').selectAll('.entry')
        .data(adapter.data(), function (d) { return d.name; });

    var entries_enter = entries.enter()
      .append('g')
        .attr('class', 'entry')
        .attr('transform',
             function (d, i) {
                 return "translate(0, " + (eh * (i+1) + lm) + ")";
             });
    entries_enter
      .append('text')
        .attr('x', 18)
        .attr('dy', '.71em');

    entries_enter
      .append('g')
        .attr('class', 'icon');

    entries.select('.icon')
        .each(function (d, i) {
            view.legend_icon(i, d3.select(this));
        });
    entries.select('text')
        .text(function (d) { return d.name; });

    entries.exit()
        .remove();

    try {
        var rect = svg.select('.legend').node().getBBox();
        var offset = 2;
        var pathinfo = [
            {x: rect.x-offset, y: rect.y },
            {x: rect.x+offset + rect.width, y: rect.y},
            {x: rect.x+offset + rect.width, y: rect.y + rect.height },
            {x: rect.x-offset, y: rect.y + rect.height},
            {x: rect.x-offset, y: rect.y },
        ];

        var d3line = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });

        var legend_rect = legend_box.selectAll('.legend-box')
            .data([pathinfo]);
        var legend_rect_enter = legend_rect.enter()
          .append('path')
            .attr('class', 'legend-box')
            .style('stroke', 'black')
            .style('stroke-width', '1')
            .style('fill', 'none');

        legend_rect_enter
            .attr('d', function (d) { return d3line(d); });

        legend_rect.exit().remove();
    } catch (ignore) {}
};

module.exports = Legend2dView;

/* vim: set sw=4: */
