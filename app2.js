// 路由
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', async ctx => {
  ctx.body = 'Hello Router';
})

router.get('/todo', async ctx => {
  ctx.body = 'Todo';
})
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, (err) => { 
  if (err){
    console.log(err);
    return;
  }
  console.log('listening on 3000 success!') 
})