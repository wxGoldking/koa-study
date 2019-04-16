// get、post 参数获取

const Koa = require('koa');
const fs = require('fs');
const Router = require('koa-router');
const path = require('path');
const static = require('koa-static');
const body = require('koa-body'); // 用来解析post参数

const app = new Koa();
const router = new Router();

app.use(body({
  multipart:true, // 支持文件上传
  // encoding:'gzip',
  formidable:{
    // uploadDir:path.join(__dirname,'./upload/'), // 设置文件上传目录(统一设置上传)
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 20 * 1024 * 1024, // 文件上传大小
    // onFileBegin:(name,file) => { // 文件上传前的设置
    //   console.log(`name: ${name}`);
    //   console.log(file);
    // },
  }
}));

// 一个捕捉错误的中间件
app.use(async (ctx, next) => {
  try{
    await next();
  }catch(err){
    console.log(err);
    ctx.throw(500)
  }
})

// // get-params
// router.get('/:hello/:name', async ctx => {
//   const { hello, name } = ctx.params;
//   ctx.body = `<h1>${hello}, ${name}</h1>`
// })

// get-urlencoded
router.get('/', async ctx => {
  ctx.body = ctx.query;
})

// post
router.post('/todo', async ctx => {
  console.log(ctx.request.body)
  ctx.body = ctx.request.body;
})

// 文件上传处理， 可单独设置保存路径，文件名
router.post('/upload', async (ctx)=>{
  // 上传
  let files = ctx.request.files.files; // 获取上传文件
  !Array.isArray(files) && (files = [files]) // 多文件时为数组，统一做多文件处理
  let result = [];
  for (let file of files) {
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 文件写入路径
    let newFilename = `${Math.floor(Math.random()*9999999999)}_${file.name}`;
    let filePath = path.join(__dirname, './static/upload/') + `/${newFilename}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    result.push('http://' + ctx.headers.host + '/upload/' + newFilename)
  }
  ctx.body = { code: 200, data: result };
});


app.use(router.routes()).use(router.allowedMethods());
app.use(static(path.join(__dirname, './static')));

app.listen(3000, (err) => { 
  if (err){
    console.log(err);
    return;
  }
  console.log('listening on 3000 success!') 
})