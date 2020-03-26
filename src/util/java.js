class Package {
  /**
   * @param {string} name the name of the package
   */
  constructor(name) {
    /** @type {string} the name of the package */
    this.name = name
    /** @type {Package[]} the child packages of the package */
    this.packages = []
    /** @type {object} the dictionary of classes */
    this.classes = {}
  }

  /**
   * Gets a class.
   */
  /**@param {string} name name of the class*/
  /**@param {Class} Class the class to set it to*/
  setClassByName(name, Class) {
    this.classes[name] = Class
  }

  /**
   * Gets a class by its name.
   */
  /**@param {string} className name of the class*/
  /**@returns {Class} a class */
  getClassByName(className) {
    return this.classes[className]
  }

  /**@param {Class} Class class to add to the package */
  addClass(Class) {
    this.classes[Class.name] = Class
  }

  /**@param {Class} Class class to remove a class from the package */
  removeClass(Class) {
    delete this.classes[Class.name]
  }

  /**
   * Creates a child package
   * @param {String} name name of the package to be created
   * @returns {Package} the created package
   */
  createPackage(name) {
    let _package = new Package(`${this.name}.${name}`)
    this.packages.push(_package)
    return _package
  }
}

class RootPackage extends Package {
  /**
   * @param domain the domain of the package - example: com
   * @param author the author of the package
   * @param name the name of the package
   */
  constructor(domain, author, name) {
    /** @type {Package} the package of the domain */
    this.domain = new Package(domain)
    /** @type {Package} the package of the author */
    this.author = this.domain.createPackage(author)
    /** @type {Package} the name of the package */
    this.packageName = this.author.createPackage(name)
  }

  compile() {
    return `${this.domain.name}/${this.author.name}/${this.name}`
  }
}

class MethodParameter {
  constructor(Class, name) {
    this.type = Class
    this.name = name
  }
}

class Method {
  /**
   * @param {'public'|'private'|'default'|'protected'} access can be public private, default, or protected
   * @param {string} returnType the type of var that is returned
   * @param {string} name the name of the method
   * @param {MethodParameter[]} parameters an array of MethodParameters
   */
  constructor(access, returnType, name, parameters) {
    /**
     * @type {'public'|'private'|'default'|'protected'} the access modifier of the package
     */
    this.access = access || 'public'
    /**@type {string} the type of var that it returns*/
    this.returnType = returnType
    /**@type {string} the name of the method*/
    this.name = name
    /**@type {MethodParameter[]} an array of method parameters*/
    this.parameters = parameters
  }

  compile() {
    /*
      public String testMethod(int p, String s) {
        // code
        anotherMethod(p);
      }
    */
    var s = `${this.access} ${this.returnType} ${this.name} (${
      this.parameters.map(p => `${p.class} ${p.name},`).join()
      /**Get rid of the last comma*/ .slice(0, -1)
    }){}`
    return s
  }
}

class Class {
  constructor(name, access, imports) {
    /**@type {string} name of the class */
    this.name = name

    this.access = access || 'public'

    this.imports = imports
    /**@type {array} contains all methods from the class*/
    this.methods = []
  }

  compile() {
    var str = `${
      imports.map(i=>`import ${i} *;\n`)
    }\n${this.access} ${this.constructor.name.toLowerCase()} ${this.name} {\n${
      this.methods.map(m => `${m.compile()}\n`).join()
    }}`
  }
  /**
   * Adds a method to the class
   * @param {Method} method
   */
  addMethod(method) {
    this.methods.push(method)
  }
}

class Enum extends Class {
  constructor(name,access,imports,fields) {
    super(name,access,imports);
    this.fields=fields;
  }
}

class Interface extends Class {
  constructor(name,access,imports) {
    super(name,access,imports);
  }
}

export default {
  Package,
  Method,
  MethodParameter,
  RootPackage,
  Class,
  Enum,
  Interface,
}
