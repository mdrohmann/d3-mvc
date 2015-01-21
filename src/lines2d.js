var d3 = require('d3');
var Axis2d = require('./axis2d.js');

function Lines2dView(view) {
    this.view = view;
    this.model = view.model;
    this.container = view.container;
    this.axis = new Axis2d(view);
    this.svg = this.axis.draw_area;
    this.adapter = this.axis.adapter;
}

Lines2dView.prototype = {};

Lines2dView.prototype.update = function () {
    this.axis.update();

/*    var scatter_classes = ['circle', this.adapter.name()];
    var scatters = axis.selectAll('.circle') */
};

module.exports = Lines2dView;

/* vim: set sw=4: */
