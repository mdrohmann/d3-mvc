var d3 = require('d3');
var String = require('./utils/string_extension.js');


function Axis2d(view, configuration) {
    this.view = view;
    this.model = view.model;
    this.container = view.container;

    for (var i=0; i<configuration.length; ++i) {
        this.extra_margin = configuration[i].extra_margin || undefined;
    }

    this.compute_axes();
}

Axis2d.prototype = {};

Axis2d.prototype.height = function() {
    var margin = this.margin();
    return Math.max(this.view.height() - margin.top - margin.bottom, 1);
};

Axis2d.prototype.width = function() {
    var margin = this.margin();
    return Math.max(this.view.width() - margin.left - margin.right, 1);
};

/* This method needs to be executed, when
 *      - the model changes
 *      - the scaling of any axis changes.
 *
 * Note: Changing the range of an axis scale does not require this function
 * to be run.
 */
Axis2d.prototype.compute_axes = function() {
    var margin = {
        top: 10, bottom: 50, left: 60, right: 10
    };

    if (this.model.length === 0) {
        throw {
            name: 'ModelFormatError',
            message: 'Model needs to have at least one element.'
        };
    }

    var xdescs = {},
        ydescs = {};
    for (var mi=0; mi < this.model.length; ++mi) {

        var xdesc = this.view.adapter().xdesc(mi);
        var ydesc = this.view.adapter().ydesc(mi);

        xdomain_tmp = this.view.adapter().xdomain(mi);
        ydomain_tmp = this.view.adapter().ydomain(mi);

        if (xdesc in xdescs) {
            xdescs[xdesc].indices.push(mi);
            xdescs[xdesc].domain = d3.extent(
                xdomain_tmp.concat(xdescs[xdesc].domain));
        } else {
            xdescs[xdesc] = {};
            xdescs[xdesc].indices = [mi];
            xdescs[xdesc].domain = xdomain_tmp;
        }
        if (ydesc in ydescs) {
            ydescs[ydesc].indices.push(mi);
            ydescs[ydesc].domain = d3.extent(
                ydomain_tmp.concat(ydescs[ydesc].domain));
        } else {
            ydescs[ydesc] = {};
            ydescs[ydesc].indices = [mi];
            ydescs[ydesc].domain = ydomain_tmp;
        }
    }
    var xlabels = Object.keys(xdescs);
    var ylabels = Object.keys(ydescs);

    if (xlabels.length > 2) {
        throw {
            name: 'ModelFormatError',
            message: 'too many different x values'
        };
    }
    if (ylabels.length > 2) {
        throw {
            name: 'ModelFormatError',
            message: 'too many different y values'
        };
    }

    /* TODO: add possibility to use logarithmic scales (from model?) */
    var xscales = [d3.scale.linear()];
    var yscales = [d3.scale.linear()];

    if (xlabels.length === 2) {
        margin.bottom = 100;
        xscales.push(d3.scale.linear());
    }
    if (ylabels.length === 2) {
        margin.right = 60;
        yscales.push(d3.scale.linear());
    }
    this.margin(margin);

    var xAxis = [],
        yAxis = [];

    var th = this;
    xlabels.map(function (xl, i) {
        var xdesc = xdescs[xl];
        xscales[i]
            .domain(xdesc.domain)
            .range([0, th.width()]);
        xdesc.indices.map(function (index) {
            th.view.adapter().xscale(index, xscales[i]);
        });
        xAxis.push(d3.svg.axis().scale(xscales[i]));
    });
    ylabels.map(function (yl, i) {
        var ydesc = ydescs[yl];
        yscales[i]
            .domain(ydesc.domain)
            .range([0, th.height()]);
        ydesc.indices.map(function (index) {
            th.view.adapter().yscale(index, yscales[i]);
        });
        yAxis.push(d3.svg.axis().scale(yscales[i]));
    });

    var xlabel_config = [{
        label: xlabels[0],
        transformation: 'translate(0, ' + this.height() + ')',
        labelpos: {
            x: 0.5 * this.width(), y: 35,
            dx: 0, dy: 0,
            transformation: null,
            anchor: 'middle'
        },
        axis: xAxis[0].orient('bottom')
    }];
    var ylabel_config = [{
        label: ylabels[0],
        transformation: null,
        labelpos: {
            x: 0.5 * this.height(), y: 35,
            dx: 0, dy: '.71em',
            transformation: 'rotate(90)',
            anchor: 'middle'
        },
        axis: yAxis[0].orient('left')
    }];
    if (xlabels.length === 2) {
        xlabel_config.push({
            label: xlabels[1],
            transformation: 'translate(0, ' + (this.height() + 40) + ')',
            labelpos: {
                x: 0.5 * this.width(), y: 25,
                dx: 0, dy: '.71em',
                transformation: null,
                anchor: 'middle'
            },
            axis: xAxis[1].orient('bottom')
        });
        xlabel_config[0].labelpos.y = 25;
    }
    if (ylabels.length === 2) {
        ylabel_config.push({
            label: ylabels[1],
            transformation: 'translate(' + this.width() + ', 0)',
            labelpos: {
                x: 0.5 * this.height(), y: -35,
                dx: 0, dy: '-.71em',
                transformation: 'rotate(90)',
                anchor: 'middle'
            },
            axis: yAxis[1].orient('right')
        });
    }
    this.xlabel_config = xlabel_config;
    this.ylabel_config = ylabel_config;
};

