const { Vector, Direction, Cuboid } = require('../dist/index')

const c = new Cuboid(0, 0, 0, 2, 2, 2)

console.log(`Cuboid bounds: ${c.toString()}`) 

for(let v of c.all()) {
    console.log(`Point in cuboid: ${v.toString()}`)
}
