const Db=require("../../../config/dbcon");

const txnReport=async(req,res)=>{

    const {fromDate,toDate,userId}=req.body;
    // SELECT t.*,c.txn_name FROM transaction_history t 
    // LEFT JOIN transaction c ON c.txn_id=t.txn_id
    // WHERE t.txn_his_date BETWEEN '2022-01-01 00:00:00' AND '2022-03-01 00:00:00' AND t.txn_his_inputter='1002'

    console.log("fdate: "+fromDate+" todate: "+toDate+" userid: "+userId);
    const sqlCom=`SELECT t.*,c.txn_name FROM transaction_history t LEFT JOIN transaction c ON c.txn_id=t.txn_id WHERE t.txn_his_date BETWEEN '${fromDate}' AND '${toDate}' AND t.txn_his_inputter='${userId}'`
    console.log("SQL: "+sqlCom);
    Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er);
        res.send(re);
    })

}

module.exports={
    txnReport,
}