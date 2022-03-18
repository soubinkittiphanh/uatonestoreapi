const mysql=require("mysql");
const env= require("../config");
console.log('====>');
console.log(env);
const db=mysql.createConnection({
    host:env.db.host,
    user:env.db.user,
    password:env.db.password,
    database:env.db.database,
    port:env.db.port,
    multipleStatements:true,

});


module.exports=db;