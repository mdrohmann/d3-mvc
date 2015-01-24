var d3 = require('d3');

function BwUsageView(view, configuration) {
    this.view = view;
    this.model = view.model;
    this.configure(configuration);
}

BwUsageView.prototype = {};

BwUsageView.prototype.area = function() {
    var adapter = this.view.adapter();
    return d3.svg.area()
        .interpolate('step-after')
        .x(function(d, i, j) { return adapter.xscale(j)(d[0]); })
        .y1(function(d, i, j) { return adapter.xscale(j)(d[1]); })
        .y0(function(d, i, j) { return adapter.xscale(j)(d[2]); });
};


BwUsageView.prototype.configure = function(configuration) {
    this.color = configuration.color || this.view.color_scale();
};

BwUsageView.prototype.legend_icon = function(index, selection) {
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
BwUsageView.prototype.display = function () {
    this.view.axis.update();
    var svg = this.view.axis.draw_area;
    var adapter = this.view.adapter();
    var color = this.color;
    var area = this.area();
    color.domain(this.view.get_names());
    var data = adapter.data();

    var bw_usage = svg.selectAll('.bwusage')
        .data(data, function (d) { return d.name; });

    var area_draw = function(d) {
        var ds = d3.transpose([d.x, d.y, d.y0, d.pno]);
        console.log(ds);
        return area(ds);
    };

    var show_pno = function(d, i, j)
    {
        console.log(d[3] + " i=" + i + "j=" + j);
    };

    var hide_pno = function(d, i, j) { console.log('hide'); };
/*    bw_usage.transition()
        .delay(function (d, i) { return i*400; })
        .duration(400*1.6180339887)
        .ease('easeInOutCubic')
        .attr("d", area_draw); */
    bw_usage.enter()
      .append('path')
        .attr('class', function(d) { return 'area ' + d.name; })
        .attr('d', area_draw);
//        .on('mouseover', show_pno)
//        .on('mouseleave', hide_pno);

    bw_usage.exit()
        .remove();

};

module.exports = BwUsageView;

/* vim: set sw=4: */
