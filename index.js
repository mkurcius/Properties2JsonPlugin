const globby = require('globby');
const properties = require('properties-parser');
const path = require("path");
const extend = require('util')._extend;

function Properties2JsonPlugin(options) {
  this.opt = options;
}

Properties2JsonPlugin.prototype.apply = function (compiler) {
  let opt = Array.isArray(this.opt) ? this.opt : [this.opt];

  compiler.plugin('emit', function (compilation, callback) {
    let promises = [];
    opt.forEach(obj => promises.push(worker(obj, compilation)));

    Promise.all(promises)
      .then(() => {
        callback();
      })
      .catch(callback);
  });

};

function worker(obj, compilation) {
  return globby(obj.files).then(filea => {
    let json = propertiesToJson(filea);
    filea.forEach(file => {
      file = path.resolve(compilation.compiler.context, file);
      compilation.fileDependencies.push(file);
    });

    compilation.assets[obj.output] = {
      source: () => json,
      size: () => json.length
    };
  });
}

function propertiesToJson(paths) {
  let json = {};
  paths.forEach(path => {
    extend(json, properties.read(path));
  });

  return JSON.stringify(json);
}

module.exports = Properties2JsonPlugin;