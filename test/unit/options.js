const { join } = require('path');

const test = require('ava');
const CopyPlugin = require('copy-webpack-plugin');
const del = require('del');

const webpack = require('webpack');

const { compile } = require('../helpers/unit');

const outputPath = join(__dirname, '../output/options');

test.after(() => del(outputPath));

const clean = (what) => what.replace(/([a-f0-9]{16,32})/gi, '[test-hash]');

test('removeKeyHash', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      filename: '[contenthash].removeKeyHash.js',
      path: join(outputPath, 'removeKeyHash')
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: '../fixtures/*.css', to: '[name].[contenthash].[ext]' },
          { from: '../fixtures/*.txt', to: '[contenthash].[name].[ext]' }
        ]
      })
    ]
  };

  let { manifest } = await compile(config, t);

  manifest = Object.keys(manifest).reduce((prev, key) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {});

  t.snapshot(manifest);

  ({ manifest } = await compile(config, t, { removeKeyHash: false }));

  manifest = Object.keys(manifest).reduce((prev, key) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {});

  t.snapshot(manifest);
});

test('removeKeyHash, custom hash length', async (t) => {
  const config = {
    context: __dirname,
    entry: '../fixtures/file.js',
    output: {
      hashDigestLength: 16,
      filename: '[contenthash].removeKeyHash.js',
      path: join(outputPath, 'removeKeyHashCustomLength')
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: '../fixtures/*.css', to: '[name].[contenthash].[ext]' },
          { from: '../fixtures/*.txt', to: '[contenthash].[name].[ext]' }
        ]
      })
    ]
  };

  let { manifest } = await compile(config, t);

  manifest = Object.keys(manifest).reduce((prev, key) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {});

  t.snapshot(manifest);

  ({ manifest } = await compile(config, t, { removeKeyHash: false }));

  manifest = Object.keys(manifest).reduce((prev, key) => {
    prev[clean(key)] = clean(manifest[key]);
    return prev;
  }, {});

  t.snapshot(manifest);
});

test('useEntryKeys', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'useEntryKeys')
    }
  };
  const { manifest } = await compile(config, t, { useEntryKeys: true });

  t.snapshot(manifest);
});

test('useEntryKeys, exclude sourcemap', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'useEntryKeys-exclude')
    },
    devtool: 'source-map'
  };
  const { manifest } = await compile(config, t, { useEntryKeys: true });

  t.snapshot(manifest);
});

test('processAssetsStage', async (t) => {
  const FIRST_PROCESS_ASSETS_STAGE = 0;
  const SECOND_PROCESS_ASSETS_STAGE = 1;
  let assets;

  class LastStagePlugin {
    /* eslint-disable class-methods-use-this */
    apply(compiler) {
      const isWebpack4 = webpack.version.startsWith('4');

      const callback = (compilation) => {
        // We'll check for our manifest being included in the assets of this invocation
        assets = Object.keys(isWebpack4 ? compilation.assets : compilation);
      };

      const hookOptions = {
        name: 'LastStagePlugin',
        // Make sure our plugin is scheduled to run after the manifest plugin
        stage: SECOND_PROCESS_ASSETS_STAGE
      };

      if (isWebpack4) {
        compiler.hooks.emit.tap(hookOptions, callback);
      } else {
        compiler.hooks.thisCompilation.tap(hookOptions, (compilation) => {
          compilation.hooks.processAssets.tap(hookOptions, callback);
        });
      }
    }
    /* eslint-enable class-methods-use-this */
  }

  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'processAssetsStage')
    },
    plugins: [new LastStagePlugin()]
  };

  // Ensure we register the manifest plugin to run first.
  const { manifest } = await compile(config, t, { processAssetsStage: FIRST_PROCESS_ASSETS_STAGE });

  t.snapshot(manifest);
  const laterPluginHasManifest = assets.includes('manifest.json');
  t.is(laterPluginHasManifest, true);
});
