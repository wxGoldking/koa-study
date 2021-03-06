// mysql 数据库
const Koa = require('koa');
const Router = require('koa-router');
const body = require('koa-body'); // 用来解析post参数
const path = require('path');
const static = require('koa-static');
const db = require('./db');

const app = new Koa();
const router = new Router();

app.use(body());

app.context.db = db;

// 一个捕捉错误的中间件
app.use(async (ctx, next) => {
  try{
    await next();
  }catch(err){
    console.log(err);
    ctx.throw(500, 'database error')
  }
})

async function verify(name, password, ctx){
  try {
    const data = await ctx.db._query('SELECT ID, password FROM account WHERE userName=?', [name]);
    if(!data.length){
      ctx.body = { code: 1, msg: '用户不存在'};
      return false;
    }
    if(data[0].password !== password){
      ctx.body = { code: 1, msg: '密码错误'};
      return false;
    }
    return data;
  }catch(e){
    console.log(e);
    ctx.throw(500, 'database error')
  }
}


router.get('/api/users', async (ctx)=>{
  // try {
    const result = await ctx.db._query('SELECT * FROM account');
    ctx.body = result;
  // }catch(e){
  //   ctx.throw(500, 'database error')
  // }
})

// 增
router.post('/api/register', async (ctx)=>{
  const { name, password } = ctx.request.body;
  try {
    const data = await ctx.db._query('SELECT ID, password FROM account WHERE userName=?', [name]); // ?占位符防止sql注入
    if(data.length){
      ctx.body = { code: 1, msg: '用户名已被占用'};
      return;
    }
    await ctx.db._query('INSERT INTO account (userName, password) VALUES(?, ?)', [name, password]);
    ctx.body = {code: 0, msg: '注册成功'};
  }catch(e){
    console.log(e);
    ctx.throw(500, 'database error')
  }
})

// 查
router.post('/api/login', async (ctx)=>{
  const { name, password } = ctx.request.body;
  let result = await verify(name, password, ctx);
  if(result) ctx.body = {code: 0, msg: '登录成功'};
})


// 删
router.post('/api/destory', async (ctx)=>{
  const { name, password } = ctx.request.body;
  let result = await verify(name, password, ctx);
  if(result){
    try {
      await ctx.db._query('DELETE FROM account WHERE ID=?', [result[0].ID]);
      ctx.body = {code: 0, msg: '注销成功'};
    }catch(e){
      console.log(e);
      ctx.throw(500, 'database error')
    }

  };
})


// 改
router.post('/api/update', async (ctx)=>{
  const { name, password, newpass } = ctx.request.body;
  let result = await verify(name, password, ctx);
  if(result){
    try {
      await ctx.db._query('UPDATE account SET password=? WHERE ID=?', [newpass, result[0].ID]);
      ctx.body = {code: 0, msg: '修改成功'};
    } catch (error) {
      ctx.throw(500, 'database error')
    }
  };
})


app.use(router.routes()).use(router.allowedMethods());
app.use(static(path.join(__dirname, './static'), {
  maxage: 864000 * 1000,
  index: '1.html'
}));

app.listen(3000, () => { 
  console.log('listening on 3000 success!') 
})