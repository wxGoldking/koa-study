const Router = require('koa-router');

const router = new Router();

router.get('/', async ctx => {
    ctx.body = '<h1>Hello Router</h1>';
})
.get('/todo', async ctx => {
    ctx.body = '<h1>Todo</h1>';
});

module.exports =  router;