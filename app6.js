// 开启gzip

const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const compress = require('koa-compress');

const app = new Koa();

const options = {
  // filter: function (content_type) {
  // 	return /text/i.test(content_type)
  // }, // 只压缩text
  threshold: 20 * 1024, // 要求文件大于20K
};
app.use(compress(options))

app.use(static(path.join(__dirname, './static'), {
  maxage: 864000 * 1000,
  index: '1.html'
}))

app.listen(3000, () => { 
  console.log('listening on 3000 success!') 
})