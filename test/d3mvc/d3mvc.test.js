var d3mvc = require('../../src/d3mvc.js');
var global_window = require('../minidom.js');
var expect = require('expect.js');


describe('d3mvc', function() {
    it('should throw an exception if DOM element is non-existent!', function(done) {
        var empty_dom = global_window.document.getElementById('nonexistent');
        expect(function() { d3mvc.make_view({}, empty_dom); }).to.throwException(function (e) {
            expect(e.name).to.eql('ValueError');
        });
        done();
    });
});

