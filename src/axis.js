var d3 = require("d3");
var String = require('./utils/string_extension.js');

/* This module creates a drawing area with axis annotations that can be
 * activated if necessary.
 *
 * Arguments:
 *
 * 'container'   The argument 'container' is a string defining the DOM element,
 *               which should host the axis as a parent.
 *               (Example: "#plot" looks for an element with id "plot")
 *
 * Optional arguments:
 *
 * 'xy_ratio'   The ratio of width and the height of the axis element.
 *              (Default: 1.0)
 *              (Example: 1.5 means, that the plot is 1.5 times wider than
 *              high.)
 *
 * Note: The right hand side y axis is only drawn, if it was assigned a name
 * with the y2label() method.
 *
 * Usage:
 *
 * - Create an axis:
 *
 *   var axis = new Axis("#plot");
 *
 * - Update
 * */
function Axis(container, xy_ratio) {
    this.xy_ratio_ = xy_ratio || 1.0;
    this.container_ = d3.select(container);
    try {
        this.container_.style('width');
    } catch (e) {
        throw ("Identifier " + container + " does not describe an existing DOM element");
    }
    this.x_ = [d3.scale.linear()];
    this.y_ = [d3.scale.linear()];
    this.xscale_ = ['linear'];
    this.yscale_ = ['linear'];
    this.xAxis_ = [d3.svg.axis().scale(this.x_[0])];
    this.yAxis_ = [d3.svg.axis().scale(this.y_[0])];
    this.xlabel_ = ["x"];
    this.ylabel_ = ["y"];
    // This might need to be updated, depending on the size of the labels...
    this.margin = {top: 10, right: 60, bottom: 45, left: 60};
    this.update_size_ = function () {
        var container_width = parseInt(this.container_.style('width'));
        this.width = container_width;
        this.height = container_width / this.xy_ratio_;
        this.width_ = this.width - this.margin.left - this.margin.right;
        this.height_ = this.height - this.margin.top - this.margin.bottom;
        var th = this;
        this.x_.map(function (xtemp) {
            xtemp.range([0, th.width_]);
        });
        this.y_.map(function (ytemp) {
            ytemp.range([th.height_, 0]);
        });
    };
    this.update_size_();
}

