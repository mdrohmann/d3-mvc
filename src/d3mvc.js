var axis = require('./axis.js');
var d3 = require('d3');
var d3mvc_View = require('./view.js');


function make_view(model, container_id) {
  var container = d3.select(container_id);
  if (container === undefined) {
    throw {
      "name": "ValueError",
      "message": "The id #" + container_id + " does not exist in the DOM"
    };
  }

  var view = new d3mvc_View(model, container);
  return view;
}

module.exports = {
  "make_view": make_view,
  "View": d3mvc_View
};
