const { Tensor, Direction, Cuboid } = require("../dist/index");

const c = new Cuboid(-4, -4, -4, 4, 4, 4);

console.log(`Cuboid bounds: ${c.toString()}`);

// Should print false
console.log(`Point (5, 5, 5) is within cuboid: ${c.contains(5, 5, 5)}`);

console.log(`Cuboid size: ${c.getSize().toString()}`);

console.log(`Center: ${c.getCenter().toString()}`);
