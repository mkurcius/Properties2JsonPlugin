const globby = require('globby');
const properties = require('properties-parser');
const extend = require('util')._extend;

function Properties2JsonPlugin(options) {
  this.opt = options;
}

Properties2JsonPlugin.prototype.apply = function (compiler) {
  var opt = Array.isArray(this.opt) ? this.opt : [this.opt];

  compiler.plugin('emit', function (compilation, callback) {
    var promises = [];
    opt.forEach(obj => promises.push(worker(obj, compilation)));

    Promise.all(promises)
      .then(() => { callback(); })
      .catch(callback);
  });

};

function worker(obj, compilation) {
  return globby(obj.files).then(paths => {
    var json = propertiesToJson(paths);
    addAsset(compilation, json, obj.output);
  });
}

function propertiesToJson(paths) {
  var json = {};
  paths.forEach(path => {
    extend(json, properties.read(path));
  });

  return JSON.stringify(json);
}

function addAsset(compilation, json, output) {
  compilation.assets[output] = {
    source: function () {
      return json;
    },
    size: function () {
      return json.length;
    }
  };
}

module.exports = Properties2JsonPlugin;