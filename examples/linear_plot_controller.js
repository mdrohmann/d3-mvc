var d3mvc = require('d3mvc');

d3mvc.read_json_cached('./linear_plot.json')
     .then(function(model) {
         var tooltip_controller = d3mvc.Controller.tooltip(
              function(model, id, x, y) {
                   return d3mvc.str_format(
                        "{}: {}={}, {}={}",
                        id, model.xdesc(), x, model.ydesc(), y);
         });
         var view = d3mvc.make_view(
              model, '#linear_plot_controller', tooltip_controller);
         view.show();
     });
