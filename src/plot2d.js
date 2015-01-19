require('d3');

function Plot2D() {
    this.datum_ = null;
    this.colors_ = null;
}

Plot2D.prototype.datum = function(value) {
    if (!arguments.length) {
        return this.datum_;
    }
    this.datum_ = value;
    return this;
};
Plot2D.prototype.colors = function(value) {
    if (!arguments.length) {
        return this.colors_;
    }
    this.colors_ = value;
    return this;
};


Plot2D.prototype.get_domain_ = function(index) {
    domains = [];
    index_function = function (e) { return e[index]; };
    for (var di=0; di < this.datum().length; ++di) {
        var d = this.datum()[di];
        domains.push(d3.extent(d.data.map(index_function)));
    }
    max_domain = domains.reduce(function (a, b) {
        return d3.extent(a.concat(b)); });
    return max_domain;

};

Plot2D.prototype.get_x_domain = function() {
    return this.get_domain_(0);
};

Plot2D.prototype.get_y_domain = function() {
    return this.get_domain_(1);
};

module.export = Plot2D;
