<time-picker-popup>

  <ul if={ active }
    style="top: { top }px; left: { left }px">
    <li each={ hours }>
      { hh % 2 ? '&middot;' : hh + ':00' }
    </li>
  </ul>
  <ol if={ active }
    style="top: { top2 }px; left: { left2 }px; display: { subMenuIsOpen ? 'block' : 'none' }"
    class={ roundLeft: roundLeft }>
    <li onmouseover={ mouseover('00') } onclick={ done }>{ hh }:{ mm }</li>
    <li onmouseover={ mouseover('05') } onclick={ done }>&middot;</li>
    <li onmouseover={ mouseover('10') } onclick={ done }>10</li>
    <li onmouseover={ mouseover('15') } onclick={ done }>&middot;</li>
    <li onmouseover={ mouseover('20') } onclick={ done }>20</li>
    <li onmouseover={ mouseover('25') } onclick={ done }>&middot;</li>
    <li onmouseover={ mouseover('30') } onclick={ done }>30</li>
    <li onmouseover={ mouseover('35') } onclick={ done }>&middot;</li>
    <li onmouseover={ mouseover('40') } onclick={ done }>40</li>
    <li onmouseover={ mouseover('45') } onclick={ done }>&middot;</li>
    <li onmouseover={ mouseover('50') } onclick={ done }>50</li>
    <li onmouseover={ mouseover('55') } onclick={ done }>&middot;</li>
  </ol>

  <script>
    const ITEM_HEIGHT = 16
    var popupWidth, popupHeight
    var minutesPositions = []

    this.hours = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      .map(hh => ({ hh: hh, mm: '00' }))
    this.value = opts.value || '00:00'
    this.hh = this.value.split(':')[0]
    this.mm = this.value.split(':')[1]
    this.top = 0
    this.left = 0
    this.top2 = 0
    this.left2 = 0
    this.roundLeft = false
    this.active = false
    this.subMenuIsOpen = false
    this.deviceType = 'pc'

    this.activate = (top, left, deviceType) => {
      switch (this.deviceType = deviceType) {
      case 'pc':     this.activateForPC(top, left); break
      case 'tablet': this.activateForTablet(top, left); break
      }
    }

    this.activateForPC = (top, left) => {
      this.update({
        active:        true,
        subMenuIsOpen: true,
        top:           top,
        left:          left,
        top2:          (top + this.hh * ITEM_HEIGHT + 4),
        left2:         left,
        roundLeft:     false
      })
      const ul = this.root.querySelector('ul')
      popupWidth = ul.clientWidth
      popupHeight = ul.clientHeight
      const w = this.root.querySelector('ol').clientWidth
      if (this.left2 + w > document.body.clientWidth)
        this.update({
          left2: document.body.clientWidth - w -5,
          roundLeft: true
        })
      document.addEventListener('mousemove', this.move)
      document.addEventListener('click', this.deactivate, true)
    }

    this.activateForTablet = (top, left) => {
      this.update({
        active:        true,
        subMenuIsOpen: false,
        top:           top,
        left:          left,
        top2:          (top + this.hh * ITEM_HEIGHT + 4),
        left2:         left,
        roundLeft:     false
      })
      var ul = this.root.querySelector('ul')
      popupWidth = ul.clientWidth
      popupHeight = ul.clientHeight
      document.addEventListener('touchstart', this.touchstart, true)
    }

    this.deactivate = e => {
      this.update({
        active: false
      })
      document.removeEventListener('mousemove', this.move)
      document.removeEventListener('click', this.deactivate, true)
      document.removeEventListener('touchstart', this.touchstart, true)
      document.removeEventListener('touchmove', this.move, false)
      document.removeEventListener('touchend', this.done, false)
    }

    this.touchstart = e => {
      const
        x = document.body.scrollLeft + e.touches[0].clientX,
        y = document.body.scrollTop + e.touches[0].clientY,
        hh = Math.floor((y - this.top - 8) / ITEM_HEIGHT)

      if (x - this.left < 0 || popupWidth < x - this.left
        || y - this.top < 0 || popupHeight < y - this.top) {
        this.deactivate(e)
        return
      }

      this.update({
        top2: this.top + hh * ITEM_HEIGHT + 4,
        hh: (hh < 10 ? '0' + hh : hh + ''),
        subMenuIsOpen: true
      })

      const w = this.root.querySelector('ol').clientWidth
      if (this.left2 + w > document.body.clientWidth)
        this.update({
          left2: document.body.clientWidth - w - 5,
          roundLeft: true
        })

      const lis = this.root.querySelectorAll('ol>li')
      minutesPositions = [].map.call(lis, (c) => {
        const rect = c.getBoundingClientRect()
        return rect.left + document.body.scrollLeft
      })

      document.addEventListener('touchmove', this.move, false)
      document.addEventListener('touchend', this.done, false)
    }

    this.move = e => {
      /* suppress scrolling */
      e.preventDefault()

      /* Study mouse/touch position */
      var x = document.body.scrollLeft
      var y = document.body.scrollTop
      if (this.deviceType == 'pc') {
        x += e.clientX
        y += e.clientY
        if (x - this.left < 0 || popupWidth < x - this.left) return
      } else {
        x += e.touches[0].clientX
        y += e.touches[0].clientY
      }

      /* Calculate hh (hours) */
      var hh = Math.floor((y - this.top - 8) / ITEM_HEIGHT)
      hh = hh < 0 ? 0 : hh > 23 ? 23 : hh

      /* Calculate mm (minutes) */
      var mm = minutesPositions.filter(c => c < x ).length || 1
      mm = (mm - 1) * 5

      /* Update UI */
      if (this.hh - hh || this.mm - mm) {
        this.hh = hh < 10 ? '0' + hh : hh + ''
        this.mm = mm < 10 ? '0' + mm : mm + ''
        this.top2 = this.top + hh * ITEM_HEIGHT + 4
        this.update()
      }
    }

    this.mouseover = mm => e => { this.mm = mm }

    this.done = e => {
      this.trigger('change', this.hh + ':' + this.mm)
      this.deactivate(e)
    }
  </script>

  <style scoped>
    ul {
      position: absolute;
      z-index: 1000;
      float: left;
      padding: 10px 0;
      margin: 0;
      font-size: 14px;
      text-align: left;
      list-style: none;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ccc;
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 4px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    }
    ul > li {
      padding: 0 15px;
      line-height: 16px;
      color: #666;
      position: relative;
      text-align: center;
    }
    ol {
      position: absolute;
      white-space: nowrap;
      z-index: 1001;
      list-style: none;
      padding: 3px 13px;
      margin: 0;
      color: white;
      text-decoration: none;
      background-color: #3879d9;
      cursor: pointer;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, .175);
      transition: left .2s;
    }
    ol.roundLeft {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    ol > li {
      display: inline-block;
      margin: 0;
      padding: 0 2px;
      min-width: 13px;
      text-align: center;
      line-height: 24px;
      border-radius: 4px;
    }
    ol > li + li {
      margin-left: -4px;
      color: rgba(255,255,255,.65)
    }
    ol > li:hover {
      background-color: #528ce1;
      color: white;
    }
  </style>

</time-picker-popup>
