var d3mvc = require('../../src/d3mvc.js');
var global_window = require('../minidom.js');
var expect = require('expect.js');

function default_init() {
    model = [{
        "xdesc": "X axis",
        "ydesc": "Y axis",
        "xdomain": [0, 10],
        "ydomain": [-10, 10]
    }];
    var test_div = global_window.document.getElementById('test');
    view = d3mvc.make_view(model, test_div);
    return [view, model];
}


describe('d3mvc', function() {

    describe('make_view', function() {
        it('should create an x axis title', function(done) {
            var view = default_init()[0];
            expect(view).to.be.a(d3mvc.View);
            view.type('lines2d');
            view.show();
            var title_dom = global_window.document.querySelectorAll(
                ".x.axis");
            expect(title_dom).to.have.length(1);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('X axis');
            done();
        });
        it('should create a y axis title', function(done) {
            var view = default_init()[0];
            expect(view).to.be.a(d3mvc.View);
            view.type('lines2d');
            var title_dom = global_window.document.querySelectorAll(
                ".y.axis");
            expect(title_dom).to.have.length(1);
            expect(title_dom[0].querySelector('.label').innerHTML).to.eql('Y axis');
            done();
        });
    });
});
