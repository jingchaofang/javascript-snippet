/**
 * 类es6 rest剩余参数的实现,使某个函数具备支持rest剩余参数的能力
 * @param {function} func     需要rest参数的函数
 * @param {number} startIndex 从哪里开始标识rest参数, 如果不传递, 默认最后一个参数为rest参数
 * @returns {function}        返回一个具有rest剩余参数的函数
 */
var _restArgs = function(func, startIndex) {
    // rest参数从哪里开始,如果没有,则默认视函数最后一个参数为rest参数
    // 注意, 函数对象的length属性, 揭示了函数的参数个数
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    // 返回一个支持rest参数的函数
    return function() {
        // 校正参数, 以免出现负值情况
        var length = Math.max(arguments.length - startIndex, 0);
        // 为rest参数开辟数组存放
        var rest = Array(length);
        var index = 0;
        // 假设参数从2个开始: func(a,b,*rest)
        // 调用: func(1,2,3,4,5); 实际的调用是:func.call(this, 1,2, [3,4,5]);
        for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        // 根据rest参数不同, 分情况调用函数, 需要注意的是, rest参数总是最后一个参数, 否则会有歧义
        switch (startIndex) {
            case 0:
                return func.call(this, rest);
            case 1:
                return func.call(this, arguments[0], rest);
            case 2:
                return func.call(this, arguments[0], arguments[1], rest);
        }
        // 如果不是上面三种情况, 而是更通用的(应该是作者写着写着发现这个switch case可能越写越长, 就用了apply)
        var args = Array(startIndex + 1);
        // 先拿到前面参数
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        // 拼接上剩余参数
        args[startIndex] = rest;
        return func.apply(this, args);
    };
};
/**
 * 延迟执行函数
 * @param  {function} func   需要延迟执行的函数
 * @param  {number} wait     延迟执行的时间
 * @param  {[type]} args     延迟执行函数的实参
 * @return {function}        返回延迟执行的包装函数  
 * @demo delay(foo, 1000, d, e, f); 相当于setTimeout(function() {foo(d, e, f);}, 1000);   
 */
var _delay = _restArgs(function(func, wait, args) {
    return setTimeout(function() {
        return func.apply(null, args);
    }, wait);
});
/**
 * 防抖函数 https://github.com/jashkenas/underscore/blob/master/underscore.js
 * @param  {function} func    需要防抖的函数
 * @param  {number} wait      触发等待的时间
 * @param  {boolen} immediate 连续事件触发后立即触发（此时会忽略wait参数）
 * @return {function}         返回加入防抖的函数
 * @demo debounce(func, wait, false)
 */
var debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
    };

    var debounced = _restArgs(function(args) {
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(this, args);
        } else {
            timeout = _delay(later, wait, this, args);
        }

        return result;
    });

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
};