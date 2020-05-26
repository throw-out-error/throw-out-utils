const { PriorityQueue } = require("../dist/index");

const queue = new PriorityQueue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)
queue.enqueue(4)

for(let x of queue) {
    console.log(`Element: ${x}`) // Prints all the elements (1-4)
}

console.log(queue.dequeue()) // outputs 1

console.log(queue.peek()) // outputs 2
