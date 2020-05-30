const { Tensor, Direction } = require('../dist')

// This automatically assigns the coordinates: 0, 0, 0
const v = Tensor.VECTOR_ZERO.clone()

// Prints: 0, 0, 0
console.log(v.toString())

const above = v.clone().offset(2, Direction.UP)

// Prints: 0, 2, 0
console.log(above.toString())

// Prints: Equal: false
console.log(`Equal: ${above.equals(v)}`)

console.log(above.x())