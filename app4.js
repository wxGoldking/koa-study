// get、post 参数获取

const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const static = require('koa-static');
const body = require('koa-body'); // 用来解析post参数

const app = new Koa();
const router = new Router();

app.use(body());

// 一个捕捉错误的中间件
app.use(async (ctx, next) => {
  try{
    await next();
  }catch(err){
    console.log(err);
    ctx.throw(500)
  }
})

// get-params
router.get('/:hello/:name', async ctx => {
  const { hello, name } = ctx.params;
  ctx.body = `<h1>${hello}, ${name}</h1>`
})

// get-urlencoded
router.get('/', async ctx => {
  ctx.body = ctx.query;
})

// post
router.post('/todo', async ctx => {
  console.log(ctx.request.body)
  ctx.body = ctx.request.body;
})


app.use(router.routes()).use(router.allowedMethods());
app.use(static(path.join(__dirname, './static')));

app.listen(3000, () => { 
  console.log('listening on 3000 success!') 
})