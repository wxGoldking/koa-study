const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const static = require('koa-static');
const body = require('koa-body');
const session = require('koa-session')
const mysql = require('mysql');

const app = new Koa();

const router = new Router();

let pool = mysql.createPool({
  // connectionLimit : 10, // 一次创建的最大连接数
  host: 'localhost',
  user: 'root',
  password: '123456',
  database : 'user'
});

pool.Query = function(sql, pramas){
  let self = this;
  return Promise((resolve, reject)=>{
    self.getConnection((err, conn)=>{
      if(err){
        reject(err);
      }
      conn.query(sql, pramas, (err, data)=>{
        conn.release();
        if(err){
          reject(err);
        }else{
          resolve(data)
        }
      })
    })
  })
}

app.keys=['dfgfgdgfgd','sgfgfdgfgfd']

app.use(body());
app.use(session({
  signed: true,
  maxAge: 864000000,
}, app))


router.get('/index', (ctx, next)=>{
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = `<h1>欢迎第${n}访问首页</h1>`
})


router.get('/user', (ctx, next)=>{
  ctx.body = ctx.query
})

router.post('/todo', (ctx, next)=>{
  ctx.body = ctx.request.body
})



app.use(router.routes())
app.use(static(path.join(__dirname, './static'), {
  maxage: 864000000,
  index: '1.html'
}))

app.listen(3000, ()=>{
  console.log('server is listening 3000')
})