Getting started with |project|
==============================

The main function in |project| is :func:`make_view()`. It parses a JSON blob
that represents a model of a graph, and creates a view out of it. The place
where the view is displayed in the DOM tree is defined by the second argument
`id`, that can be a selector string or a DOM object. Optionally a
:ref:`controller <controller>` can be bound to the view in order to add
functionality for specific user interactions, like mouse clicks or
tooltips that are shown on hovering over elements of the plot. The returned
object is a :class:`d3mvc_view`, that allows to change the visualization of the
data model.

A basic example of an axis model showing no data, is the following:

.. literalinclude:: ../examples/axis.json
   :language: json
   :linenos:

It creates a figure with titles scaled axes with titles and a plot generated
out of three data points. Note, that the JSON blob can also include
configuration for the view of the model. This is a bit inconsequent, but very
convenient in cases where a strict separation of data models and their
visualization is not important.

With the following code, the axis is generated in a DOM element with id
``"one_axis"``.

.. literalinclude:: ../examples/one_axis.js
   :language: javascript
   :linenos:

.. d3mvc:: ../examples/one_axis.js

.. _views:

View concept
------------

The :func:`make_view` function returns objects of type :class:`~d3mvc.View`.
This object has several methods to control the display of the graph.  In the
future, |project| will create a beautiful default view depending on the given
data.  Now, however, a configuration step is mandatory.  The view is configured
by a list of plot operations that are applied to the data.  The simplest on for
the data from the example above, would look like

.. code-block:: javascript

   var simple_scatter_plot = {type: 'scatter'};
   view.addConfig(simple_scatter_plot);
..

More complex configuration are possible, too:

.. code-block:: javascript

   view.config(
       [{
          type: 'scatter',
          if: function(d) { return d.name !== 'mean'; },
          colors: d3mvc.default_colors
        },
        {
          type: 'line',
          if: function(d) { return d.name === 'mean'; },
          colors: 'green'
        },
        { type: 'legend', pos: 'default' }
       ]);
..

This configuration creates a scatter plot for the data points.  If we add data
points that come with a ``name=mean`` field, those would be plotted as line
plots.  Furthermore, we create a legend, that will be positioned on a default
place.

During the :ref:`configuration phase <configuration>`, the view should tests, that the given data
model is in a feasible format, and throw an :class:`ModelFormatError` exception
if this is not the case.

The next step, is to display the view and add the elements to the DOM tree.
This needs to be requested explicitly by a call of the
:func:`~d3mvc.View.display()` method.

The `configuration` and `display` steps can be repeated several times.

In case, the data model changes, the :func:`~d3mvc.View.update()` methods needs
to be called.

.. _configuration:

View plot operations
--------------------

The configuration of the view is a concatenation of several :term:`operation`'s.
Each :term:`operation` has a field called ``type``, describing the type of
operation that is applied to the view.  Optionally the field ``if`` can contain
a function that defines whether the view operation should be applied to a
given :term:`data block`.  Each operation comes with other optional fields,
that are described below:

scatter
  Optional fields are ``colors``.

line
  Optional fields are ``colors``.

legend
  Optional fields is ``pos``

.. _controller:

Controller concept
------------------

At the moment, there are two controllers available:

- :class:`d3mvc.Controller.tooltip`
- :class:`d3mvc.Controller.brush`

