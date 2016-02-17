# Xrouter
原生js开发的轻量级路由插件

NodeJS前端分享群 133240225


方法使用说明：
var app = new Xroute();


 * 指定路由执行方法
 * @param {string} name     路由匹配规则，如果参数是方法，则是路由不存在时执行的
 * @param {function} callback 回调函数

app.get('#/index', function (req, res, next) {
  //例如地址为:index.html#/index 时会执行该方法
  next(); //执行下一个方法
});

app.get(function () {
  //路由地址不存在时调用改方法
});


 * 所有的路由执行方法
 * @param {function} callback 执行的回调方法

app.all(function () {
  next(); //执行下一个方法
});


 * 匹配路由规则，执行对应的路由方法

app.hashchange();


 * 监听路由改变自动匹配路由规则，执行符合路由规则的方法
 * @param {boolean} true=马上初始化，false不马上初始化

app.start();
