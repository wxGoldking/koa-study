// mysql 数据库
const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql');
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

app.use(views(path.join(__dirname, './views'),{
  extension: 'ejs' //省略扩展名时，以此设置补全
}))

let pool = mysql.createPool({
  // connectionLimit : 10, // 一次创建的最大连接数
  host: 'localhost',
  user: 'root',
  password: '123456',
  database : 'user'
});

// promise封装查询方法，扩展查询完成自动释放链接
pool.Query = function (sql, pramas){
  let self = this;
  return new Promise((resolve, reject)=>{
    self.getConnection((err, conn) => {
      if(err){
        reject(err)
      }else{
        conn.query(sql, pramas, (err, data) => {
          conn.release();
          if(!err){
            resolve(data)
          }else{
            reject(err);
          }
        })
      }
    })

  })
}


app.context.db = pool;

router.get("*", async (ctx, next)=>{
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  next();
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
    const data = await ctx.db.Query('SELECT * FROM account');
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

app.listen(3000, (err) => {
  if (err){
    console.log(err);
    return;
  }
  console.log('listening on 3000 success!')
})