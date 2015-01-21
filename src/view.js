var String = require('./utils/string_extension.js');
var d3 = require('d3');

function ModelAdapter2d(model) {
    this.model = model;
}

ModelAdapter2d.prototype = {};
ModelAdapter2d.prototype.x = function(i) {
    return model[i].data[0];
};
ModelAdapter2d.prototype.y = function(i) {
    return model[i].data[1];
};
ModelAdapter2d.prototype.xscale = function(i, scale) {
    var xscales;
    if (xscales === undefined) {
        xscales = [];
    }
    if (arguments.length == 1) {
        return xscales[i];
    }
    xscales[i] = scale;
};
ModelAdapter2d.prototype.yscale = function(i, scale) {
    var yscales;
    if (yscales === undefined) {
        yscales = [];
    }
    if (arguments.length == 1) {
        return yscales[i];
    }
    yscales[i] = scale;
};
ModelAdapter2d.prototype.xdesc = function(i) {
    var alternative_xdesc = model[0].xdesc || 'x';
    return model[i].xdesc || alternative_xdesc;
};
ModelAdapter2d.prototype.ydesc = function(i) {
    var alternative_ydesc = model[0].ydesc || 'y';
    return model[i].ydesc || alternative_ydesc;
};
ModelAdapter2d.prototype.xdomain = function(i) {
    return model[i].xdomain || d3.extent(this.x(i));
};
ModelAdapter2d.prototype.ydomain = function(i) {
    return model[i].ydomain || d3.extent(this.y(i));
};

function Axis2d(view) {
    this.view = view;
    this.model = view.model;
    this.container = view.container;
    this.compute_axes();
}

Axis2d.prototype = {};
Axis2d.prototype.adapter = function() {
    var adapter;
    if (adapter === undefined || adapter.model !== this.model) {
        adapter = new ModelAdapter2d(this.model);
    }
    return adapter;
};

Axis2d.prototype.height = function() {
    var margin = this.margin();
    return Math.max(this.view.height - margin.top - margin.bottom, 0);
};

Axis2d.prototype.width = function() {
    var margin = this.margin();
    return Math.max(this.view.width - margin.left - margin.right, 0);
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

        var xdesc = this.adapter().xdesc(mi);
        var ydesc = this.adapter().ydesc(mi);

        xdomain_tmp = this.adapter().xdomain(mi);
        ydomain_tmp = this.adapter().ydomain(mi);

        if (xdesc in xdescs) {
            xdescs[xdesc].indices.push(mi);
            xdescs[xdesc].domain = d3.extent(
                xdomain_tmp.concat(xdescs[xdesc].domain));
        } else {
            xdescs[xdesc] = {};
            xdescs[xdesc].indices = xdomain_tmp;
            xdescs[xdesc].domain = [mi];
        }
        if (ydesc in ydescs) {
            descs[ydesc].indices.push(mi);
            ydescs[ydesc].domain = d3.extent(
                ydomain_tmp.concat(ydescs[ydesc].domain));
        } else {
            ydescs[ydesc] = {};
            ydescs[ydesc].indices = ydomain_tmp;
            ydescs[ydesc].domain = [mi];
        }
    }
    if (xdescs.length > 2) {
        throw {
            name: 'ModelFormatError',
            message: 'too many different x values'
        };
    }
    if (ydescs.length > 2) {
        throw {
            name: 'ModelFormatError',
            message: 'too many different y'
        };
    }

    /* TODO: add possibility to use logarithmic scales (from model?) */
    var xscales = [d3.scale.linear()];
    var yscales = [d3.scale.linear()];

    if (xdescs.length === 2) {
        margin.bottom = bottom;
        xscales.push(d3.scale.linear());
    }
    if (ydescs.length === 2) {
        margin.right = 60;
        yscales.push(d3.scale.linear());
    }
    this.margin(margin);

    var xlabels = Object.keys(xdescs);
    var ylabels = Object.keys(ydescs);

    var xAxis = [],
        yAxis = [];

    var th = this;
    xlabels.map(function (xl, i) {
        var xdesc = xdescs[xl];
        xscales[i]
            .domain(xdesc.domain)
            .range([0, th.width()]);
        xdesc.indices.map(function (index) {
            th.adapter().xscale(index, xscales[i]);
        });
        xAxis.push(d3.svg.axis().scale(xscales[i]));
    });
    ylabels.map(function (yl, i) {
        var ydesc = ydescs[yl];
        yscales[i]
            .domain(ydesc.domain)
            .range([0, th.width()]);
        ydesc.indices.map(function (index) {
            th.adapter().yscale(index, yscales[i]);
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
    if (xdescs.length === 2) {
        xlabel_config.push({
            label: xlabels[1],
            transformation: 'translate(0, ' + this.height() + ')',
            labelpos: {
                x: 0.5 * this.width(), y: 85,
                dx: 0, dy: 0,
                transformation: null,
                anchor: 'middle'
            },
            axis: yAxis[1].orient('bottom')
        });
    }
    if (ydescs.length === 2) {
        ylabel_config.push({
            label: ylabels[1],
            transformation: 'translate(0, ' + this.width() + ')',
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
        return this.margin_;
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
        .attr("class", classnames.join(' '))
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
    var svg = this.container.selectAll('svg')
        .data([1]);


    svg.enter()
      .append('svg')
        .attr('width', this.view.width())
        .attr('height', this.view.height());

    this.draw_area = svg.selectAll(".drawing_area")
        .data([1]);

    var margin = this.margin();

    var draw_area_enter = this.draw_area.enter()
      .append('g')
        .attr('class', 'drawing_area')
        .attr('transform', 'translate({left},{top})'.format(this.margin()));

    this.draw_axis_label(['x', 'axis'], this.xlabel_config);
    this.draw_axis_label(['y', 'axis'], this.ylabel_config);
};


function Lines2dView(view) {
    this.view = view;
    this.model = view.model;
    this.container = view.container;
    this.axis = new Axis2d(view);
}

Lines2dView.prototype = {};

Lines2dView.prototype.update = function () {
    this.axis.update();
};

function Discrete2dView() {
    throw {
        name: "NotimplementedError"
    };
}

function CategoricalView() {
    throw {
        name: "NotimplementedError"
    };
}

function View(model, container, controllers) {
    this.container = container;
    this.model = model;
    this.controllers = controllers;
    this._impl = undefined;
}

View.prototype = {
    type: function(typename) {
        var type_;
        if (!arguments.length) {
            return type_;
        }
        type_ = typename;
        if (type_ === 'lines2d') {
            this._impl = new Lines2dView(this);
        }
        else if(type_ === 'discrete2d') {
            this._impl = new Discrete2dView(this);
        }
        else if(type_ === 'categorical') {
            this._impl = new CategoricalView(this);
        }
        else {
            throw {
                name: "ValueError",
                message: "The given view type " + typename + " is invalid."
            };
        }
        return this;
    },

    show: function() {
        this._impl.update();
        return this;
    },

    hide: function() {
        this.container.style('display', 'none');
        return this;
    },

    width: function() {
        return Math.max(parseInt(this.container.style('width'), 10), 50);
    },

    height: function() {
        var w = this.width();
        return Math.max(parseInt(this.container.style('height'), 10), w);
    }
};


module.exports = View;
