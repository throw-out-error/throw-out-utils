const { Datapack } = require('@throw-out-error/minecraft-utils/datapack')
const myDatapack=new Datapack("My datapack",__dirname,{"description":"my cool datapack!"});
myDatapack.createNamespace("namespace");
myDatapack.compile();