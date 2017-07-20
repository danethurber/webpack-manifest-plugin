# Webpack Manifest Plugin [![Build Status](https://travis-ci.org/danethurber/webpack-manifest-plugin.svg?branch=master)](https://travis-ci.org/danethurber/webpack-manifest-plugin)  [![codecov](https://codecov.io/gh/danethurber/webpack-manifest-plugin/badge.svg?branch=master)](https://codecov.io/gh/danethurber/webpack-manifest-plugin?branch=master)


Webpack plugin for generating an asset manifest.

## Install

```bash
npm install --save-dev webpack-manifest-plugin
```

## Usage

In your `webpack.config.js`

```javascript
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ...
    plugins: [
      new ManifestPlugin()
    ]
};
```

This will generate a `manifest.json` file in your root output directory with a mapping of all source file names to their corresponding output file, for example:

```json
{
  "mods/alpha.js": "mods/alpha.1234567890.js",
  "mods/omega.js": "mods/omega.0987654321.js"
}
```


## Configuration

A manifest is configurable using constructor options:

```javascript
new ManifestPlugin({
  fileName: 'my-manifest.json',
  basePath: '/app/'
  seed: {
    name: 'My Manifest'
  }
})
```

**Options:**

* `fileName`: The manifest filename in your output directory (`manifest.json` by default).
* `publicPath`: A path prefix for output files, similar to Webpack's [output.publicPath](https://webpack.js.org/configuration/output/#output-publicpath). For example, the manifest pair `"foo/bar.js":"foo/bar.123.js"` would become `"foo/bar.js":"public/foo/bar.123.js"`.
* `basePath`: A path prefix for _all_ file references, similar to Webpack's [output.path](https://webpack.js.org/configuration/output/#output-path). For example, the manifest pair `"foo/bar.js":"foo/bar.123.js"` would become `"path/to/foo/bar.js":"path/to/foo/bar.123.js"`. Base path is applied after `publicPath`, so the prefixes may be stacked.
* `stripSrc`: removes unwanted strings from source filenames (string or regexp)
* `writeToFileEmit`: If set to `true` will emit to build folder and memory in combination with `webpack-dev-server`
* `seed`: A cache of key/value pairs to used to seed the manifest. This may include a set of [custom key/value](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json) pairs to include in your manifest, or may be used to combine manifests across compilations in [multi-compiler mode](https://github.com/webpack/webpack/tree/master/examples/multi-compiler). To combine manifests, pass a shared seed object to each compiler's ManifestPlugin instance.
