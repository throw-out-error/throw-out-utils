const {mergeSort} = require('../dist/index')
let unsortedArr = [31, 27, 28, 42, 13, 8, 11, 30, 17, 41, 15, 43, 1, 36, 9, 16, 20, 35, 48, 37, 7, 26, 34, 21, 22, 6, 29, 32, 49, 10, 12, 19, 24, 38, 5, 14, 44, 40, 3, 50, 46, 25, 18, 33, 47, 4, 45, 39, 23, 2];

console.log(mergeSort(unsortedArr));

unsortedArr = ["a", "c", "b", "x", "d", "l", "z", "h", "y", "m"];

console.log(mergeSort(unsortedArr));