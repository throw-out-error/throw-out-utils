const { Vector, Direction } = require('../dist/index')

// This automatically assigns the coordinates: 0, 0, 0
const v = Vector.EMPTY.clone()

// Prints: 0, 0, 0
console.log(v.toString())

const above = v.offset(2, Direction.UP)

// Prints: 0, 2, 0
console.log(above.toString())

// Prints: Equal: false
console.log(`Equal: ${above.equals(v)}`)