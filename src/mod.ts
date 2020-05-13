import { Package, Class } from "./java";
import * as misc from "./misc";

export class Mod {
    rootPackage: Package;
    name: string;
    id: string;
    path: string;
    version: string;

    /**
     * @param name the name of the mod
     * @param packageName the name of the java root package the mod will be created in
     * @param path The root path of where the mod will compile to eg. C:\Users\Ree will cause the mod to compile to C:\Users\Ree\mod_name
     */
    constructor(name, path, packageName) {
        /** @type {string} name of the mod */
        this.name = name;
        /** @type {string} the path of the mod */
        this.path = path;
        const p = packageName.split(".");
        /**@type {Package} the root package of the mod*/
        this.rootPackage = new Package(p[0]);
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
        const mainModClass = new Class(this.id.replace("_", ""), "public", []);
        console.log(`Creating main mod class ${mainModClass.name}`);
        this.rootPackage.addClass(mainModClass);
    }
}
