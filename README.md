[tests]: 	https://img.shields.io/circleci/project/github/shellscape/webpack-manifest-plugin.svg
[tests-url]: https://circleci.com/gh/shellscape/webpack-manifest-plugin

[cover]: https://codecov.io/gh/shellscape/webpack-manifest-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/webpack-manifest-plugin

[size]: https://packagephobia.now.sh/badge?p=webpack-manifest-plugin
[size-url]: https://packagephobia.now.sh/result?p=webpack-manifest-plugin

<div align="center">
	<img width="256" src="https://raw.githubusercontent.com/shellscape/webpack-manifest-plugin/master/assets/manifest.svg?sanitize=true" alt="webpack-manfiest-plugin"><br/><br/>
</div>

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)


# webpack-manifest-plugin

A Webpack plugin for generating an asset manifest.

:heart: Please consider [Sponsoring my work](https://github.com/sponsors/shellscape)

## Requirements

`webpack-manifest-plugin` is an [evergreen 🌲](./.github/FAQ.md#what-does-evergreen-mean) module.

This module requires an [Active LTS](https://github.com/nodejs/Release) Node version (v10.0.0+) and Webpack v4.44.0+.

## Install

Using npm:

```console
npm install webpack-nano webpack-manifest-plugin --save-dev
```

_Note: We recommend using [webpack-nano](https://github.com/shellscape/webpack-nano), a very tiny, very clean webpack CLI._

## Usage

Create a `webpack.config.js` file:

```js
const { WebpackManifestPlugin: Manifest } = require('webpack-manifest-plugin');
const options = { ... };

module.exports = {
	// an example entry definition
	entry: [ 'app.js'	],
  ...
  plugins: [
    new Manifest(options)
  ]
};
```

And run `webpack`:

```console
$ npx wp
...

With the default options, the example above will create a `manifest.json` file in the output directory for the build. The manfist file will contain a map of source filenames to the corresponding build output file. e.g.

```json
{
  "dist/batman.js": "dist/batman.1234567890.js",
  "dist/joker.js": "dist/joker.0987654321.js"
}
```

### Options

### `basePath`

Type: `String`<br>
Default: `''`

Specifies a path prefix for all keys in the manifest. Useful for including your output path in the manifest.

### `fileName`

Type: `String`<br>
Default: `manifest.json`

Specifies the file name to use for the resulting manifest. By default the plugin will emit `manifest.json` to your output directory. Passing an absolute path to the `fileName` option will override both the file name and path.

### `filter`

Type: `Function`<br>
Default: `undefined`

Allows filtering the files which make up the manifest. The passed function should match the signature of `(FileDescriptor) => Boolean`. Return `true` to keep the file, `false` to remove the file.

### `generate`

Type: `Function(seed, files, entrypoints): => Object`<br>
Parameter Types: `(Object, FileDescriptor, string[])`<br>
Default: `undefined`

A custom `Function` to create the manifest. It can return anything as long as it's serialisable by `JSON.stringify`.

### `map`

Type: `Function`<br>
Default: `undefined`

Allows modifying the files which make up the manifest. The passed function should match the signature of `(FileDescriptor) => FileDescriptor` where an object matching `FileDescriptor` is returned.

### `publicPath`

Type: `String`
Default: `<webpack-config>.output.publicPath`

A path prefix that will be added to values of the manifest.

### `seed`

Type: `Object`<br>
Default: `{}`

A cache of key/value pairs to used to seed the manifest. This may include a set of [custom key/value](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json) pairs to include in your manifest, or may be used to combine manifests across compilations in [multi-compiler mode](https://github.com/webpack/webpack/tree/master/examples/multi-compiler). To combine manifests, pass a shared seed object to each compiler's `WebpackManifestPlugin` instance.

### `serialize`

Type: `Function(Object) => string`<br>
Default: `undefined`

A `Function` which can be leveraged to serialize the manifest in a different format than json. e.g. `yaml`.

### `sort`

Type: `Function`<br>
Default: `undefined`

Allows sorting the files which make up the manifest. The passed function should match the signature of `(FileDescriptor, FileDescriptor) => Number`. Return `0` to indicate no change, `-1` to indicate the file should be moved to a lower index, and `1` to indicate the file shoud be moved to a higher index.

### `writeToFileEmit`

Type: `Boolean`<br>
Default: `false`

If `true`, will emit the manifest to the build directory _and_ in memory for compatibility with `webpack-dev-server`.


## Manifest File Descriptor

This plugin utilizes the following object structure to work with files. Many options for this plugin utilize the structure below.

```ts
{
  chunk?: Chunk;
  isAsset: boolean;
  isChunk: boolean;
  isInitial: boolean;
  isModuleAsset: boolean;
  name: string | null;
  path: string;
}
```

### `chunk`

Type: [`Chunk`](https://github.com/webpack/webpack/blob/master/lib/Chunk.js)

Only available if `isChunk` is `true`

### `isInitial`

Type: `Boolean`

Is required to run you app. Cannot be `true` if `isChunk` is `false`.

### `isModuleAsset`

Type: `Boolean`

Is required by a module. Cannot be `true` if `isAsset` is `false`.

## Attiribution

Special thanks to [Dane Thurber](https://github.com/danethurber), the original author of this plugin, without whom this plugin would not exist.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (MIT)](./LICENSE)
