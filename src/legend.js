var d3 = require('d3');

function Legend2dView(view, configuration) {
    this.view = view;
    this.model = view.model;
    this.parse_configuration(configuration);
    this.xshift = 0;
    this.yshift = 0;
    this.outer_margin = {top: 0, left: 0, right: 0, bottom: 0};
    this.entry_height = 15;
    this.legend_margin = 5;
}

Legend2dView.prototype = {};

Legend2dView.prototype.parse_configuration = function(configuration) {
    if (configuration.hasOwnProperty('pos')) {
        this.pos = configuration.pos;
    } else {
        this.pos = 'outer right';
    }
    this.configure_position();
};

Legend2dView.prototype.configure_position = function() {

    if (this.pos === 'outer right' || this.pos === 'default') {
        this.xshift = this.view.width() - 100;
        this.yshift = 0;
        this.outer_margin.right = 110;
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

Legend2dView.prototype.display = function () {
    var svg = this.view.axis.draw_area;
    var adapter = this.view.axis.adapter();

    var legend_box = svg.selectAll('.legend')
        .data([1]);

    legend_box.enter()
      .append('g')
        .attr('class', 'legend')
        .attr('transform', "translate(" + this.xshift + "," + this.yshift + ")");

    var entries = svg.select('.legend').selectAll('.entry')
        .data(adapter.data(), function (d) { return d.name; });

    entries.enter()
      .append('g')
        .attr('class', 'entry')
      .append('g')
        .attr('class', 'icon')
        .attr('transform',
             function (_, i) {
                 return "translate(0, " + this.entry_height * i + this.legend_margin + ")";
             })
      .append('text')
        .attr('x', 15)
        .attr('dy', '.71em');

    var view = this.view;
    entries.select('.icon')
        .each(function (_, i) {
            d3.select(this).call(view.legend_icon(i));
        });
    entries.select('text')
        .text(function (d) { return d.name; });

    entries.exit()
        .remove();


};

module.exports = Legend2dView;

/* vim: set sw=4: */
