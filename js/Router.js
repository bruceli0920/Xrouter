/**
 * 作者：狼族小狈
 * QQ群：133240225
 * 使用原生js简单的实现路由功能
 */
/**
 * 构建路由对象
 */
function Router(selector) {
  this.viewBox = document.querySelector(selector); //控制器总盒子
  this.viewList = []; //页面列表
  this.curView = null; //当前显示的页面
  this.template = {}; //存储html模板文件
  this.controller = []; //存储路由和方法  
};
/**
 * 路由初始化方法
 * @param {function} callback 初始化一些
 */
Router.prototype.init = function (callback) {
  callback.bind(this)();
  this.change();
  window.addEventListener('hashchange', function () {
    this.change();
  }.bind(this), false);
};
/**
 * url改变触发方法
 */
Router.prototype.change = function () {
  var _this = this;
  var aUrl = location.hash.split('?');
  _this.notFound = false;

  //创建新的对象
  var app = {
    pathName: aUrl[0],
    search: aUrl[1] || null,
    hash: null,
    notFound: true, //true 页面不存在，404错误，false 页面存在
    queue: [], //路由函数执行列表
    req: { //url相关的参数信息
      query: {},
      param: {}
    },
    res: {
      /**
       * 编译模板文件
       * @param {string} name 模板文件的名称
       * @param {object} data 给模板传递的参数
       */
      render: function (name, data) {
        app.res.html.push(_this.template[name](data)); //存储模板文件
      },
      id: '',
      html: [],
      renIndex: 0
    },
    /**
     * 初始化执行方法入口
     */
    init: function () {
      app.hash = app.pathName.split('/');
      app.req.query = app.getQuery();

      app.getControllerList();

      if (app.queue.length > 0) {
        app.renControllerList();
      }
    },
    /**
     * 获取当前路由的controller列表
     */
    getControllerList: function () {

      var iCount = _this.controller.length;

      for (var i = 0; i < iCount; i++) {
        if (app.test(_this.controller[i])) {
          //存在的页面
          var param = app.getParam(_this.controller[i].router);

          for (var key in param) {
            app.req.param[key] = param[key];
          }

          app.queue.push(_this.controller[i]);
        } else if (_this.controller[i].router == undefined) {
          //404
          app.queue.push(_this.controller[i]);
        }
      }
    },
    /**
     * 运行controller方法
     */
    renControllerList: function () {
      var i = app.res.renIndex;

      if (!Boolean(app.queue[i])) {
        app.createView();
        return;
      }

      app.res.renIndex++;
      var router = app.queue[i].router;
      var callback = app.queue[i].callback;
      if (typeof (router) == 'string') { //路由存在

        callback.call(_this, app.req, app.res, app.next);
      } else if (router == undefined && app.notFound) {

        callback.call(_this, app.req, app.res, app.next);
      } else {
        app.next();
      }
    },
    /**
     * 执行下一个控制器
     */
    next: function () {
      app.renControllerList(app.res.renIndex);
    },
    /**
     * 创建页面
     */
    createView: function () {
      var curView = _this.viewBox.querySelector('[data-controller="' + app.res.id + '"]');
      if (!curView) {
        curView = document.createElement('div');
        curView.dataset.controller = app.res.id;
      }
      curView.innerHTML = app.res.html.join('');
      _this.viewBox.appendChild(curView);
      _this.curView = curView;
      _this.show();
    },
    /**
     * 匹配当前路由是否存在对应的控制方法
     * @param   {object}  controller 要检测的路由
     * @returns {boolean} true为存在，false不存在
     */
    test: function (controller) {
      var router = controller.router;
      var callback = controller.callback;

      if (typeof (router) != 'string') {
        return false;
      }

      //通配符匹配模式
      var bAll = Boolean(router == '*');

      //正则匹配模式
      var sRe = '';
      sRe = router.replace(/\/:\w[^\/]+/g, '\/([^\/]+)');
      sRe = sRe.replace(/\//g, '\\/');
      sRe = '^#' + sRe + '$';
      var bRe = Boolean(new RegExp(sRe).test(app.pathName));

      //首页单独匹配模式
      var bIndex = Boolean(app.pathName == '' && router == '/');

      if (bRe || bIndex) {
        app.notFound = false;
      }

      return Boolean(bAll || bRe || bIndex);
    },
    /**
     * 获取url对应的参数
     * @param   {string}   router 路由地址
     * @returns {object} 返回对应的url参数
     */
    getParam: function (router) {
      var param = {};
      var aRouter = router.split('/');

      for (var j = 0; j < aRouter.length; j++) {

        if (/^:\w[\w\d]*$/.test(aRouter[j])) {
          param[aRouter[j].replace(/^:/, '')] = app.hash[j];
        }
      }

      return param;
    },
    /**
     * 获取url对应的参数
     * @returns {object} 返回对应的url参数
     */
    getQuery: function () {
      var query = {};

      if (typeof (app.search) != 'string') {
        return query;
      }

      var arr = app.search.split('&');

      for (var i = 0; i < arr.length; i++) {
        var aQuery = arr[i].split('=');
        query[aQuery[0]] = aQuery[1] || null;
      }
      return query;
    }
  };

  app.init();
};
/**
 * 前端路由模拟get请求
 * @param {string} router   路由匹配规则
 * @param {function} callback 路由匹配成功后执行方法
 */
Router.prototype.get = function (router, callback) {
  var data = {
    router: router,
    callback: callback
  };
  this.controller.push(data);
};
/**
 * 路由中间件
 * @param {function} callback 执行是方法
 */
Router.prototype.use = function (callback) {

  var data = {
    router: '*',
    callback: callback
  };

  this.controller.push(data);
};
/**
 * 404错误，页面不存在时执行
 * @param {function} callback 404错误时执行方法
 */
Router.prototype.error = function (callback) {
  var data = {
    router: undefined,
    callback: callback
  };

  this.controller.push(data);
};
/**
 * 跳转新页面
 * @param {string} url 跳转的url地址
 */
Router.prototype.open = function (url) {
  this.curView = null;
  location.hash = url;
  this.show();
};
/**
 * 显示指定页面
 * @param {object} id 要显示的页面
 */
Router.prototype.show = function (id) {
  var all = this.viewBox.childNodes;

  for (var i = 0; i < all.length; i++) {
    all[i].style.display = 'none';
  }

  if (typeof (id) == 'string') {
    this.viewBox.querySelector('[data-controller="' + id + '"]').style.display = 'block';
  } else if (typeof (id) == 'object') {
    id.style.disable = 'block';
  } else if (this.curView) {
    this.curView.style.display = 'block';
  }
};
/**
 * 设置模板文件
 * @param {object} data 要设置的模板
 */
Router.prototype.setTemplate = function (data) {
  for (var key in data) {
    this.template[key] = data[key];
  }
};