# Properties2JsonPlugin
Webpack plugin for converting .properties files into .json file
```
const Properties2JsonPlugin = require('properties-2-json-webpack-plugin');

module.exports = {
  ...
  
  plugins: [
    ...,
    
    new Properties2JsonPlugin([{
      files: ["**/*_pl.properties"],
      output: 'pl.json'
    }, {
      files: ["**/*_en.properties"],
      output: 'en.json'
    }])
  ]
}
```