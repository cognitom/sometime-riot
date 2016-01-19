module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'riot'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-riot'
    ],
    files: [
      'polyfill.js',
      '../node_modules/expect.js/index.js',
      '../dist/sometime.js',
      'specs/core.specs.js'
    ],
    preprocessors: {
      '**/*.tag': ['riot']
    },
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    singleRun: true
  })
}
