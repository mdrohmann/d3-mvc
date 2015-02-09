var d3 = require('d3');
var d3mvc_View = require('./view.js');
var d3mvc_ModelAdapter = require('./modeladapter.js');

var d3mvc = {
    version: '0.3.0-devel'
};

function make_view(model, container_id) {
  var container = d3.select(container_id);
  if (container.size() !== 1) {
    throw {
      "name": "ValueError",
      "message": "The selector " + container_id + " does not exist in the DOM"
    };
  }

  var view = new d3mvc_View(model, container);
  return view;
}

d3mvc.make_view = make_view;
d3mvc.View = d3mvc_View;
d3mvc.ModelAdapter2d = d3mvc_ModelAdapter;

module.exports = d3mvc;

/* vim: set sw=4: */
