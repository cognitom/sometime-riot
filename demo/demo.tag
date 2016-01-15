<demo>

  <h2>Time picker</h2>
  <p>Use the <code>&lt;time-picker&gt;</code> elements.</p>
  <section>
    <time-picker value={ time } onchange={ change } />
  </section>

  <script>
    var self = this
    self.time = '12:00'

    change (e) {
      self.time = e.target.value
    }
  </script>

  <style scoped>
    :scope {
      display: block;
      padding: 2em;
    }
    section {
      border: 1px solid #ddd;
      padding: 1em;
      border-radius: .25em;
    }
  </style>

</demo>