Axis.prototype = {
    init: function() {
        this.update_size_();
        var svg = this.container_.selectAll('svg')
            .data([1]);

        svg.enter()
          .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // DRAWING AREA
        var axis = svg.selectAll(".drawing_area")
            .data([1]);
        var axis_enter = axis.enter()
          .append("g")  // drawing area for graph (axis)
            .attr("class", "drawing_area")
            .attr("transform", "translate({left},{top})".format(this.margin));

        this.draw_axes();
        return this;
    },
    draw_axis: function(classnames, config) {
        var axis = this.drawing_area();

        var axisC = axis.selectAll('.' + classnames.join('.'))
            .data(config);
        console.log(config);
        var axis_enter = axisC.enter()
            .append("g")
            .attr("class", classnames.join(' '))
            .attr("transform", function (d) {return d.transformation; }) //"translate(0," + this.height_ + ")")
            .each(function (d, i) {
                console.log(i);
                console.log(config[i].axis.scale().domain());
                d3.select(this).call(config[i].axis);
            })
          .append("text")  // axis label
            .attr("class", "label")
            .attr("transform", function(d) { return d.labelpos.transformation; })
            .attr("x", function(d) { return d.labelpos.x; }) // 0.5*this.width_)
            .attr("y", function(d) { return d.labelpos.y; }) // 30)
            .attr("dy", function(d) { return d.labelpos.dy; })
            .attr("dx", function(d) { return d.labelpos.dx; })
            .style("text-anchor", function (d) { return d.labelpos.anchor; }); // "middle");
        axisC.select(".label")
            .text(function (d) { return d.label; });
        axisC.exit()
            .remove();
    },
    draw_axes: function() {
        var xaxis_configs = this.make_x_axis_configurations_();
        var yaxis_configs = this.make_y_axis_configurations_();
        this.draw_axis(['x', 'axis'], xaxis_configs);
        this.draw_axis(['y', 'axis'], yaxis_configs);
    },
    make_y_axis_configurations_: function () {
        var configurations = [];
        var labelpos, transformation;
        var number = 0;
        for (var k in this.yscale_) {
            if (k) {
                if (number === 0) {
                    transformation = null;
                    labelpos = {
                        'x': 0.5 * this.height_,
                        'y': 35,
                        'dy': '.71em', 'dx': 0,
                        'transformation': 'rotate(90)',
                        'anchor': 'middle'
                    };
                    this.yAxis_[k].orient('left');
                } else if (number == 1) {
                    transformation = 'translate(' + (this.width_) + ', 0)';
                    labelpos = {
                        'x': 0.5 * this.height_,
                        'y': -35,
                        'dy': '-.71em', 'dx': 0,
                        'transformation': 'rotate(90)',

                        'anchor': 'middle'
                    };
                    this.yAxis_[k].orient('right');
                } else {
                    throw('only two y scales allowed per axis');
                }
                configurations.push({
                    'label': this.ylabel(k) || 'y' + number,
                    'axis': this.yAxis_[k],
                    'transformation': transformation,
                    'labelpos': labelpos
                });
                number += 1;
            }
        }
        return configurations;
    },
    make_x_axis_configurations_: function () {
        var configurations = [];
        var labelpos, transformation;
        var number = 0;
        for (var k in this.xscale_) {
            if (k) {
                if (number === 0) {
                    transformation = 'translate(0, ' + (this.height_) + ')';
                    labelpos = {
                        'x': 0.5 * this.width_,
                        'y': 35,
                        'dy': 0, 'dx': 0,
                        'transformation': null,
                        'anchor': 'middle'
                    };
                    this.xAxis_[k].orient('bottom');
                } else if (number == 1) {
                    transformation = 'translate(0, ' + (this.margin.top) + ')';
                    labelpos = {
                        'x': 0.5 * this.width_,
                        'y': 35,
                        'dy': 0, 'dx': 0,
                        'transformation': null,
                        'anchor': 'middle'
                    };
                    this.xAxis_[k].orient('top');
                } else {
                    throw('only two x scales allowed per axis');
                }
                configurations.push({
                    'label': this.xlabel(k) || 'x' + number,
                    'axis': this.xAxis_[k],
                    'transformation': transformation,
                    'labelpos': labelpos
                });
                number += 1;
            }
        }
        return configurations;
    },
    xlabel: function(index, value) {
        if (!arguments.length) {
            return this.xlabel_[0];
        }
        if (arguments.length == 1) {
            return this.xlabel_[index];
        }
        this.xlabel_[index] = value;
        return this;
    },
    ylabel: function(index, value) {
        if (!arguments.length) {
            return this.ylabel_[0];
        }
        if (arguments.length == 1) {
            return this.ylabel_[index];
        }
        this.ylabel_[index] = value;
        return this;
    },
    drawing_area: function() {
        return this.container_.select(".drawing_area");
    },
    dom_container: function() {
        return this.container_;
    },
    yscale: function(index, value) {
        if (!arguments.length) {
            return this.yscale_[0];
        }
        if (arguments.length == 1) {
            return this.yscale_[index];
        }
        var new_y;
        switch (value) {
            case 'linear':
                new_y = d3.scale.linear();
                break;
            case 'log':
                new_y = d3.scale.log();
                break;
            default:
                throw "yscale option is unknown";
        }
        if (index in this.y_)
        {
            new_y.domain(this.y_[index].domain());
            new_y.range(this.y_[index].range());
        } else {
            new_y.range([this.height_, 0]);
        }
        this.yscale_[index] = value;
        this.y_[index] = new_y;
        this.yAxis_[index] = d3.svg.axis().scale(this.y_[index]);
    },
    xscale: function(index, value) {
        if (!arguments.length) {
            return this.xscale_[0];
        }
        if (arguments.length == 1) {
            return this.xscale_[index];
        }
        var new_x;
        switch (value) {
            case 'linear':
                new_x = d3.scale.linear();
                break;
            case 'log':
                new_x = d3.scale.log();
                break;
            default:
                throw "xscale option is unknown";
        }
        if (index in this.x_)
        {
            new_x.domain(this.x_[index].domain());
            new_x.range(this.x_[index].range());
        } else {
            new_x.range([0, this.width_]);
        }
        this.xscale_[index] = value;
        this.x_[index] = new_x;
        this.xAxis_[index] = d3.svg.axis().scale(this.x_[index]);
    },
    x: function(index) {
        if (!arguments.length) {
            return this.x_[0];
        }
        return this.x_[index];
    },
    y: function(index) {
        if (!arguments.length) {
            return this.y_[0];
        }
        return this.y_[index];
    }
};

module.exports = Axis;