Axis2d.prototype.margin = function(margin) {
    if (!arguments.length) {
        var em;
        if (this.extra_margin !== undefined) {
            em = this.extra_margin;
        } else {
            em = {top: 0, left: 0, right: 0, bottom: 0};
        }
        var m = this.margin_;
        var mm = {
            top: m.top + em.top, left: m.left + em.left,
            right: m.right + em.right, bottom: m.bottom + em.bottom
        };
        return mm;
    }
    this.margin_ = margin;
    return this;
};

Axis2d.prototype.draw_axis_label = function(classnames, config) {
    var axis = this.draw_area;

    var axisC = axis.selectAll('.' + classnames.join('.'))
        .data(config);

    var axis_enter = axisC.enter()
      .append("g")
        .attr("class", function (_, i) { return classnames.concat(['ax' + i]).join(' '); })
        .attr("transform", function (d) {return d.transformation; })
        .each(function (_, i) {
            d3.select(this).call(config[i].axis);
        })
      .append("text")  // axis label
        .attr("class", "label")
        .attr("transform", function(d) { return d.labelpos.transformation; })
        .attr("x", function(d) { return d.labelpos.x; })
        .attr("y", function(d) { return d.labelpos.y; })
        .attr("dy", function(d) { return d.labelpos.dy; })
        .attr("dx", function(d) { return d.labelpos.dx; })
        .style("text-anchor", function (d) { return d.labelpos.anchor; });
    axisC.select(".label")
        .text(function (d) { return d.label; });
    axisC.exit()
        .remove();
};

Axis2d.prototype.update = function() {
    console.warn('This needs to be implemented yet!');
};

Axis2d.prototype.display = function() {
    this.svg = this.container.selectAll('svg')
        .data([1]);


    this.svg.enter()
      .append('svg')
        .attr('width', this.view.width())
        .attr('height', this.view.height());

    this.draw_area = this.svg.selectAll(".drawing_area")
        .data([1]);

    var margin = this.margin();

    var draw_area_enter = this.draw_area.enter()
      .append('g')
        .attr('class', 'drawing_area')
        .attr('transform', 'translate({left},{top})'.format(this.margin()));

    this.draw_axis_label(['x', 'axis'], this.xlabel_config);
    this.draw_axis_label(['y', 'axis'], this.ylabel_config);
};

module.exports = Axis2d;

/* vim: set sw=4: */
