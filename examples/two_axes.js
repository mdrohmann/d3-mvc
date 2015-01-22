d3.json("./two_axes.json", function(model) {
        var view = d3mvc.make_view(model, '#two_axes');
        view.type('lines2d')
            .show();
});
