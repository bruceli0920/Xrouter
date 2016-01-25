app.init(function () {

  //  this.use(function (req, res, next) {
  //    next();
  //  });

  this.get('/', function (req, res, next) {

    res.id = 'index';
    res.render('header', {
      left: '',
      center: '首页列表',
      right: '<i class="header-icon iconfont icon-guanyu" onclick="app.open(\'#/about\')"></i>'
    });
    res.render('index', {
      title: '首页'
    });

    next();
  });

  this.get('/view/:id', function (req, res, next) {
    var type = '';
    switch (req.query.type) {
    case 'hot':
      type = '热门';
      break;
    case 'good':
      type = '精华';
      break;
    case 'new':
      type = '最新';
      break;
    default:
      type = '推荐'
    }
    res.id = 'view';
    res.render('header', {
      left: '<i class="header-icon iconfont icon-fanhui" onclick="app.open(\'/\')"></i>',
      center: '详情  (' + req.param.id + ')',
      right: '<i class="header-icon iconfont icon-shouye" onclick="app.open(\'/\')"></i>'
    });

    res.render('view', {
      type: type
    });

    next();
  });

  this.get('/view/:id/edit', function (req, res, next) {

  });

  this.get('/about', function (req, res, next) {
    res.id = 'about';
    res.render('header', {
      left: '<i class="header-icon iconfont icon-fanhui" onclick="app.open(\'/\')"></i>',
      center: '关于'
    });

    res.render('about');

    next();
  });

  this.error(function (req, res, next) {
    res.id = 'errors';
    res.render('header', {
      left: '<i class="header-icon iconfont icon-fanhui" onclick="app.open(\'\')"></i>',
      center: '404'
    });

    res.render('errors', {
      msg: '页面没有找到！'
    });
    next();
  });

  this.use(function (req, res, next) {

    res.render('footer', {
      content: 'Router.js 是一款轻量级的前端路由插件'
    });
    next();
  });

});