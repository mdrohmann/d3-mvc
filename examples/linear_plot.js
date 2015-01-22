d3.json('./linear_plot.json', function(model) {
     var view = d3mvc.make_view(model, '#linear_plot');
     view.type('lines2d')
         .show();
});
