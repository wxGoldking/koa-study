// 静态资源
const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const static = require('koa-static');

const app = new Koa();
const router = new Router();

// router.get('/', async ctx => {
//   ctx.body = 'Hello Router';
// })

router.get('/todo', async ctx => {
  ctx.body = 'Todo';
})
app.use(router.routes()).use(router.allowedMethods());


app.use(static(path.join(__dirname, './static'), {
  maxage: 864000 * 1000,
  index: '1.html'
})); // 放在最后表示先匹配路由，放在最前表示先匹配静态资源


app.listen(3000, (err) => { 
  if (err){
    console.log(err);
    return;
  }
  console.log('listening on 3000 success!') 
})