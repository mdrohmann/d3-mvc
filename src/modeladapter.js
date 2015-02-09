var d3 = require('d3');
var utils = require('./utils/utils.js');

function ModelAdapter2d(model) {
    this.model = model;
    this.xscales_ = [];
    this.yscales_ = [];
    this.properties_ = [];
}

ModelAdapter2d.prototype = {};

ModelAdapter2d.prototype.add_property = function(properties) {
    if (properties !== undefined) {
        var default_error = function(p) {
            var error = function(d, i) {
                throw {
                    name: 'RuntimeError',
                    message: 'Model data is missing the property ' + p
                };
            };
            return error;
        };
        for (var i = 0; i < properties.length; ++i) {
            var property;
            if (typeof(properties[i]) === 'string') {
                property = {
                    'key': properties[i],
                    'default': default_error(properties[i])
                };
            } else {
                property = properties[i];
            }
            this.properties_.push(property);
        }
    }
};
ModelAdapter2d.prototype.name = function(i) {
    return this.model[i].name || 'plot' + i;
};
ModelAdapter2d.prototype.x = function(i) {
    try {
        return this.model[i].data[0];
    } catch(_) {
        return [];
    }
};
ModelAdapter2d.prototype.y = function(i) {
    try {
        return this.model[i].data[1];
    } catch(_) {
        return [];
    }
};
ModelAdapter2d.prototype.xscale = function(i, scale) {
    if (arguments.length === 1) {
        var xscale = this.xscales_[i];
        if (xscale === undefined) {
            return function(d) { return []; };
        }
        else {
            return xscale;
        }
    }
    this.xscales_[i] = scale;
};
ModelAdapter2d.prototype.yscale = function(i, scale) {
    if (arguments.length == 1) {
        var yscale = this.yscales_[i];
        if (yscale === undefined) {
            return function(d) { return []; };
        }
        else {
            return yscale;
        }
    }
    this.yscales_[i] = scale;
};
ModelAdapter2d.prototype.xdesc = function(i) {
    var alternative_xdesc = this.model[0].xdesc || 'x';
    return this.model[i].xdesc || alternative_xdesc;
};
ModelAdapter2d.prototype.ydesc = function(i) {
    var alternative_ydesc = this.model[0].ydesc || 'y';
    return this.model[i].ydesc || alternative_ydesc;
};
ModelAdapter2d.prototype.xdomain = function(i) {
    return this.model[i].xdomain || d3.extent(this.x(i));
};
ModelAdapter2d.prototype.ydomain = function(i) {
    return this.model[i].ydomain || d3.extent(this.y(i));
};
ModelAdapter2d.prototype.data = function() {
    // TODO: cache data
    var data = [];
    for (var i=0; i < this.model.length; ++i) {
        var elem = {
            xdesc: this.xdesc(i), ydesc: this.ydesc(i),
            name: this.name(i),
            key: utils.string_to_slug(this.name(i)),
            x: this.x(i), y: this.y(i),
            xscale: this.xscale(i), yscale: this.yscale(i)
        };
        for (var j=0; j < this.properties_.length; ++j) {
            elem[this.properties_[j].key] = this.model[i][this.properties_[j].key] ||
                this.properties_[j].default(this.model[i], i);
        }
        data.push(elem);
    }
    return data;
};


module.exports = ModelAdapter2d;

/* vim: set sw=4: */
