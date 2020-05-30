# Throw Out Utils

A collection of utilities by throw-out-error that includes a java representation, an improved astar pathfinding algorithm, and a bunch of other utilities.

Some of the other utilities include the Cuboid (a bounding box) and some math functions. This package also includes a 3D vector class. See the documentation below for more information.

Throw Out Utils also comes with a bundle.js file that can be used in the browser. However, the browser module does not have documentation, but feel free to experiment with it. You can access it with `window.throwOutUtils` or just `throwOutUtils`.

## Tensors (WIP)

You can create a tensor by importing `Tensor` from `@throw-out-error/throw-out-utils` and then calling `new Tensor(DATA, SIZE)`. The data is obviously the data, and the size is an number array. For example:

```ts
const t = new Tensor([1, 2, 3], [3])
```

If you want to pass in vector data easily, you can do something like this:

```ts
// Using Tensor.from makes it easier to use with vector data
const t = Tensor.from(1, 2, 3)
```

If you want to create an empty tensor filled with zeros, use `Tensor.zeros(SIZE)`.

## Cuboids

A cuboid is an axis-aligned bounding box with a minimum and a maximum (Vector) point. See `examples/cuboid.js` for an example.
