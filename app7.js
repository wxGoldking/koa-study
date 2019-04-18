// cookie session
const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const path = require('path');
const static = require('koa-static');

const app = new Koa();
const router = new Router();

app.keys = ['afsdfsf', 'dsgfdsgfd', 'sgsfggtergff']; // 循环秘钥 为cookie和session加密签名使用


// session
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //自动续期,
};
app.use(session(CONFIG, app));



app.use((ctx, next)=> {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  next();
});

// cookie
router.get('/', async ctx => {
  let userName = ctx.cookies.get('name', {signed: true});
  if(!userName){
    userName = `user_${Math.floor(Math.random()*9999999999999)}`;
    ctx.cookies.set('name', userName , {
      maxAge: 86400000,    // 一个数字表示从 Date.now() 得到的毫秒数(与expires同时设置maxAge生效)
      expires: new Date(new Date() - 0 + 86400000), // 过期的 Date
      // path: '/', // 路径, 默认是'/'
      // domain: '127.0.0.1', // 域名
      signed: true,  //签名默认true 设置为true时，getcookie时也要设置{signed: true}，且此时客户端随意修改会导致cookie失效
      secure: false, // 安全 cookie   默认false，设置成true表示只有 https可以访问
      httpOnly: false, // 是否只是服务器可访问 cookie, 默认是 true
      // overwrite: false // 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false) ---未发现区别，都可以覆盖
    })
  }
  ctx.body = `Hello ${userName} 第${ctx.session.views}次访问`;
})



app.use(router.routes()).use(router.allowedMethods());
app.use(static(path.join(__dirname, './static'), {
  maxage: 864000 * 1000,
  index: '1.html'
})); // 放在最后表示先匹配路由，放在最前表示先匹配静态资源

app.listen(3000, () => { 
  console.log('listening on 3000 success!') 
})