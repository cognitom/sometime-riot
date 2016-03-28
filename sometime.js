(function (riot) {
  'use strict';

  riot = 'default' in riot ? riot['default'] : riot;

  var syncEvent = {
    /** Init mixin on each tag */
    init: function init() {
      var _this = this;

      this._shouldSyncFromOpts = true;
      this.on('update', function () {
        if (_this._shouldSyncFromOpts) _this.trigger('sync');
        _this._shouldSyncFromOpts = true;
      });
    },

    /** Skip sync event once */
    skipSync: function skipSync() {
      this._shouldSyncFromOpts = false;
      return this; // return this for method chain
    }
  };

  var domEvent = {
    /**
     * Trigger Event on DOM (root element of the tag)
     * @param { string } eventName - the name of the event. ex: 'change'
     */
    triggerDomEvent: function triggerDomEvent(eventName) {
      var _this = this;

      setTimeout(function () {
        var e;
        if (typeof Event == 'function') {
          // Standard browsers
          e = new Event(eventName);
        } else {
          // IE 9 ~ 11
          e = document.createEvent('Event');
          e.initEvent(eventName, true, true);
        }
        /** dispatch an event */
        _this.root.dispatchEvent(e);
      }, 0);
      return this; // return this for method chain
    }
  };

  riot.tag2('time-picker-popup', '<ul if="{active}" riot-style="top: {top}px; left: {left}px"> <li each="{hours}"> {hh % 2 ? \'&middot;\' : hh + \':00\'} </li> </ul> <ol if="{active}" riot-style="top: {top2}px; left: {left2}px; display: {subMenuIsOpen ? \'block\' : \'none\'}" class="{roundLeft: roundLeft}"> <li onmouseover="{mouseover(\'00\')}" onclick="{done}">{hh}:{mm}</li> <li onmouseover="{mouseover(\'05\')}" onclick="{done}">&middot;</li> <li onmouseover="{mouseover(\'10\')}" onclick="{done}">10</li> <li onmouseover="{mouseover(\'15\')}" onclick="{done}">&middot;</li> <li onmouseover="{mouseover(\'20\')}" onclick="{done}">20</li> <li onmouseover="{mouseover(\'25\')}" onclick="{done}">&middot;</li> <li onmouseover="{mouseover(\'30\')}" onclick="{done}">30</li> <li onmouseover="{mouseover(\'35\')}" onclick="{done}">&middot;</li> <li onmouseover="{mouseover(\'40\')}" onclick="{done}">40</li> <li onmouseover="{mouseover(\'45\')}" onclick="{done}">&middot;</li> <li onmouseover="{mouseover(\'50\')}" onclick="{done}">50</li> <li onmouseover="{mouseover(\'55\')}" onclick="{done}">&middot;</li> </ol>', 'time-picker-popup ul,[riot-tag="time-picker-popup"] ul,[data-is="time-picker-popup"] ul{ position: absolute; z-index: 1000; float: left; padding: 10px 0; margin: 0; font-size: 14px; text-align: left; list-style: none; background-color: #fff; background-clip: padding-box; border: 1px solid #ccc; border: 1px solid rgba(0, 0, 0, .15); border-radius: 4px; box-shadow: 0 6px 12px rgba(0, 0, 0, .175); } time-picker-popup ul > li,[riot-tag="time-picker-popup"] ul > li,[data-is="time-picker-popup"] ul > li{ padding: 0 15px; line-height: 16px; color: #666; position: relative; text-align: center; } time-picker-popup ol,[riot-tag="time-picker-popup"] ol,[data-is="time-picker-popup"] ol{ position: absolute; white-space: nowrap; z-index: 1001; list-style: none; padding: 3px 13px; margin: 0; color: white; text-decoration: none; background-color: #3879d9; cursor: pointer; border-top-right-radius: 4px; border-bottom-right-radius: 4px; box-shadow: 0 3px 6px rgba(0, 0, 0, .175); transition: left .2s; } time-picker-popup ol.roundLeft,[riot-tag="time-picker-popup"] ol.roundLeft,[data-is="time-picker-popup"] ol.roundLeft{ border-top-left-radius: 4px; border-bottom-left-radius: 4px; } time-picker-popup ol > li,[riot-tag="time-picker-popup"] ol > li,[data-is="time-picker-popup"] ol > li{ display: inline-block; margin: 0; padding: 0 2px; min-width: 13px; text-align: center; line-height: 24px; border-radius: 4px; } time-picker-popup ol > li + li,[riot-tag="time-picker-popup"] ol > li + li,[data-is="time-picker-popup"] ol > li + li{ margin-left: -4px; color: rgba(255,255,255,.65) } time-picker-popup ol > li:hover,[riot-tag="time-picker-popup"] ol > li:hover,[data-is="time-picker-popup"] ol > li:hover{ background-color: #528ce1; color: white; }', '', function (opts) {
    var _this = this;

    var ITEM_HEIGHT = 16;
    var popupWidth, popupHeight;
    var minutesPositions = [];

    this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'].map(function (hh) {
      return { hh: hh, mm: '00' };
    });
    this.value = opts.value || '00:00';
    this.hh = this.value.split(':')[0];
    this.mm = this.value.split(':')[1];
    this.top = 0;
    this.left = 0;
    this.top2 = 0;
    this.left2 = 0;
    this.roundLeft = false;
    this.active = false;
    this.subMenuIsOpen = false;
    this.deviceType = 'pc';

    this.activate = function (top, left, deviceType) {
      switch (_this.deviceType = deviceType) {
        case 'pc':
          _this.activateForPC(top, left);break;
        case 'tablet':
          _this.activateForTablet(top, left);break;
      }
    };

    this.activateForPC = function (top, left) {
      _this.update({
        active: true,
        subMenuIsOpen: true,
        top: top,
        left: left,
        top2: top + _this.hh * ITEM_HEIGHT + 4,
        left2: left,
        roundLeft: false
      });
      var ul = _this.root.querySelector('ul');
      popupWidth = ul.clientWidth;
      popupHeight = ul.clientHeight;
      var w = _this.root.querySelector('ol').clientWidth;
      if (_this.left2 + w > document.body.clientWidth) _this.update({
        left2: document.body.clientWidth - w - 5,
        roundLeft: true
      });
      document.addEventListener('mousemove', _this.move);
      document.addEventListener('click', _this.deactivate, true);
    };

    this.activateForTablet = function (top, left) {
      _this.update({
        active: true,
        subMenuIsOpen: false,
        top: top,
        left: left,
        top2: top + _this.hh * ITEM_HEIGHT + 4,
        left2: left,
        roundLeft: false
      });
      var ul = _this.root.querySelector('ul');
      popupWidth = ul.clientWidth;
      popupHeight = ul.clientHeight;
      document.addEventListener('touchstart', _this.touchstart, true);
    };

    this.deactivate = function (e) {
      _this.update({
        active: false
      });
      document.removeEventListener('mousemove', _this.move);
      document.removeEventListener('click', _this.deactivate, true);
      document.removeEventListener('touchstart', _this.touchstart, true);
      document.removeEventListener('touchmove', _this.move, false);
      document.removeEventListener('touchend', _this.done, false);
    };

    this.touchstart = function (e) {
      var x = document.body.scrollLeft + e.touches[0].clientX,
          y = document.body.scrollTop + e.touches[0].clientY,
          hh = Math.floor((y - _this.top - 8) / ITEM_HEIGHT);

      if (x - _this.left < 0 || popupWidth < x - _this.left || y - _this.top < 0 || popupHeight < y - _this.top) {
        _this.deactivate(e);
        return;
      }

      _this.update({
        top2: _this.top + hh * ITEM_HEIGHT + 4,
        hh: hh < 10 ? '0' + hh : hh + '',
        subMenuIsOpen: true
      });

      var w = _this.root.querySelector('ol').clientWidth;
      if (_this.left2 + w > document.body.clientWidth) _this.update({
        left2: document.body.clientWidth - w - 5,
        roundLeft: true
      });

      var lis = _this.root.querySelectorAll('ol>li');
      minutesPositions = [].map.call(lis, function (c) {
        var rect = c.getBoundingClientRect();
        return rect.left + document.body.scrollLeft;
      });

      document.addEventListener('touchmove', _this.move, false);
      document.addEventListener('touchend', _this.done, false);
    };

    this.move = function (e) {

      e.preventDefault();

      var x = document.body.scrollLeft;
      var y = document.body.scrollTop;
      if (_this.deviceType == 'pc') {
        x += e.clientX;
        y += e.clientY;
        if (x - _this.left < 0 || popupWidth < x - _this.left) return;
      } else {
        x += e.touches[0].clientX;
        y += e.touches[0].clientY;
      }

      var hh = Math.floor((y - _this.top - 8) / ITEM_HEIGHT);
      hh = hh < 0 ? 0 : hh > 23 ? 23 : hh;

      var mm = minutesPositions.filter(function (c) {
        return c < x;
      }).length || 1;
      mm = (mm - 1) * 5;

      if (_this.hh - hh || _this.mm - mm) {
        _this.hh = hh < 10 ? '0' + hh : hh + '';
        _this.mm = mm < 10 ? '0' + mm : mm + '';
        _this.top2 = _this.top + hh * ITEM_HEIGHT + 4;
        _this.update();
      }
    };

    this.mouseover = function (mm) {
      return function (e) {
        _this.mm = mm;
      };
    };

    this.done = function (e) {
      _this.trigger('change', _this.hh + ':' + _this.mm);
      _this.deactivate(e);
    };
  });

  riot.tag2('time-picker', '<button onclick="{click}" ontouchstart="{click}">{value} <span class="caret"></span></button> <input if="{opts.name}" name="{opts.name}" type="hidden" value="{value}">', 'time-picker,[riot-tag="time-picker"],[data-is="time-picker"]{ display: inline-block; background-color: white; } time-picker .caret::after,[riot-tag="time-picker"] .caret::after,[data-is="time-picker"] .caret::after{ content: "\\25BE"; } time-picker button,[riot-tag="time-picker"] button,[data-is="time-picker"] button{ display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.4; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; } time-picker button:focus,[riot-tag="time-picker"] button:focus,[data-is="time-picker"] button:focus{ outline: thin dotted; outline: 5px auto -webkit-focus-ring-color; outline-offset: -2px; } time-picker button:hover,[riot-tag="time-picker"] button:hover,[data-is="time-picker"] button:hover,time-picker button:focus,[riot-tag="time-picker"] button:focus,[data-is="time-picker"] button:focus{ color: #333; text-decoration: none; } time-picker button:active,[riot-tag="time-picker"] button:active,[data-is="time-picker"] button:active,time-picker button[data-active="yes"],[riot-tag="time-picker"] button[data-active="yes"],[data-is="time-picker"] button[data-active="yes"]{ background-image: none; outline: 0; box-shadow: inset 0 3px 2px rgba(0, 0, 0, .1); } time-picker button[disabled],[riot-tag="time-picker"] button[disabled],[data-is="time-picker"] button[disabled]{ pointer-events: none; cursor: not-allowed; box-shadow: none; opacity: .65; } time-picker button,[riot-tag="time-picker"] button,[data-is="time-picker"] button{ color: #333; background-color: #fff; border-color: #ccc } time-picker button:hover,[riot-tag="time-picker"] button:hover,[data-is="time-picker"] button:hover,time-picker button:focus,[riot-tag="time-picker"] button:focus,[data-is="time-picker"] button:focus,time-picker button:active,[riot-tag="time-picker"] button:active,[data-is="time-picker"] button:active,time-picker button[data-active="yes"],[riot-tag="time-picker"] button[data-active="yes"],[data-is="time-picker"] button[data-active="yes"]{ color: #333; background-color: #e6e6e6; border-color: #adadad }', '', function (opts) {
    var _this = this;

    this.mixin(domEvent).mixin(syncEvent);

    var popupDom = document.createElement('div'),
        popup = riot.mount(popupDom, 'time-picker-popup', opts)[0];

    this.click = function (e) {
      var deviceType = e.type == 'touchstart' ? 'tablet' : 'pc',
          rect = _this.root.getBoundingClientRect(),
          y = rect.top + document.body.scrollTop,
          x = rect.left + document.body.scrollLeft,
          top = y - 4 - _this.value.split(':')[0] * 16,
          left = x - 3;
      popup.activate(top < 5 ? 5 : top, left, deviceType);
    };

    this.on('mount', function () {
      _this.root.value = _this.value;
      document.body.appendChild(popupDom);
    });

    this.on('unmount', function () {
      document.body.removeChild(popupDom);
    });

    this.on('sync', function () {
      _this.value = opts.value || '00:00';
    });

    popup.on('change', function (newValue) {

      _this.root.value = _this.value = newValue;
      _this.skipSync();
      _this.update();

      _this.triggerDomEvent('change');
    });
  });

}(riot));