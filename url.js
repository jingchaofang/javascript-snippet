/**
 * 获取地址参数值
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
function getParam(param) {
  var url = location.search.replace('?', '');
  if (url === '') {
    return null;
  }
  var arr = url.split('&');
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].split('=')[0] == param) {
      return arr[i].split('=')[1];
    }
  }
  return null;
}

/**
 * 防抖函数 https://github.com/jashkenas/underscore/blob/master/underscore.js
 * @param  {function} func     需要防抖的函数
 * @param  {number} wait       触发等待的时间
 * @param  {boolean} immediate 连续事件到来，尽量立即触发
 * @return {function}          返回加入防抖的函数
 * @demo debounce(func, wait, false)
 */
var debounce = function(func, wait, immediate) {
  var timeout;

  return function() {
    var args = arguments;
    var self = this;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null
      }, wait);
      if (callNow) func.apply(self, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(self, args);
      }, wait);
    }
  };

};

/**
 * 节流函数，http://underscorejs.org/#throttle，有删减
 * @author 掌阅-书城研发-前端组
 * @param {function} func, 需要节流的函数
 * @param {number} wait, 节流间隔时间，单位ms
 * @param {object} options，默认首次执行, false禁用首次执行
 * @demo throttle(func, opts.time)
 *       throttle(func, opts.time, {leading: false})
 */
var throttle = function(func, wait, options) {

  var context, args, result = null;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
