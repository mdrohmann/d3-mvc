var String = require('./utils/string_extension.js');
var Lines2dView = require('./lines2d.js');
var Scatter2dView = require('./scatter2d.js');
var Axis2d = require('./axis2d.js');
var d3 = require('d3');


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
    this.axis = undefined;
    this.axis_type = undefined;
    this.axis_options = [];
    this.config_chain = [];
    this.config_ = [];
}

View.prototype = {};
View.prototype.addConfiguration = function(configuration) {
    this.config_.push(configuration);

    var type = configuration.type;

    var operation;
    var axis_type;
    var axis_options;
    if (type === 'lines') {
        operation = new Lines2dView(this, configuration);
        axis_type = Axis2d;
    }
    else if(type === 'scatter') {
        operation = new Scatter2dView(this, configuration);
        axis_type = Axis2d;
    }
    else if(type === 'bw_usage') {
        operation = new BwUsageView(this, configuration);
        axis_type = Axis2d;
    }
    else if(type === 'legend') {
        operation = new LegendView(this, configuration);
        axis_type = this.axis_type;
        axis_options = [{extra_margin: operation.axis_margin}];
    }
    else {
        throw {
            name: "ValueError",
                message: "The given view operation " + type + " is invalid."
        };
    }

    if (this.axis_type === undefined) {
        this.axis_type = axis_type;
    } else if(this.axis_type !== axis_type) {
        throw {
            name: "ValueError",
            message: "You cannot combine incompatible view operations.\n" +
                configuration + " is incompatible with other configurations."
        };
    }
    if (axis_options !== undefined) {
        this.axis_options.push(axis_options);
    }
    this.config_chain.push(operation);
    return this;
};

View.prototype.config = function(c) {
    if (!arguments.length) {
        return this.config_;
    }
    this.config_ = [];
    this.config_chain = [];
    var ii = 0;
    for (; ii < c.length; ii++) {
        this.addConfiguration(c[ii]);
    }
    return this;
};

View.prototype.display = function() {
    this.axis = new this.axis_type(this, this.axis_options);
    this.axis.display();
    this.config_chain.map(function(op) { op.display(); });
    return this;
};

View.prototype.update = function(model) {
    if (arguments.length === 1) {
        this.model = model;
    }
    this.axis.update();
    this.config_chain.map(function(op) { op.update(); });
    return this;
};

View.prototype.hide = function(do_hide) {
    if (!arguments.length || do_hide) {
        this.container.style('display', 'none');
    }
    else {
        this.container.style('display', 'block');
    }
    return this;
};

View.prototype.width = function() {
    return Math.max(parseInt(this.container.style('width'), 10) || 100, 100);
};

View.prototype.height = function() {
    var w = Math.min(100, this.width());
    return Math.max(parseInt(this.container.style('height'), 10) || 100, w);
};

View.prototype.highlight_data_block = function(index) {
    throw { name: "NotImplementedError" };
};

View.prototype.legend_icon = function(index) {
    throw { name: "NotImplementedError" };
};

module.exports = View;
/* vim: set sw=4: */
