# Properties2JsonPlugin
Webpack plugin for converting .properties files into .json file

## Installation
```
npm install properties-2-json-webpack-plugin --save-dev
```

## Usage
```js
const Properties2JsonPlugin = require('properties-2-json-webpack-plugin');

module.exports = {
  plugins: [  
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

## Support options
[npm/properties](https://github.com/gagle/node-properties)
```js
new Properties2JsonPlugin({
  files: ["**/*_pl.properties"],
  output: 'pl.json',
  options: {
    namespaces: true
  }
})
```

## Save for JS
Adds `module.exports = ...` to json output
```js
new Properties2JsonPlugin({
  files: ["**/*_pl.properties"],
  output: 'pl.json',
  jsFile: true
})
```

## Tests
```
npm test
```

## License
MIT License
