var String = require('./utils/string_extension.js');
var Lines2dView = require('./lines2d.js');
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
        return Math.max(parseInt(this.container.style('width'), 10) || 100, 100);
    },

    height: function() {
        var w = Math.min(100, this.width());
        return Math.max(parseInt(this.container.style('height'), 10) || 100, w);
    }
};


module.exports = View;
/* vim: set sw=4: */
