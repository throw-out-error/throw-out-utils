declare class Package {
  name: string;
  packages: Array<Package>;
  classes: Record<string, Class>
}

declare class RootPackage extends Package {
  domain: Package;
  author: Package;
  packageName: Package;
}

declare class MethodParameter {
  type: Class;
  name: string;
}

declare class Method {
  parameters: Array<MethodParameter>;
  access: string;
  returnType: string;
}

declare class Class {
  name: string;
  access: string;
  methods: Array<Method>;
  imports: Array<string>;
  // TODO: add field
}

declare class Enum extends Class {
  types: Array<string>;
}

declare class Interface extends Class {
  
}