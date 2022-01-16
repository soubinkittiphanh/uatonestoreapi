const Db = require('../../config/dbcon');

const fetchWaletTxnCRnDR = async (req, res) => {
    console.log("************* FETCH WALLET TXN *****************");
    console.log(`*************Payload: ${req.query.user_id} *****************`);
    const userId = req.query.user_id;
    const sqlCom=`SELECT h.txn_his_id,c.txn_sign,c.txn_code_name,h.txn_his_amount,h.txn_his_date FROM transaction_history h LEFT JOIN transaction t ON t.txn_id=h.txn_id LEFT JOIN transaction_code c ON c.txn_code_id=t.txn_code WHERE h.user_id='${userId}' `
    await Db.query(sqlCom, (er, re) => {
        if (er) {
            console.log("Error:  ");
            return res.send("Error: " + er.message);
        }
        console.log("Transaction completed");
        res.send(re);
    })
}

module.exports={
    fetchWaletTxnCRnDR,
}