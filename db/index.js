const mysql = require('mysql');

let pool = mysql.createPool({
  // connectionLimit : 10, // 一次创建的最大连接数
  host: 'localhost',
  user: 'root',
  password: '123456',
  database : 'user'
});

// promise封装查询方法，扩展查询完成自动释放链接
pool._query = function (sql, pramas){
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

module.exports = pool;