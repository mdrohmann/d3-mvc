d3.json("./bwusage.json", function(bwusage) {
        var view = d3mvc.make_view(bwusage, '#bwusage');
        view.addConfiguration({type: 'bw_usage'})
            .display();
});
