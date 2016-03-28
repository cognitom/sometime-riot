<demo>

  <h2>Sometime: time picker</h2>
  <p>Use the <code>&lt;time-picker&gt;</code> elements.</p>
  <section>
    <time-picker value={ time } onchange={ change } />
  </section>
  <p>Selected time: { time }</p>

  <script>
    this.time = '12:00'

    change (e) {
      this.time = e.target.value
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
