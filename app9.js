// mysql 数据库
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const path = require('path');
const session = require('koa-session');

const app = new Koa();
const router = new Router();

app.keys = ['dfsdfsdf', 'dfgffggggggg', '234dfg34554@#$%#']


app.use(session({
  maxAge: 86400000,
  signed:true,
}, app))

app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.context.db = require('./db');

router.get("*", async (ctx, next)=>{
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  await next();
})

router.get('/', async (ctx)=>{
  // await 不能省,ctx.state的数据可以在ejs中获取到
  ctx.state = {
    count: 1
  }
  await ctx.render('index', {
    title: '首页',
    views: ctx.session.views
  })
})


router.get('/user', async (ctx)=>{
  try {
    const data = await ctx.db._query('SELECT * FROM account');
    await ctx.render('user', {
      title: 'user',
      userList: data
    })
  } catch (error) {
    console.warn(error)
    ctx.throw(500)
  }
})


app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('listening on 3000 success!')
})