const Db = require('../../config/dbcon')

const createChatType=async(req,res)=>{
    const body =req.body;
    
    const chat_type_code=body.chat_type_code;
    const chat_type_name=body.chat_type_name;
    const chat_type_remart=body.chat_type_remart;
    console.log("************* CREATE CHAT TYPE *****************");
    console.log(`*************Payload: ${body.cust_id} *****************`);
    const custId=body.cust_id;
    const sqlCom=`INSERT INTO chat_type( code, name, remark) VALUES ('${chat_type_code}','${chat_type_name}','${chat_type_remart}')`
    await Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er)
        res.send(re);
    })
}
const updateChatType=async(req,res)=>{
    const body =req.body;
    const chat_type_id=body.chat_type_id;
    const chat_type_code=body.chat_type_code;
    const chat_type_name=body.chat_type_name;
    const chat_type_remart=body.chat_type_remart;
    console.log("************* UPDATE CHAT TYPE *****************");
    console.log(`*************Payload: ${body.chat_type_id} *****************`);
    
    const sqlCom=`UPDATE chat_type SET  name='${chat_type_name}', remark='${chat_type_remart}',code='${chat_type_code}' WHERE id=code='${chat_type_id}'`
    
    await Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er);
        res.send("Transaction completed");
    });
}
const fetchChatType=async(req,res)=>{
    
    console.log("************* FETCH CHAT TYPE *****************");
    console.log(`*************Payload: ${body.chat_type_id} *****************`);
    const sqlCom=`SELECT * FROM chat_type`
    await Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er);
        res.send(re);
    });
}
module.exports={
    createChatType,
    updateChatType,
    fetchChatType,
}