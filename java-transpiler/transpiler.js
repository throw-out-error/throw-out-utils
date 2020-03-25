const java = require('./java')
const conversions = require('./conversions')
const generateWebCode = rootPackage => {
  let classes = {}
  function getClasses(_package) {
    _package.classes.forEach(
      c => classes[`${_package.name}.${c.name}`.replace(/\./g, '/')]
    )
    _package.packages.forEach(p => getClasses(p))
  }
  getClasses(rootPackage)
}
