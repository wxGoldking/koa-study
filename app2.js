// 路由
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', async ctx => {
  ctx.body = 'Hello Router';
})

router.post('/todo', async ctx => {
  ctx.body = 'Todo';
})
app.use(router.routes()).use(router.allowedMethods()); // use(router.allowedMethods()) 会在接口地址正确，请求方法错误时返回Method Not Allowed

app.listen(3000, () => { 
  console.log('listening on 3000 success!') 
})