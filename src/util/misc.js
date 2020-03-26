/**
 * @description Capitalize the first letter of each word
 */
const capWords = str => str.replace(/\b[a-z]/g, char => char.toUpperCase())

/**
 *
 * @description decodes base64 string
 */
const atob = str => Buffer.from(str, 'base64').toString('binary')

const cap = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''))

/**
 * @description Chunks an array into smaller arrays of a specified size.
 */
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size))

const dayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
module.exports = {
  cap,
  atob,
  capWords,
  chunk,
  dayOfYear,
}
