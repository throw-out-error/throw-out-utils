const { Vector, Direction } = require('../dist/index')

const v = Vector.EMPTY.clone() // This automatically assigns the coordinates: 0, 0, 0

console.log(v.toString()) // Prints: 0, 0, 0

const above = v.offset(2, Direction.UP)

console.log(above.toString()) // Prints: 0, 2, 0

console.log(`Equal: ${above.equals(v)}`) // Prints: Equal: false