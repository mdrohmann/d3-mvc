var String = require('./utils/string_extension.js');
var colorbrewer = require('./colorbrewer.js');
var utils = require('./utils/utils.js');
var Lines2dView = require('./lines2d.js');
var Scatter2dView = require('./scatter2d.js');
var LegendView = require('./legend.js');
var Axis2d = require('./axis2d.js');
var ModelAdapter2d = require('./modeladapter.js');
var d3 = require('d3');


function View(model, container, controllers) {
    this.container = container;
    this.model = model;
    this.controllers = controllers;
    this.axis = undefined;
    this.axis_type = undefined;
    this.adapter_type = undefined;
    this.adapter_ = undefined;
    this.axis_options = [];
    this.config_chain = [];
    this.config_ = [];
    this.displayed_ = false;

    if (model.length < 12) {
        this.color = d3.scale.ordinal().range(colorbrewer.Paired[Math.max(3, model.length)]);
    } else if (model.length <= 20) {
        this.color = d3.scale.category20();
    }
}

View.prototype = {};
View.prototype.adapter = function() {
    if (!this.is_configured()) { // || this.adapter_.model !== this.model) {
        throw {
            name: 'RuntimeError',
            message: 'Model adapter was not configured yet...'
//            message: 'model wrapped in adapter changed! That should not happen!'
        };
    }
    return this.adapter_;
};
View.prototype.configure_view = function(configuration) {
    this.color = configuration.color || this.color;
};
View.prototype.addConfiguration = function(configuration) {
    this.config_.push(configuration);

    var type = configuration.type;

    var operation;
    var adapter_type;
    var adapter_options;
    var axis_type;
    var axis_options;
    if (type === 'view') {
        this.configure_view(configuration);
        return;
    }
    if (type === 'lines') {
        operation = new Lines2dView(this, configuration);
        axis_type = Axis2d;
        adapter_type = ModelAdapter2d;
    }
    else if(type === 'scatter') {
        operation = new Scatter2dView(this, configuration);
        axis_type = Axis2d;
        adapter_type = ModelAdapter2d;
    }
    else if(type === 'legend') {
        operation = new LegendView(this, configuration);
        axis_type = this.axis_type;
        axis_options = {extra_margin: operation.axis_margin()};
        adapter_type = ModelAdapter2d;
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
                configuration + " is incompatible with other settings."
        };
    }

    // initialize model adapter
    if (this.adapter_type === undefined) {
        this.adapter_type = adapter_type;
        this.adapter_ = new adapter_type(this.model);
    } else if(this.adapter_type !== adapter_type) {
        throw {
            name: "ValueError",
            message: "You cannot combine incompatible view operations.\n" +
                configuration + " is incompatible with other settings."
        };
    }
    this.adapter_.add_property(adapter_options);

    if (axis_options !== undefined) {
        this.axis_options.push(axis_options);
    }
    this.config_chain.push(operation);
    return this;
};

View.prototype.color_scale = function() {
    return this.color;
};
View.prototype.is_configured = function() {
    return this.config_chain.length > 0;
};

View.prototype.is_displayed = function() {
    return this.displayed_;
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

View.prototype.get_names = function() {
    if (! this.is_configured()) {
        throw {
            'name': 'RuntimeError',
            'message': 'requested names of uninitialized view'
        };
    }

    var name_list = this.adapter().data().map(
            function (d) { return d.name; });
    return utils.get_unique(name_list);
};

View.prototype.display = function() {
    if (! this.is_configured()) {
        throw {
            'name': 'RuntimeError',
            'message': 'requested display of uninitialized view'
        };
    }

    this.displayed_ = true;
    this.axis = new this.axis_type(this, this.axis_options);
    this.axis.display();
    this.config_chain.map(function(op) { op.display(); });
    return this;
};

View.prototype.update = function(model) {
    if (arguments.length === 1) {
        this.model = model;
        this.adapter_ = new this.adapter_type(model);
    }
    this.axis.update();
    this.config_chain.map(function(op) { op.display(); });
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

View.prototype.legend_icon = function(index, selection) {
    this.config_chain.map(function(op) { op.legend_icon(index, selection); });
};

module.exports = View;
/* vim: set sw=4: */
