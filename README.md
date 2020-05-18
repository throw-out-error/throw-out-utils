# Throw Out Utils

A collection of utilities by throw-out-error that includes a java representation, an improved astar pathfinding algorithm, and a bunch of other utilities.

Some of the other utilities include the Cuboid (a bounding box) and some math functions. This package also includes a 3D vector class. See the documentation below for more information.

Throw Out Utils also comes with a bundle.js file that can be used in the browser. However, the browser module does not have documentation, but feel free to experiment with it. You can access it with `window.throwOutUtils` or just `throwOutUtils`.

## Vectors

A vector is a class that stores 3d coordinates and can be operated using multiplication, addition, etc. If the coordinates are not specified, it automatically uses the coordinates 0, 0, 0. See `examples/vec.js` for an example.

## Cuboids

A cuboid is an axis-aligned bounding box with a minimum and a maximum (Vector) point. See `examples/cuboid.js` for an example.
