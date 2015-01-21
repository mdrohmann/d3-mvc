var d3mvc = require('d3mvc');

d3mvc.read_json_cached('./two_axes.json')
     .then(function(model) {
         var view = d3mvc.make_view(model, '#two_axes');
         view.show();
     });
