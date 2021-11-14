const Db = require('../../config/dbcon');

const updateUserName=(req,res)=>{
    console.log(req.body);
    const body=req.body
    const userId=body.user_id;
    const userName=body.user_name;
    Db.query(`UPDATE CUSTOMER SET cus_name='${userName}' WHERE cus_id='${userId}'`,(er,re)=>{
        if(er)return res.send("Error: "+er.message);
        res.send("Transaction completed");
    })
}
const updateTel=(req,res)=>{
    console.log(req.body);
    const body=req.body
    const userId=body.user_id;
    const userPhoneNumber=body.user_phone;
    Db.query(`UPDATE CUSTOMER SET cus_tel='${userPhoneNumber}' WHERE cus_id='${userId}'`,(er,re)=>{
        if(er)return res.send("Error: "+er.message);
        res.send("Transaction completed");
    })
}
const updateEmail=(req,res)=>{
    console.log(req.body);
    const body=req.body
    const userId=body.user_id;
    const userEmail=body.user_email;
    Db.query(`UPDATE CUSTOMER SET cus_email='${userEmail}' WHERE cus_id='${userId}'`,(er,re)=>{
        if(er)return res.send("Error: "+er.message);
        res.send("Transaction completed");
    })
}
const updatePassword=(req,res)=>{
    console.log(req.body);
    const body=req.body
    const userId=body.user_id;
    const userPass=body.user_password;
    Db.query(`UPDATE CUSTOMER SET cus_pass='${userPass}' WHERE cus_id='${userId}'`,(er,re)=>{
        if(er)return res.send("Error: "+er.message);
        res.send("Transaction completed");
    })
}
module.exports={
    updateUserName,
    updateTel,
    updateEmail,
    updatePassword,
}