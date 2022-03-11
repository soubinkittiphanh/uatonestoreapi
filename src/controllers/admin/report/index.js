const Db=require("../../../config/dbcon");

const txnReport=async(req,res)=>{

    const {fromDate,toDate,userId}=req.body;
    console.log("fdate: "+fromDate+" todate: "+toDate+" userid: "+userId);
    const sqlCom=`SELECT * FROM transaction_history WHERE txn_his_date BETWEEN '${fromDate}' AND '${toDate}' AND txn_his_inputter='${userId}'`
    console.log("SQL: "+sqlCom);
    Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er);
        res.send(re);
    })

}

module.exports={
    txnReport,
}