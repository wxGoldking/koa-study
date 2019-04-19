const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const rp = require('request-promise');
const views = require('koa-views');

const app = new Koa();

const router = new Router();

app.context.rp = rp;

app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))



router.get('/list', async (ctx, next)=>{
  let {flag, id} = ctx.query, pramas = '';
  if(flag && id) pramas = `&flag=${flag}&id=${id}`

  console.log(pramas);
  try {
    let result = await ctx.rp(`https://api.jinse.com/v4/live/list?reading=false&_source=m&limit=20${pramas}`);
    const data = JSON.parse(result);
    await ctx.render('list', {
      list: data.list,
      top_id: data.top_id,
      bottom_id: data.bottom_id,
    })
  } catch (error) {
    console.log(error);
    ctx.throw(500)
  }
})

app.use(router.routes())

app.listen(3000, ()=>{
  console.log('server is listening 3000')
})