const globby = require('globby');
const properties = require('properties');
const path = require("path");
const fs = require('fs');
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
  console.info(`[Properties2JsonPlugin] Creating:: ${obj.output}`);
  return globby(obj.files).then(filea => {
    let json = propertiesToJson(filea, obj.options);
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

function propertiesToJson(paths, options) {
  let json = {};
  paths.forEach(path => {
    let file = fs.readFileSync(path, 'utf8')
    extend(json, properties.parse(file, options));
  });
  return JSON.stringify(json);
}

module.exports = Properties2JsonPlugin;