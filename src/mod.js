const { Package, RootPackage, Class } = require('./util/java')
const misc = require("./util/misc");

export class Mod {
  /**
   * @param name the name of the mod
   * @param packageName the name of the java root package the mod will be created in
   * @param path The root path of where the mod will compile to eg. C:\Users\Ree will cause the mod to compile to C:\Users\Ree\mod_name
   */
  constructor(name, path, packageName) {
    /** @type {string} name of the mod */
    this.name = name
    /** @type {string} the path of the mod */
    this.path = path
    const p = packageName.split('.')
    /**@type {Package} the root package of the mod*/
    this.package = new RootPackage(p[0], p[1], p[2])
    /**@type {string} the id of the mod */
    this.id = "untitled_mod";
    /**@type {string} the version of the mod */
    this.version = "1.0.0";
  }

  /**
   * @param modName the name of the mod
   * @param modId the id of the mod
   * @param modVersion the version of the mod
   */
  setModProperties(modName, modId, modVersion) {
      this.name = modName;
      this.id = modId;
      this.version = modVersion;
  }

  createMainModClass() {
    const mainModClass = new Class(utils.capitalize(this.modId.replace("_", " ")))
    console.log(`Creating main mod class ${mainModClass.name}`);
    this.package.addClass(mainModClass);

  }

  compile() {

  }
}

module.exports = {
    Mod,
}