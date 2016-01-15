module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher'
    ],
    files: [
      'polyfill.js',
      '../node_modules/expect.js/index.js',
      '../node_modules/riot/riot.js',
      '../dist/sometime.js',
      'specs/core.specs.js'
    ],
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    singleRun: true
  })
}
