const Properties2JsonPlugin = require('../index');
const should = require('should');
const webpack = require('webpack');
const it = require("mocha").it;
const describe = require("mocha").describe;
const before = require("mocha").before;
const afterEach = require("mocha").afterEach;
const fse = require("fs-extra");
var path = require("path");

const generated = "test/generated";

function cleanup(done) {
  fse.remove(generated, function (err) {
    if (err) done(err);
    done();
  });
}

describe('webpack', function () {
  before(cleanup);
  afterEach(cleanup);

  it('should create one .json file correctly', function (done) {
    const expected = path.join(generated, 'pl.json');

    const webpackConfig = {
      plugins: [
        new Properties2JsonPlugin({
          files: ["**/*_pl.properties"],
          output: expected
        })
      ]
    };

    webpack(webpackConfig, function (err, stats) {
      if (err) return done(err);
      if (stats.hasErrors()) done(new Error(stats.toString()));

      const files = stats.toJson().assets.map(x => x.name);
      files.indexOf(expected).should.not.equal(-1);

      done();
    });
  });

  it('should create two .json files correctly', function (done) {
    const expected = {
      PL: path.join(generated, 'pl.json'),
      EN: path.join(generated, 'en.json')
    };

    const webpackConfig = {
      plugins: [
        new Properties2JsonPlugin([{
          files: ["**/*_pl.properties"],
          output: expected.PL
        }, {
          files: ["**/*_en.properties"],
          output: expected.EN
        }])
      ]
    };

    webpack(webpackConfig, function (err, stats) {
      if (err) return done(err);
      if (stats.hasErrors()) done(new Error(stats.toString()));

      const files = stats.toJson().assets.map(x => x.name);
      files.indexOf(expected.PL).should.not.equal(-1);
      files.indexOf(expected.EN).should.not.equal(-1);

      done();
    });
  });
});
