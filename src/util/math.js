exports.clamp = function clamp(min, x, max) {
  return x < min ? min : x > max ? max : x
}

exports.sign = function sign(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0
}

exports.avg = (...nums) => nums.reduce((acc, val) => acc + val, 0) / nums.length

exports.euclideanMod = function euclideanMod(numerator, denominator) {
  const result = numerator % denominator
  return result < 0 ? result + denominator : result
}

exports.dist = (loc1, loc2) =>
  Math.sqrt(
    (loc1.x - loc2.x) ** 2 + (loc1.y - loc2.y) ** 2 + (loc1.z - loc2.z) ** 2
  )
