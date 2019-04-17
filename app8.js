// mysql 数据库
const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql');
const body = require('koa-body'); // 用来解析post参数
const co = require('co-mysql'); //将mysql的回调模式Promise化，改造为async/await模式
const path = require('path');
const static = require('koa-static');

const app = new Koa();
const router = new Router();

app.use(body());

let connections = mysql.createPool({
  // connectionLimit : 10, // 用createPool时默认一次建立10条连接的连接池
  host: 'localhost',
  user: 'root',
  password: '123456',
  database : 'ceshi'
});
 
let db = co(connections);

app.context.db = db


router.get('/api/users', async (ctx)=>{
  try {
    const result = await ctx.db.query('SELECT * FROM user');
    ctx.body = result;
  }catch(e){
    ctx.throw(500, 'database error')
  }
})
router.post('/api/register', async (ctx)=>{
  const { name, password } = ctx.request.body;
  try {
    const data = await ctx.db.query(`SELECT ID, password FROM user WHERE userName='${name}'`);
    if(data.length){
      ctx.body = { code: 1, msg: '用户名已被占用'};
      return;
    }
    await ctx.db.query(`INSERT INTO user (userName, password) VALUES('${name}', '${password}')`);
    ctx.body = {code: 0, msg: '注册成功'};
  }catch(e){
    console.log(e);
    ctx.throw(500, 'database error')
  }
})
router.post('/api/login', async (ctx)=>{
  const { name, password } = ctx.request.body;
  try {
    const data = await ctx.db.query(`SELECT ID, password FROM user WHERE userName='${name}'`);
    if(!data.length){
      ctx.body = { code: 1, msg: '用户不存在'};
      return;
    }
    if(data[0].password !== password){
      ctx.body = { code: 1, msg: '用户名或密码错误'};
      return;
    }
    ctx.body = {code: 0, msg: '登录成功'};
  }catch(e){
    console.log(e);
    ctx.throw(500, 'database error')
  }
})

// app.use(async (ctx)=>{
// })





app.use(router.routes()).use(router.allowedMethods());
app.use(static(path.join(__dirname, './static'), {
  maxage: 864000 * 1000,
  index: '1.html'
}));

app.listen(3000, (err) => {
  if (err){
    console.log(err);
    return;
  }
  console.log('listening on 3000 success!')
})