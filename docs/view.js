function View(model, container, controllers) {
    this.container = container;
    this.model = model;
    this.controllers = controllers;
    this.type = undefined;
}

View.prototype = {
    type: function(typename) {
        if (!arguments.length) {
            return this.type;
        }
        this.type = typename;
        return this;
    },

    show: function() {
        console.log('show the element');
        return this;
    },

    hide: function() {
        console.log('hide the element');
        return this;
    }
};

module.exports = View;
