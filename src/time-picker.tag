import { domEvent, syncEvent } from 'riot-mixin-pack'
import './time-picker-popup.tag'

<time-picker>

  <button onclick={ click } ontouchstart={ click }>{ value } <span class="caret"></span></button>
  <input if={ opts.name } name={ opts.name } type="hidden" value={ value }>

  <script>
    this.mixin(domEvent).mixin(syncEvent)

    const
      popupDom = document.createElement('div'),
      popup = riot.mount(popupDom, 'time-picker-popup', opts)[0]

    this.click = e => {
      const
        deviceType = e.type == 'touchstart' ? 'tablet' : 'pc',
        rect = this.root.getBoundingClientRect(),
        y = rect.top + document.body.scrollTop,
        x = rect.left + document.body.scrollLeft,
        top = y - 4 - this.value.split(':')[0] * 16,
        left = x - 3
      popup.activate(top < 5 ? 5 : top, left, deviceType)
    }

    this.on('mount', () => {
      this.root.value = this.value
      document.body.appendChild(popupDom)
    })

    this.on('unmount', () => {
      document.body.removeChild(popupDom)
    })

    this.on('sync', () => {
      this.value = opts.value || '00:00'
    })

    popup.on('change', (newValue) => {
      // update root's attr, too
      this.root.value = this.value = newValue
      this.skipSync() // skip syncing
      this.update()

      // dispatch an event on DOM
      this.triggerDomEvent('change')
    })
  </script>

  <style scoped>
    :scope {
      display: inline-block;
      background-color: white;
    }
    .caret::after {
      content: "\25BE";
    }
    button {
      display: inline-block;
      padding: 6px 12px;
      margin-bottom: 0;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.4;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      background-image: none;
      border: 1px solid transparent;
      border-radius: 4px;
    }
    button:focus {
      outline: thin dotted;
      outline: 5px auto -webkit-focus-ring-color;
      outline-offset: -2px;
    }
    button:hover,
    button:focus {
      color: #333;
      text-decoration: none;
    }
    button:active,
    button[data-active="yes"] {
      background-image: none;
      outline: 0;
      box-shadow: inset 0 3px 2px rgba(0, 0, 0, .1);
    }
    button[disabled] {
      pointer-events: none;
      cursor: not-allowed;
      box-shadow: none;
      opacity: .65;
    }
    /* colors */
    button { color: #333; background-color: #fff; border-color: #ccc }
    button:hover,
    button:focus,
    button:active,
    button[data-active="yes"] { color: #333; background-color: #e6e6e6; border-color: #adadad }
  </style>

</time-picker>
