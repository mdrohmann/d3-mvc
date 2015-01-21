var d3mvc = require('d3mvc');

d3mvc.read_json_cached('./linear_plot.json')
     .then(function(model) {
         var view = d3mvc.make_view(model, '#linear_plot');
         view.show();
     });
