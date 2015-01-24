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

var bw_usage_model = [{
        "name": "Message 1",
        "xdesc": "time [s]",
        "ydesc": "bw usage [kb/s]",
        "data": [[0, 1, 2, 3],[2, 0, 0.5,0]],
        "pno": [0, 0, 1, 1],
        "y0": [0, 0, 1, 0]
},{
        "name": "Message 2",
        "data": [[1, 2, 2, 3],[2, 0, 0.5,0]],
        "pno": [0, 0, 1, 1],
        "y0": [0, 0, 0, 0]
}];

function default_init(model) {
    var test_div = global_window.document.getElementById('test');
    view = d3mvc.make_view(model, test_div);
    return [view, model];
}


describe('d3mvc', function() {

    describe('ModelAdapter2d', function() {
        it('should raise an error if property is not available', function(done) {
            var adapter = new d3mvc.ModelAdapter2d([{}]);
            adapter.add_property(['temp']);
            expect(function() { return adapter.data(); }).to.throwException(function (e) {
                expect(e.name).to.eql('RuntimeError');
            });
            done();
        });
        it('should add a properties value to the data', function(done) {
            var adapter = new d3mvc.ModelAdapter2d([{temp: [1, 2, 3]}]);
            adapter.add_property(['temp']);
            expect(adapter.data()[0]).to.have.key('temp');
            expect(adapter.data()[0].temp).to.eql([1, 2, 3]);
            done();
        });
        it('should work with default functions', function(done) {
            var adapter = new d3mvc.ModelAdapter2d([{temp: [1, 2, 3]}]);
            adapter.add_property([{
                key: 'temp', default: function(d, i) { return d.x || []; }}]);
            expect(adapter.data()[0]).to.have.key('temp');
            expect(adapter.data()[0].temp).to.eql([1, 2, 3]);
            adapter = new d3mvc.ModelAdapter2d([{}]);
            adapter.add_property([{
                key: 'temp', default: function(d, i) { return d.x || []; }}]);
            expect(adapter.data()[0]).to.have.key('temp');
            expect(adapter.data()[0].temp).to.eql([]);
            done();
        });
    });

    describe('View', function() {
        it('should return is_configured after configuration', function(done) {
            var view = default_init(too_many_x_values)[0];
            view.config([{type: 'scatter'}]);
            expect(view.is_configured()).to.be(true);
            done();
        });
        it('should get all unique names', function(done) {
            var view = default_init(too_many_x_values)[0];
            expect(function() { view.get_names(); }).to.throwException();
            view.config([{type: 'scatter'}]);
            expect(view.get_names()).to.eql(['plot0', 'plot1', 'plot2']);
            var view2 = default_init(empty_model)[0];
            expect(function() { view2.get_names(); }).to.throwException();
            view2.config([{type: 'scatter'}]);
            expect(view2.get_names()).to.eql(['plot0']);
            done();
        });
        it('should create a given x axis title', function(done) {
            var view = default_init(one_axis_model)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}]);
            view.display();
            var title_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(title_dom).to.have.length(1);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('X axis');
            done();
        });
        it('should create a given y axis title', function(done) {
            var view = default_init(one_axis_model)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}]);
            var title_dom = global_window.document.querySelectorAll(
                ".y.axis");
            expect(title_dom).to.have.length(1);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('Y axis');
            done();
        });
        it('should create a default x title', function(done) {
            var view = default_init(incomplete_model)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}]);
            view.display();
            var title_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(title_dom).to.have.length(1);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('x');
            done();
        });
        it('should work with empty model', function(done) {
            var view = default_init(empty_model)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}]);
            view.display();
            var title_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(title_dom).to.have.length(1);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('x');
            expect(view.axis.margin()).to.eql({'top': 10, 'bottom': 50, 'left': 60, 'right': 10});
            done();
        });
        it('should generate two x axes and one y axis', function(done) {
            var view = default_init(two_x_axes_one_y_axis)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}]);
            view.display();
            var title_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(title_dom).to.have.length(2);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('x');
            expect(title_dom[1].querySelector('.label').innerHTML).to.eql('other_x');
            var ytitle_dom = global_window.document.querySelectorAll(
                ".y.axis");
            expect(ytitle_dom).to.have.length(1);
            expect(view.axis.margin()).to.eql({'top': 10, 'bottom': 100, 'left': 60, 'right': 10});
            expect(view.width()).to.eql(100);
            expect(view.height()).to.eql(100);
            expect(view.axis.width()).to.eql(30);
            expect(view.axis.height()).to.eql(1);
            done();
        });
        it('should generate two y axes and one x axis', function(done) {
            var view = default_init(two_y_axes_one_x_axis)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}]);
            view.display();
            var title_dom = global_window.document.querySelectorAll(
                ".y.axis");
            expect(title_dom).to.have.length(2);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('y');
            expect(title_dom[1].querySelector('.label').innerHTML).to.eql('other_y');
            var xtitle_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(xtitle_dom).to.have.length(1);
            expect(view.axis.margin()).to.eql({'top': 10, 'bottom': 50, 'left': 60, 'right': 60});
            expect(view.width()).to.eql(100);
            expect(view.height()).to.eql(100);
            expect(view.axis.width()).to.eql(1);
            expect(view.axis.height()).to.eql(40);
            done();
        });
        it('should generate two x axes and two y axes', function(done) {
            var view = default_init(two_x_axes_two_y_axes)[0];
            expect(view).to.be.a(d3mvc.View);
            view.config([{type: 'scatter'}, {type: 'lines'}]);
            view.display();
            var title_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(title_dom).to.have.length(2);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('x');
            expect(title_dom[1].querySelector('.label').innerHTML).to.eql('other_x');
            var xtitle_dom = global_window.document.querySelectorAll(
                ".y.axis");
            expect(xtitle_dom).to.have.length(2);
            expect(view.axis.margin()).to.eql({'top': 10, 'bottom': 100, 'left': 60, 'right': 60});
//            expect(view._impl.axis.adapter().xscale(1)).to.be.a(d3.svg.scale);
            expect(view.width()).to.eql(100);
            expect(view.height()).to.eql(100);
            expect(view.axis.width()).to.eql(1);
            expect(view.axis.height()).to.eql(1);
            done();
        });
        it('should throw exceptions for too many or too few plots', function(done) {
            var view = default_init(too_many_x_values)[0];
            expect(function() { view.config([{type: 'scatter'}]).display(); })
              .to.throwException(function (e) {
                  expect(e.name).to.eql('ModelFormatError');
              });
            var view2 = default_init(too_many_y_values)[0];
            expect(function() { view2.config([{type: 'scatter'}]).display(); })
              .to.throwException(function (e) {
                  expect(e.name).to.eql('ModelFormatError');
              });
            var view3 = default_init(no_model)[0];
            expect(function() { view3.config([{type: 'scatter'}]).display(); })
              .to.throwException(function (e) {
                  expect(e.name).to.eql('ModelFormatError');
              });
            done();
        });
        it('should work with a legend', function(done) {
            var view = default_init(one_axis_model)[0];
            view.config([{type: 'lines'}, {type: 'legend'}])
                .display();
            done();
        });
        it('should create a bw usage graph', function(done) {
            var view = default_init(bw_usage_model)[0];
            view.config([{type: 'bw_usage'}])
                .display();
            done();
        });
    });
});
