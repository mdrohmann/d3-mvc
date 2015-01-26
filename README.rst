======
D3-mvc
======

If you want to visualize a lot of basic 2D plots with
interactive elements, this package might be useful for
you. It uses the famous `d3`_ package to create plots:
All you have to do is to include the bundles javascript
file and format your data into json files containing your
``x`` and ``y`` values of the plot and add the following
tiny script to your webpage:

.. code:: javascript

    d3.json("./xy_data.json", function(model) {
            var view = d3mvc.make_view(model, '#dom_id');
            view.addConfiguration({type: 'lines'})
                .addConfiguration({type: 'scatter'})
                .addConfiguration({type: 'legend'})
                .display();
    });
..

The ``view`` is a description of how the data should be visualized.  The configuration options are still very limited, but easy to extend.  For more information on the format of the data files, I refer to the examples/ directory.

Design goals
============

- a strict separation between model (what data should be visualized?) and view (how should the data be visualized?).
- easy extension / reusability with custom views

Interactive demo
================

An interactive demo for this project is available `here <http://bl.ocks.org/mdrohmann/d1f068cfff753d25c45c/0750ae8cc131fbcbbe2c06238213a34fcc647017>`_.

.. _d3: http://d3js.org/
