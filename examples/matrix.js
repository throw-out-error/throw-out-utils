const { Vector, Matrix } = require('../dist/index')

let a = new Matrix(2, 3)
let b = new Matrix(3, 2)

a.randomize(10)
b.randomize(10)

console.table(a.data)
console.table(b.data)

let c = a.dot(b)
console.table(c.data)