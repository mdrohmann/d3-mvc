Getting started with |project|
==============================

The main function in |project| is :func:`make_view()`. It parses a JSON blob
that represents a model of a graph, and creates a view out of it. The place
where the view is displayed in the document is defined by the second argument
`id`. Optionally a :ref:`controller <controller>` can be bound to the view in
order to add functionality for specific user interactions, like mouse clicks or
tooltips that are shown on hovering over elements of the plot. The returned
object is a :class:`d3mvc_view`, that allows to change the visualization of the data model.

A basic example of an axis model showing no data, is the following:

.. literalinclude:: ../examples/axis.json
   :language: json
   :linenos:

It creates a figure with a title and scaled axes with titles. Note, that the
JSON blob can also include configuration for the view of the model. This is a
bit inconsequent, but very convenient in cases where a strict separation of
data models and their visualization is not important.

.. d3mvc:: ../examples/one_axis.js

.. _views:

View concept
------------

The view comes with methods to control the visualization of the given data
model.

Every view comes with the following methods:

  - :func:`~d3mvc.View.hide()` / :func:`~d3mvc_view.show()`,
  - :func:`~d3mvc.View.update()`,
  - :func:`~d3mvc.View.xtitle()`, :func:`~d3mvc_view.ytitle()`,
  - :func:`~d3mvc.View.xrange()`, :func:`~d3mvc_view.yrange()`,
  - :func:`~d3mvc.View.zoom()` and
  - :func:`~d3mvc.View.type()`.

Furthermore, a view should be able to test, that the given data model is in a
feasible format, and throw an :class:`ModelFormatError` exception if this is
not the case.

.. _controller:

Controller concept
------------------

At the moment, there are two controllers available:

- :class:`d3mvc.Controller.tooltip`
- :class:`d3mvc.Controller.brush`

