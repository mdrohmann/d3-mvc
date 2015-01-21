API Documentation
=================

The user of this project, should always think of the three concepts
implemented: `model`, `view` and `controller`.  The `model` is simply a JSON
blob and has no methods at all.  When attached to a `view` object, where the
latter checks the feasibility of the `model` format and throws a
:class:`ModelFormatError` exception if necessary.  In case the model data is
not in the appropriate form, it can be adapted through ref:`model_adapters`.

.. _model_adapters:

Model form adapters
-------------------

- :class:`Continuous2DAdapter`
- :class:`Discrete2DAdapter`
- :class:`CategoricalAdapter`
