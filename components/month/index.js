'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../../common/component');
var utils_1 = require('../../utils');
component_1.VantComponent({
  props: {
    date: {
      type: null,
      observer: 'setDays',
    },
    type: {
      type: String,
      observer: 'setDays',
    },
    minDate: {
      type: null,
      observer: 'setDays',
    },
    maxDate: {
      type: null,
      observer: 'setDays',
    },
    showMark: Boolean,
    rowHeight: [Number, String],
    formatter: {
      type: null,
      observer: 'setDays',
    },
    currentDate: {
      type: [null, Array],
      observer: 'setDays',
    },
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
  },
  data: {
    visible: true,
    days: [],
  },
  methods: {
    onClick: function (event) {
      var index = event.currentTarget.dataset.index;
      var item = this.data.days[index];
      if (item.type !== 'disabled') {
        this.$emit('click', item);
      }
    },
    setDays: function () {
      var days = [];
      var startDate = new Date(this.data.date);
      var year = startDate.getFullYear();
      var month = startDate.getMonth();
      var totalDay = utils_1.getMonthEndDay(
        startDate.getFullYear(),
        startDate.getMonth() + 1
      );
      for (var day = 1; day <= totalDay; day++) {
        var date = new Date(year, month, day);
        var active = this.getDayType(date);
        var config = {
          date: date,
          type: (active || {}).type,
          text: day,
          color: (active || {}).color,
        };
        active && active.bottomInfo ? config.bottomInfo = active.bottomInfo : ""
        if (this.data.formatter) {
          config = this.data.formatter(config);
        }
        days.push(config);
      }
      this.setData({ days: days });
    },
    getMultipleDayType: function (day) {
      var currentDate = this.data.currentDate;
      if (!Array.isArray(currentDate)) {
        return '';
      }
      var isSelected = function (date) {
        return currentDate.some(function (item) {
          return utils_1.compareDay(item, date) === 0;
        });
      };
      
      if (isSelected(day)) {
        var prevDay = utils_1.getPrevDay(day);
        var nextDay = utils_1.getNextDay(day);
        var prevSelected = isSelected(prevDay);
        var nextSelected = isSelected(nextDay);
        if (prevSelected && nextSelected) {
          return 'multiple-middle';
        }
        if (prevSelected) {
          return 'end';
        }
        return nextSelected ? 'start' : 'multiple-selected';
      }
      return '';
    },
    getRangeDayType: function (day) {
      var currentDate = this.data.currentDate,
      value = {};
      if (!Array.isArray(currentDate)) {
        return;
      }
      currentDate.some((arr) => {
        var startDay = arr.start,
          endDay = arr.end,
          info = arr.remark,
          color = arr.color || "#ee0a24"
        if (!startDay) {
          return;
        }
        var compareToStart = (0, utils_1.compareDay)(day, startDay);
        var compareToEnd = (0, utils_1.compareDay)(day, endDay);
        if (compareToStart === 0) {
          value = {
            type: "start",
            color,
            bottomInfo: info
          };
          return true
        } else if (compareToEnd === 0) {
          value =  {
            type: "end",
            color,
            bottomInfo: "结束"
          };
          return true
        } else if (compareToStart > 0 && compareToEnd < 0) {
          value =  {
            type: "middle",
            color
          };
          return true
        }
      })
      return value
    },
    getDayType: function (day) {
      var _a = this.data,
        type = _a.type,
        minDate = _a.minDate,
        maxDate = _a.maxDate,
        currentDate = _a.currentDate;
      if (
        utils_1.compareDay(day, minDate) < 0 ||
        utils_1.compareDay(day, maxDate) > 0
      ) {
        return 'disabled';
      }
      if (type === 'single') {
        return utils_1.compareDay(day, currentDate) === 0 ? 'selected' : '';
      }
      if (type === 'multiple') {
        return this.getMultipleDayType(day);
      }
      /* istanbul ignore else */
      if (type === 'range') {
        return this.getRangeDayType(day);
      }
    },
    getBottomInfo: function (type) {
      if (this.data.type === 'range') {
        if (type === 'start') {
          return '开始';
        }
        if (type === 'end') {
          return '结束';
        }
        if (type === 'start-end') {
          return '开始/结束';
        }
      }
    },
  },
});
