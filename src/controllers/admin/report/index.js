const Db=require("../../../config/dbcon");

const txnReport=async(req,res)=>{
    console.log("**************** REPORT **************");
    console.log( "*************Payload: NONE *****************");
    const {fromDate,toDate}=req.query;
    const userId = req.query.userId
    let extraCondition;
    if (userId.includes(null)||userId=='') {
        extraCondition=''
    } else {
        extraCondition = ` AND t.txn_his_inputter=${userId}`
    }
    console.log("fdate: "+fromDate+" todate: "+toDate+" userid: "+userId);
    const sqlCom=`SELECT t.*,c.txn_name FROM transaction_history t LEFT JOIN transaction c ON c.txn_id=t.txn_id WHERE t.txn_his_date BETWEEN '${fromDate}' AND '${toDate}' ${extraCondition} ORDER BY t.txn.his.date DESC`
    console.log("SQL: "+sqlCom);
    Db.query(sqlCom,(er,re)=>{
        if(er) return res.send("Error: "+er);
        res.send(re);
    })

}

module.exports={
    txnReport,
}