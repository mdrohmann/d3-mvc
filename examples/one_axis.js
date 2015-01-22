d3.json("./axis.json", function(one_axis) {
        var view = d3mvc.make_view(one_axis, '#one_axis');
        view.addConfiguration({type: 'lines2d'})
            .display();
});
