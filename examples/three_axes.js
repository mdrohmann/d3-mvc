d3.json("./three_axes.json", function(model) {
        var view = d3mvc.make_view(model, '#three_axes');
        view.addConfiguration({type: 'lines'})
            .addConfiguration({type: 'scatter'})
            .addConfiguration({type: 'legend'})
            .display();
});
