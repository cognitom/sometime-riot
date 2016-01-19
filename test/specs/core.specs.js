describe('Core specs', function() {
  var appDom // mounting point
  var app // reference to the tag

  beforeEach(function() {
    // create mounting points
    appDom = document.createElement('div')
    document.body.appendChild(appDom)
  })

  afterEach(function() {
    if (app) app.unmount()
  })

  it('displays the specified time', function() {
    app = riot.mount(appDom, 'time-picker', { value: '13:30' })[0]
    expect(app.value).to.be('13:30')
    expect(app.root.querySelector('button').textContent).to.be('13:30 ')
  })

})
