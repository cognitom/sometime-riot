const
  rollup   = require('rollup'),
  babel    = require('rollup-plugin-babel'),
  resolve  = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs'),
  riot     = require('rollup-plugin-riot')

rollup
  .rollup({
    entry: 'src/index.js',
    external: ['riot'],
    plugins: [riot(), resolve({ jsnext: true }), commonjs(), babel()]
  })
  .then(bundle => {
    bundle.write({
      format: 'iife',
      moduleName: 'sometime',
      globals: { riot: 'riot' },
      dest: 'dist/sometime.js'
    })
  })
  .catch(error => {
    console.error(error)
  })

rollup
  .rollup({
    entry: 'src/index.js',
    external: ['riot', 'riot-mixin-pack'],
    plugins: [riot(), babel()]
  })
  .then(bundle => {
    bundle.write({ format: 'es6', dest: 'dist/sometime.es6.js' })
    bundle.write({ format: 'amd', dest: 'dist/sometime.amd.js' })
    bundle.write({ format: 'cjs', dest: 'dist/sometime.cjs.js' })
  })
  .catch(error => {
    console.error(error)
  })
