const Db = require('../../config/dbcon')

const fetchInbox=async(req,res)=>{
    const body =req.query;
    const custId=body.cust_id;
    const sqlCom=`SELECT s.* FROM card_sale s WHERE s.card_order_id IN (SELECT order_id FROM user_order WHERE user_id='${custId}')`
    await Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er)
        res.send(re);
    })
}

module.exports={
    fetchInbox,
}