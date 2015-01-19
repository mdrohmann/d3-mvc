var Axis = require('../../src/axis.js');
var global_window = require('../minidom.js');
var expect = require("expect.js");

describe('Axis', function() {

    var test_div = global_window.document.getElementById("test");

    it ('should raise an exception if container does not exist', function () {
        expect(function() { return new Axis("#nonexistent"); }).to.throwException(
            /Identifier .* does not describe an existing DOM element/);
    });

    var ax = null;

    beforeEach(function (done) {
        ax = new Axis(test_div, 1);
        done();
    });

    it ('should return the container', function (done) {
        expect(ax.dom_container().node()).to.equal(test_div);
        done();
    });

    describe('#xlabel()', function() {
        it('should be \'x\' in the beginning', function(done) {
            expect(ax.xlabel()).to.eql('x');
            expect(ax.xlabel(0)).to.eql('x');
            done();
        });
        it('should return \'undefined\' if label does not exist', function(done) {
            expect(ax.xlabel('new')).to.be(undefined);
            done();
        });
        it('should create a new label for a new numerical index', function(done) {
            ax.xlabel(1, 'x2');
            expect(ax.xlabel(1)).to.eql('x2');
            done();
        });
        it('should create a new label for a new string index', function(done) {
            ax.xlabel('xname', 'x3');
            expect(ax.xlabel('xname')).to.eql('x3');
            done();
        });
    });

    describe('#ylabel()', function() {
        it('should be \'y\' in the beginning', function(done) {
            expect(ax.ylabel()).to.eql('y');
            expect(ax.ylabel(0)).to.eql('y');
            done();
        });
        it('should return \'undefined\' if label does not exist', function(done) {
            expect(ax.ylabel(1)).to.be(undefined);
            done();
        });
        it('should create a new label for a new numerical index', function(done) {
            ax.ylabel(1, 'y2');
            expect(ax.ylabel(1)).to.eql('y2');
            done();
        });
        it('should create a new label for a new string index', function(done) {
            ax.ylabel('yname', 'y3');
            expect(ax.ylabel('yname')).to.eql('y3');
            done();
        });
    });

    describe('#xscale()', function() {
        it('should return a function in the beginning', function (done) {
            expect(ax.xscale()).to.eql('linear');
            expect(ax.xscale(0)).to.eql('linear');
            done();
        });
        it('should update the existing scale', function(done) {
            ax.xscale(0, 'log');
            expect(ax.xscale()).to.eql('log');
            done();
        });
        it('should return undefined if index does not exist', function(done) {
            expect(ax.xscale(1)).to.be(undefined);
            done();
        });
        it('should create a new scale for a new numerical index', function(done) {
            ax.xscale(1, 'log');
            expect(ax.xscale(1)).to.eql('log');
            expect(ax.xAxis_[1].scale()).to.equal(ax.x(1));
            done();
        });
        it('should create a new scale for a new string index', function(done) {
            ax.xscale('xname', 'linear');
            expect(ax.xscale('xname')).to.eql('linear');
            expect(ax.xAxis_.xname.scale()).to.equal(ax.x('xname'));
            done();
        });
        it('should raise an exception if unknown xscale type is requested', function(done) {
            expect(ax.xscale).withArgs(2, 'unknown').to.throwException(/xscale option is unknown/);
            done();
        });
    });

    describe('#yscale()', function() {
        it('should return a function in the beginning', function (done) {
            expect(ax.yscale()).to.eql('linear');
            expect(ax.yscale(0)).to.eql('linear');
            done();
        });
        it('should update the existing scale', function(done) {
            ax.yscale(0, 'log');
            expect(ax.yscale()).to.eql('log');
            done();
        });
        it('should be undefined exception if index does not exist', function(done) {
            expect(ax.yscale(1)).to.be(undefined);
            done();
        });
        it('should create a new scale for a new numerical index', function(done) {
            ax.yscale(1, 'log');
            expect(ax.yscale(1)).to.eql('log');
            expect(ax.yAxis_[1].scale()).to.equal(ax.y(1));
            done();
        });
        it('should create a new scale for a new string index', function(done) {
            ax.yscale('yname', 'linear');
            expect(ax.yscale('yname')).to.eql('linear');
            expect(ax.yAxis_.yname.scale()).to.equal(ax.y('yname'));
            done();
        });
        it('should raise an exception if unknown yscale type is requested', function(done) {
            expect(ax.yscale).withArgs(2, 'unknown').to.throwException(/yscale option is unknown/);
            done();
        });
    });

    describe('#x()', function() {
        it('should return a linear scale in the beginning', function(done) {
            var x = ax.x();
            expect(x).to.be.a('function');
            expect(x).to.be(ax.x(0));
            x.range([0, 1]);
            expect(x(1)).to.eql(1);
            done();
        });
        it('should return undefined if index does not exist', function(done) {
            expect(ax.x(1)).to.be(undefined);
            done();
        });
        it('should return a log scale after creation with xscale', function(done) {
            ax.xscale('new', 'log');
            var x = ax.x('new');
            expect(x).to.be.a('function');
            x.range([0, 1]);
            expect(x(1)).to.eql(0);
            done();
        });
    });

    describe('#y()', function() {
        it('should return a linear scale in the beginning', function(done) {
            var y = ax.y();
            expect(y).to.be.a('function');
            expect(y).to.be(ax.y(0));
            y.range([0, 1]);
            expect(y(1)).to.eql(1);
            done();
        });
        it('should return undefined if index does not exist', function(done) {
            expect(ax.y(1)).to.be(undefined);
            done();
        });
        it('should return a log scale after creation with yscale', function(done) {
            ax.yscale('new', 'log');
            var y = ax.y('new');
            expect(y).to.be.a('function');
            y.range([0, 1]);
            expect(y(1)).to.eql(0);
            done();
        });
    });

    describe('#make_x_axis_configurations_()', function() {
        it('should create a single configuration in the beginning', function (done) {
            var configs = ax.make_x_axis_configurations_();
            expect(configs).to.have.length(1);
            done();
        });

        it('should create two configurations after adding a second x scale', function (done) {
            ax.xscale('new', 'log');
            var configs = ax.make_x_axis_configurations_();
            expect(configs).to.have.length(2);
            expect(configs[0].transformation).not.to.eql(configs[1].transformation);
            expect(configs[0].axis).not.to.equal(configs[1].axis);
            expect(configs[1].label).to.eql('x1');
            done();
        });
        it('should raise an error if three x scales exist', function (done) {
            function temp() {
                ax.xscale('new', 'log');
                ax.xscale('new2', 'log');
                ax.make_x_axis_configurations_();
            }
            expect(temp).to.throwException(/only two x scales allowed per axis/);
            done();
        });
    });

    describe('#make_y_axis_configurations_()', function() {
        it('should create a single configuration in the beginning', function (done) {
            var configs = ax.make_y_axis_configurations_();
            expect(configs).to.have.length(1);
            done();
        });

        it('should create two configurations after adding a second y scale', function (done) {
            ax.yscale('new', 'log');
            var configs = ax.make_y_axis_configurations_();
            expect(configs).to.have.length(2);
            expect(configs[0].transformation).not.to.eql(configs[1].transformation);
            expect(configs[0].axis).not.to.equal(configs[1].axis);
            expect(configs[1].label).to.eql('y1');
            done();
        });
        it('should raise an error if three y scales exist', function (done) {
            function temp() {
                ax.yscale('new', 'log');
                ax.yscale('new2', 'log');
                ax.make_y_axis_configurations_();
            }
            expect(temp).to.throwException(/only two y scales allowed per axis/);
            done();
        });
    });

});

module.exports = {};
