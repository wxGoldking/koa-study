// hellow world
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = '<h1>hello world!<h1>'
})

app.listen(3000, (err) => { 
  if (err){
    console.log(err);
    return;
  }
  console.log('listening on 3000 success!') 
})