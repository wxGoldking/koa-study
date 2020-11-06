// 路由
const Koa = require('koa');
const router = require('./router');

const app = new Koa();
app.use(router.routes()).use(router.allowedMethods()); // use(router.allowedMethods()) 会在接口地址正确，请求方法错误时返回Method Not Allowed 405

app.listen(3000, () => {
  console.log('listening on 3000 success!')
})