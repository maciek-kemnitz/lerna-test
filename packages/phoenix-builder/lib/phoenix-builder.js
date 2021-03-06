#!/usr/bin/env node
const rollup = require('rollup');
const path = require('path');
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require('@rollup/plugin-node-resolve').default;
const babel = require('@rollup/plugin-babel').default;
const postcss = require('rollup-plugin-postcss');
const typescript = require('@rollup/plugin-typescript');


const currentWorkingPath = process.cwd();
const { src, name } = require(path.join(currentWorkingPath, 'package.json'));

const inputPath = path.join(currentWorkingPath, src);

// Little workaround to get package name without scope
const fileName = name.replace('@maciek-ipsos/', '');
const extensions = ['.js', '.jsx', '.ts', '.tsx']


// see below for details on the options
const inputOptions = {
  input: inputPath,
  external: ['react'],
  plugins: [
    postcss({
      // Key configuration
      modules: true,
    }),
    resolve(),
    commonjs(),
    typescript(),
    babel({
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled',
      extensions
    }),
  ],
};

const outputOptions = [
  {
    file: `dist/${fileName}.cjs.js`,
    format: 'cjs',
  },
  {
    file: `dist/${fileName}.esm.js`,
    format: 'esm',
  },
];

async function build() {
  // create bundle
  const bundle = await rollup.rollup(inputOptions);
  // loop through the options and write individual bundles
  outputOptions.forEach(async (options) => {
    await bundle.write(options);
  });
}

build();