const Db = require('../../config/dbcon')

const createCustomer=async(req,res)=>{
    const body=req.body;
    const cus_name=body.cust_name;
    const cus_pass=body.cust_pass;
    const cus_phone=body.cust_phone;
    const cus_email=body.cust_email;
    const cus_gameId=body.cust_gameId;
    const login_id=cus_email===''?cus_phone:cus_email;

    console.log("...Register customer...");
    console.log("Info data: "+body);
    const sqlCom =`INSERT INTO customer(cus_id, cus_pass, cus_name, cus_tel, cus_email, cus_active,login_id) VALUES ((SELECT IFNULL(MAX(c.cus_id),1000)+1 FROM customer c),'${cus_pass}','${cus_name}','${cus_phone}','${cus_email}',1,'${login_id}')`
    await Db.query(sqlCom,(er,re)=>{
        if(er)return res.send("Error: "+er);
        res.send("Transaction completed");
    })

}

module.exports={
    createCustomer,
}