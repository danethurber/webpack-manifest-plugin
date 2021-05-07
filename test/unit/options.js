const { join } = require('path');

const test = require('ava');
const CopyPlugin = require('copy-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const del = require('del');

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

test('useLegacyEmit', async (t) => {
  const config = {
    context: __dirname,
    entry: {
      main: '../fixtures/file.js'
    },
    output: {
      filename: '[name].js',
      path: join(outputPath, 'useLegacyEmit')
    },
    plugins: [
      new DependencyExtractionWebpackPlugin({
        outputFormat: 'json'
      })
    ]
  };
  const { manifest } = await compile(config, t, { useLegacyEmit: true });

  t.snapshot(manifest);
});
