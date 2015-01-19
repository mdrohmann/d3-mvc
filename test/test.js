(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var d3 = (typeof window !== "undefined" ? window.d3 : typeof global !== "undefined" ? global.d3 : null);
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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils/string_extension.js":2}],2:[function(require,module,exports){
if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0];
        args = (("string" == args || "number" == args) ? arguments : arguments[0]);

        for (var arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    };
}

module.exports = String;

},{}],3:[function(require,module,exports){
var Axis = require('../../src/axis.js');

describe('Axis_Browser', function() {

    var test_div = window.document.getElementById("test");
    test_div.style.width = 200;

    var ax = null;
    beforeEach(function (done) {
        ax = new Axis(test_div, 1);
        done();
    });

    afterEach(function (done) {
        /* uncomment this if you want to look at the last plot */
        for (var i=0; i< test_div.children.length; ++i) {
            test_div.children[i].remove();
        }
        done();
    });

    describe("#init()", function() {
        it('should init a plot', function(done) {
            ax.init();
            done();
        });
        it('should init a plot with two y axes', function(done) {
            ax.yscale(2, "log");
            ax.init();
            done();
        });
    });
});

module.exports = {};

},{"../../src/axis.js":1}],4:[function(require,module,exports){
(function (global){
var Axis = require('../../src/axis.js');
var global_window = require('../minidom.js');
var expect = (typeof window !== "undefined" ? window.expect : typeof global !== "undefined" ? global.expect : null);

describe('Axis', function() {

    var test_div = global_window.document.getElementById("test");

    it ('should raise an exception if container does not exist', function () {
        expect(function() { return new Axis("#nonexistent"); }).to.throwException(
            /Identifier .* does not describe an existing DOM element/);
    });

    var ax = null;

    beforeEach(function (done) {
        ax = new Axis(test_div, 1);
        done();
    });

    it ('should return the container', function (done) {
        expect(ax.dom_container().node()).to.equal(test_div);
        done();
    });

    describe('#xlabel()', function() {
        it('should be \'x\' in the beginning', function(done) {
            expect(ax.xlabel()).to.eql('x');
            expect(ax.xlabel(0)).to.eql('x');
            done();
        });
        it('should return \'undefined\' if label does not exist', function(done) {
            expect(ax.xlabel('new')).to.be(undefined);
            done();
        });
        it('should create a new label for a new numerical index', function(done) {
            ax.xlabel(1, 'x2');
            expect(ax.xlabel(1)).to.eql('x2');
            done();
        });
        it('should create a new label for a new string index', function(done) {
            ax.xlabel('xname', 'x3');
            expect(ax.xlabel('xname')).to.eql('x3');
            done();
        });
    });

    describe('#ylabel()', function() {
        it('should be \'y\' in the beginning', function(done) {
            expect(ax.ylabel()).to.eql('y');
            expect(ax.ylabel(0)).to.eql('y');
            done();
        });
        it('should return \'undefined\' if label does not exist', function(done) {
            expect(ax.ylabel(1)).to.be(undefined);
            done();
        });
        it('should create a new label for a new numerical index', function(done) {
            ax.ylabel(1, 'y2');
            expect(ax.ylabel(1)).to.eql('y2');
            done();
        });
        it('should create a new label for a new string index', function(done) {
            ax.ylabel('yname', 'y3');
            expect(ax.ylabel('yname')).to.eql('y3');
            done();
        });
    });

    describe('#xscale()', function() {
        it('should return a function in the beginning', function (done) {
            expect(ax.xscale()).to.eql('linear');
            expect(ax.xscale(0)).to.eql('linear');
            done();
        });
        it('should update the existing scale', function(done) {
            ax.xscale(0, 'log');
            expect(ax.xscale()).to.eql('log');
            done();
        });
        it('should return undefined if index does not exist', function(done) {
            expect(ax.xscale(1)).to.be(undefined);
            done();
        });
        it('should create a new scale for a new numerical index', function(done) {
            ax.xscale(1, 'log');
            expect(ax.xscale(1)).to.eql('log');
            expect(ax.xAxis_[1].scale()).to.equal(ax.x(1));
            done();
        });
        it('should create a new scale for a new string index', function(done) {
            ax.xscale('xname', 'linear');
            expect(ax.xscale('xname')).to.eql('linear');
            expect(ax.xAxis_.xname.scale()).to.equal(ax.x('xname'));
            done();
        });
        it('should raise an exception if unknown xscale type is requested', function(done) {
            expect(ax.xscale).withArgs(2, 'unknown').to.throwException(/xscale option is unknown/);
            done();
        });
    });

    describe('#yscale()', function() {
        it('should return a function in the beginning', function (done) {
            expect(ax.yscale()).to.eql('linear');
            expect(ax.yscale(0)).to.eql('linear');
            done();
        });
        it('should update the existing scale', function(done) {
            ax.yscale(0, 'log');
            expect(ax.yscale()).to.eql('log');
            done();
        });
        it('should be undefined exception if index does not exist', function(done) {
            expect(ax.yscale(1)).to.be(undefined);
            done();
        });
        it('should create a new scale for a new numerical index', function(done) {
            ax.yscale(1, 'log');
            expect(ax.yscale(1)).to.eql('log');
            expect(ax.yAxis_[1].scale()).to.equal(ax.y(1));
            done();
        });
        it('should create a new scale for a new string index', function(done) {
            ax.yscale('yname', 'linear');
            expect(ax.yscale('yname')).to.eql('linear');
            expect(ax.yAxis_.yname.scale()).to.equal(ax.y('yname'));
            done();
        });
        it('should raise an exception if unknown yscale type is requested', function(done) {
            expect(ax.yscale).withArgs(2, 'unknown').to.throwException(/yscale option is unknown/);
            done();
        });
    });

    describe('#x()', function() {
        it('should return a linear scale in the beginning', function(done) {
            var x = ax.x();
            expect(x).to.be.a('function');
            expect(x).to.be(ax.x(0));
            x.range([0, 1]);
            expect(x(1)).to.eql(1);
            done();
        });
        it('should return undefined if index does not exist', function(done) {
            expect(ax.x(1)).to.be(undefined);
            done();
        });
        it('should return a log scale after creation with xscale', function(done) {
            ax.xscale('new', 'log');
            var x = ax.x('new');
            expect(x).to.be.a('function');
            x.range([0, 1]);
            expect(x(1)).to.eql(0);
            done();
        });
    });

    describe('#y()', function() {
        it('should return a linear scale in the beginning', function(done) {
            var y = ax.y();
            expect(y).to.be.a('function');
            expect(y).to.be(ax.y(0));
            y.range([0, 1]);
            expect(y(1)).to.eql(1);
            done();
        });
        it('should return undefined if index does not exist', function(done) {
            expect(ax.y(1)).to.be(undefined);
            done();
        });
        it('should return a log scale after creation with yscale', function(done) {
            ax.yscale('new', 'log');
            var y = ax.y('new');
            expect(y).to.be.a('function');
            y.range([0, 1]);
            expect(y(1)).to.eql(0);
            done();
        });
    });

    describe('#make_x_axis_configurations_()', function() {
        it('should create a single configuration in the beginning', function (done) {
            var configs = ax.make_x_axis_configurations_();
            expect(configs).to.have.length(1);
            done();
        });

        it('should create two configurations after adding a second x scale', function (done) {
            ax.xscale('new', 'log');
            var configs = ax.make_x_axis_configurations_();
            expect(configs).to.have.length(2);
            expect(configs[0].transformation).not.to.eql(configs[1].transformation);
            expect(configs[0].axis).not.to.equal(configs[1].axis);
            expect(configs[1].label).to.eql('x1');
            done();
        });
        it('should raise an error if three x scales exist', function (done) {
            function temp() {
                ax.xscale('new', 'log');
                ax.xscale('new2', 'log');
                ax.make_x_axis_configurations_();
            }
            expect(temp).to.throwException(/only two x scales allowed per axis/);
            done();
        });
    });

    describe('#make_y_axis_configurations_()', function() {
        it('should create a single configuration in the beginning', function (done) {
            var configs = ax.make_y_axis_configurations_();
            expect(configs).to.have.length(1);
            done();
        });

        it('should create two configurations after adding a second y scale', function (done) {
            ax.yscale('new', 'log');
            var configs = ax.make_y_axis_configurations_();
            expect(configs).to.have.length(2);
            expect(configs[0].transformation).not.to.eql(configs[1].transformation);
            expect(configs[0].axis).not.to.equal(configs[1].axis);
            expect(configs[1].label).to.eql('y1');
            done();
        });
        it('should raise an error if three y scales exist', function (done) {
            function temp() {
                ax.yscale('new', 'log');
                ax.yscale('new2', 'log');
                ax.make_y_axis_configurations_();
            }
            expect(temp).to.throwException(/only two y scales allowed per axis/);
            done();
        });
    });

});

module.exports = {};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../src/axis.js":1,"../minidom.js":6}],5:[function(require,module,exports){
var axistest = require('./axis/axis.test.js');  // by parsing this should be evaluated already...
var axisbrowsertest = require('./axis/axis.browsertest.js');

},{"./axis/axis.browsertest.js":3,"./axis/axis.test.js":4}],6:[function(require,module,exports){
(function (global){
var jsdom = (typeof window !== "undefined" ? window.jsdom : typeof global !== "undefined" ? global.jsdom : null);

var exports = null;
if (jsdom) {
    exports = jsdom.jsdom('<html><body><div id="test"></div></body></html>').parentWindow;
} else {
    exports = window;
}

module.exports = exports;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[5]);
