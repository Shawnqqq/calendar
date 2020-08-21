'use strict';
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('./common/component');
var utils_1 = require('./utils');
component_1.VantComponent({
  props: {
    title: {
      type: String,
      value: '',
    },
    show: {
      type: Boolean,
      observer: function (val) {
        if (val) {
          this.initRect();
          this.scrollIntoView();
        }
      },
    },
    formatter: null,
    confirmText: {
      type: String,
      value: '确定',
    },
    rangePrompt: String,
    defaultDate: {
      type: [Number, Array],
      observer: function (val) {
        this.setData({ currentDate: val });
        this.scrollIntoView();
      },
    },
    allowSameDay: Boolean,
    confirmDisabledText: String,
    type: {
      type: String,
      value: 'range',
      observer: 'reset',
    },
    minDate: {
      type: null,
      value: Date.now(),
    },
    maxDate: {
      type: null,
      value: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 6,
        new Date().getDate()
      ).getTime(),
    },
    position: {
      type: String,
      value: 'bottom',
    },
    rowHeight: {
      type: [Number, String],
      value: utils_1.ROW_HEIGHT,
    },
    round: {
      type: Boolean,
      value: true,
    },
    showMark: {
      type: Boolean,
      value: true,
    },
    showTitle: {
      type: Boolean,
      value: true,
    },
    showConfirm: {
      type: Boolean,
      value: false,
    },
    showSubtitle: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    maxRange: {
      type: [Number, String],
      value: null,
    },
  },
  data: {
    subtitle: '',
    currentDate: null,
    scrollIntoView: '',
  },
  created: function () {
    this.setData({
      currentDate: this.getInitialDate(),
    });
  },
  mounted: function () {
    this.initRect();
    this.scrollIntoView();
  },
  methods: {
    reset: function () {
      this.setData({ currentDate: this.getInitialDate() });
      this.scrollIntoView();
    },
    initRect: function () {
      var _this = this;
      if (this.contentObserver != null) {
        this.contentObserver.disconnect();
      }
      var contentObserver = this.createIntersectionObserver({
        thresholds: [0, 0.1, 0.9, 1],
        observeAll: true,
      });
      this.contentObserver = contentObserver;
      contentObserver.relativeTo('.van-calendar__body');
      contentObserver.observe('.month', function (res) {
        if (res.boundingClientRect.top <= res.relativeRect.top) {
          // @ts-ignore
          _this.setData({
            subtitle: utils_1.formatMonthTitle(res.dataset.date),
          });
        }
      });
    },
    getInitialDate: function () {
      var _a = this.data,
        type = _a.type,
        defaultDate = _a.defaultDate,
        minDate = _a.minDate;
      if (type === 'range') {
        return defaultDate || []
      }
      if (type === 'multiple') {
        return defaultDate || [minDate];
      }
      return defaultDate || minDate;
    },
    scrollIntoView: function () {
      var _this = this;
      setTimeout(function () {
        var _a = _this.data,
          currentDate = _a.currentDate,
          type = _a.type,
          minDate = _a.minDate,
          maxDate = _a.maxDate;
        var targetDate = type === 'single' ? currentDate : currentDate[0];
        if (!targetDate) {
          return;
        }
        var months = utils_1.getMonths(minDate, maxDate);
        months.some(function (month, index) {
          if (utils_1.compareMonth(month, targetDate) === 0) {
            _this.setData({ scrollIntoView: 'month' + index });
            return true;
          }
          return false;
        });
      }, 100);
    },
    onOpen: function () {
      this.$emit('open');
    },
    onOpened: function () {
      this.$emit('opened');
    },
    onClose: function () {
      this.$emit('close');
    },
    onClosed: function () {
      this.$emit('closed');
    },
    unselect: function (dateArray) {
      var date = dateArray[0];
      if (date) {
        this.$emit('unselect', utils_1.copyDates(date));
      }
    },
    select: function (date, complete) {
      if (complete && this.data.type === 'range') {
        var valid = this.checkRange(date);
        if (!valid) {
          // auto selected to max range if showConfirm
          if (this.data.showConfirm) {
            this.emit([
              date[0],
              utils_1.getDayByOffset(date[0], this.data.maxRange - 1),
            ]);
          } else {
            this.emit(date);
          }
          return;
        }
      }
      this.emit(date);
      if (complete && !this.data.showConfirm) {
        this.onConfirm();
      }
    },
    emit: function (date) {
      var getTime = function (date) {
        return date instanceof Date ? date.getTime() : date;
      };
      this.setData({
        currentDate: Array.isArray(date) ? date.map(getTime) : getTime(date),
      });
      this.$emit('select', utils_1.copyDates(date));
    },
    checkRange: function (date) {
      var _a = this.data,
        maxRange = _a.maxRange,
        rangePrompt = _a.rangePrompt;
      if (maxRange && utils_1.calcDateNum(date) > maxRange) {
        return false;
      }
      return true;
    },
    onConfirm: function () {
      var _this = this;
      if (
        this.data.type === 'range' &&
        !this.checkRange(this.data.currentDate)
      ) {
        return;
      }
      wx.nextTick(function () {
        _this.$emit('confirm', utils_1.copyDates(_this.data.currentDate));
      });
    },
  },
});
