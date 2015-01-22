var d3 = require('d3');
var d3mvc_View = require('./view.js');

var d3mvc = {
    version: '0.2.0'
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

module.exports = d3mvc;

/* vim: set sw=4: */
