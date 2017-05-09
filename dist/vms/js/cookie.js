/**
 * Created by frank on 2017/5/8.
 * 操作cookie的一些方法
 */
;(function (w) {
  var cookie_api = {}
  // 设置cookie
  var setCookie = function (name, value, exp_hours) {
    var exp = new Date();
    exp.setTime(exp.getTime() + exp_hours * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURI(value) + ";path=/vms;expires=" + exp.toGMTString();
  }

  // 读取cookie
  var getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return decodeURI(arr[2]);
    else
      return null;
  }

  // 删除cookie
  var delCookie = function (name) {
    var exp = new Date();
    //过期设置
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";path=/vms;expires=" + exp.toGMTString();
  }
  cookie_api = {
    setCookie: setCookie,
    getCookie: getCookie,
    delCookie: delCookie
  }
  w.cookie_api = cookie_api
})(window)