d3.json("./two_axes.json", function(model) {
        var view = d3mvc.make_view(model, '#two_axes');
        view.addConfiguration({type: 'lines'})
            .addConfiguration({type: 'scatter'})
            .display();
});
