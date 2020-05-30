const { Tensor } = require("../dist/index");

let a = Tensor.random([2, 3], 10);
let b = Tensor.random([3, 2], 10);

console.log(a.toString());
console.log(b.toString());

let c = a.dot(b);
console.log(c);
