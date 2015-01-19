var Axis = require('../../src/axis.js');

describe('Axis_Browser', function() {

    var test_div = window.document.getElementById("test");
    test_div.style.width = 200;

    var ax = null;
    beforeEach(function (done) {
        ax = new Axis(test_div, 1);
        done();
    });

    afterEach(function (done) {
        /* uncomment this if you want to look at the last plot */
        for (var i=0; i< test_div.children.length; ++i) {
            test_div.children[i].remove();
        }
        done();
    });

    describe("#init()", function() {
        it('should init a plot', function(done) {
            ax.init();
            done();
        });
        it('should init a plot with two y axes', function(done) {
            ax.yscale(2, "log");
            ax.init();
            done();
        });
    });
});

module.exports = {};
