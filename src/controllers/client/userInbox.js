const Db = require('../../config/dbcon')

const fetchInbox=async(req,res)=>{
    const body =req.query;
    const custId=body.cust_id;
    const sqlCom=`SELECT s.*,p.pro_category FROM card_sale s WHERE s.card_order_id IN (SELECT order_id FROM user_order WHERE user_id='${custId}') 
    LEFT JOIN product p ON p.pro_id=s.pro_id
    ORDER BY s.id DESC`
    await Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er)
        res.send(re);
    })
}
const markReaded=async(req,res)=>{
    const body =req.body;
    const card_number=body.card_number;
    console.log("===>> "+card_number);
    await Db.query(`UPDATE card_sale SET mark_readed=1 WHERE card_code='${card_number}'`,(er,re)=>{
        if(er) return res.send("Error: "+er);
        res.send("Transaction completed");
    });
}
module.exports={
    fetchInbox,
    markReaded,
}