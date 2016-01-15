const
  rollup       = require('rollup'),
  babel        = require('rollup-plugin-babel'),
  npm          = require('rollup-plugin-npm'),
  commonjs     = require('rollup-plugin-commonjs'),
  createFilter = require('rollup-pluginutils').createFilter,
  compiler     = require('riot-compiler')

rollup
  .rollup({
    entry: 'src/index.js',
    external: ['riot'],
    plugins: [riot(), npm({ jsnext: true }), commonjs(), babel()]
  })
  .then(bundle => {
    bundle.write({
      format: 'iife',
      moduleName: 'sometime',
      globals: { riot: 'riot' },
      dest: 'dist/sometime.js'
    })
    bundle.write({ format: 'es6', dest: 'dist/sometime.es6.js' })
    bundle.write({ format: 'amd', dest: 'dist/sometime.amd.js' })
    bundle.write({ format: 'cjs', dest: 'dist/sometime.cjs.js' })
  })
  .catch(error => {
    console.error(error)
  })

/**
 * Simple inline-plugin for Riot.js
 */
function riot() {
  const frag = "import riot from 'riot';"
  const filter = createFilter('**/*.tag') // transform tag files only
  return {
    transform (code, id) {
      if (!filter(id)) return null
      return frag + compiler.compile(code)
    }
  }
}
