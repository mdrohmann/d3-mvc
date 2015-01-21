var d3mvc = require('d3mvc');

d3mvc.read_json_cached('./axis.json')
     .then(function(model) {
         var view = d3mvc.make_view(model, '#one_axis');
         view.show();
     });
