var d3 = require('d3');
var d3mvc = require('../../src/d3mvc.js');
var global_window = require('../minidom.js');
var expect = require('expect.js');

var one_axis_model = [{
    "xdesc": "X axis",
    "ydesc": "Y axis",
    "xdomain": [0, 10],
    "ydomain": [-10, 10]
}];

var incomplete_model = [{
    "xdomain": [0, 4],
    "ydesc": "Y axis"
}];

var empty_model = [{}];

var two_x_axes_one_y_axis = [{}, {"xdesc": "other_x"}];

var two_y_axes_one_x_axis = [{}, {"ydesc": "other_y"}];

var two_x_axes_two_y_axes = [{}, {"xdesc": "other_x", "ydesc": "other_y"}];

var too_many_x_values = [{}, {xdesc: 'x2'}, {xdesc: 'x3'}];
var too_many_y_values = [{}, {ydesc: 'x2'}, {ydesc: 'x3'}];

var no_model = [];

function default_init(model) {
    var test_div = global_window.document.getElementById('test');
    view = d3mvc.make_view(model, test_div);
    return [view, model];
}


describe('d3mvc', function() {

    describe('Legend', function() {

        describe('Box', function() {
            it('should grow when new element is added', function(done) {
                var view = default_init(empty_model)[0];
                expect(view).to.be.a(d3mvc.View);
                view.config([{type: 'scatter'}, {type: 'legend'}])
                    .display();
                var legend_plus_box = global_window.document.querySelectorAll(
                    ".legend_with_box");
                console.log(legend_plus_box[0]);
                var old_lbbox = legend_plus_box[0].getBBox();
                var old_height = old_lbbox.height;
                var new_model = [{}, {"name": "very long name", "xdesc": "other_x"}];
                view.update(new_model)
                    .display();
                var new_lbbox = legend_plus_box.getBBox();
                var new_height = new_lbbox.height;
                expect(new_height).to.be.greater.than(old_height);
                done();
            });
        });
    });
});
