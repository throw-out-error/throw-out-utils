# Throw Out Utils

![GitHub repo size](https://img.shields.io/github/repo-size/throw-out-error/throw-out-utils?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/throw-out-error/throw-out-utils?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/throw-out-error/throw-out-utils?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/throw-out-error/throw-out-utils?color=red&style=plastic)

## Warning

This package is deprecated and will no longer be updated. Please see [@toes/core](https://github.com/throw-out-error/core) for more information.

## Description

A collection of utilities by throw-out-error that includes an improved astar pathfinding algorithm, and a bunch of other utilities.

Some of the other utilities include the Cuboid (a bounding box) and some math functions. This package also includes a Tensor class. See the wiki  for more information.

Throw Out Utils also comes with a bundle.js file that can be used in the browser. Although the browser module does not have documentation, feel free to experiment with it. You can access it with `window.throwOutUtils` or just `throwOutUtils`.

## Requirements
### This package requires Nodejs version >= 12.
If you are using an older version it may crash due to several reasons - one being that the Tensor class using the Array#flat function which does not work in older versions of Nodejs.
