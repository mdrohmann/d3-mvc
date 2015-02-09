var d3mvc = require('../src/d3mvc.js');
var global_window = require('./minidom.js');

var one_axis_model = [{
    "xdesc": "X axis",
    "ydesc": "Y axis",
    "xdomain": [0, 10],
    "ydomain": [-10, 10]
}];

function default_init(model) {
    var test_div = global_window.document.getElementById('test');
    var view = d3mvc.make_view(model, test_div);
    return [view, model];
}

var view = default_init(one_axis_model)[0];
view.config([{type: 'scatter'}]);
view.display();
