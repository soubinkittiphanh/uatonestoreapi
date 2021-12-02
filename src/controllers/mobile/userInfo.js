const Db = require('../../config/dbcon');

const updateUserName = async (req, res) => {
    console.log("update user name=====>");
    console.log(req.body);
    const body = req.body
    const userId = body.user_id;
    const userName = body.user_name;
    await Db.query(`UPDATE customer SET cus_name='${userName}' WHERE cus_id='${userId}'`, (er, re) => {
        if (er) {
            console.log("Error:  ");
            return res.send("Error: " + er.message);
        }
        console.log("Transaction completed");
        res.send("Transaction completed");
    })
}
const updateTel = async (req, res) => {
    console.log(req.body);
    const body = req.body
    const userId = body.user_id;
    const userPhoneNumber = body.user_phone;
    await Db.query(`UPDATE customer SET cus_tel='${userPhoneNumber}' WHERE cus_id='${userId}'`, (er, re) => {
        if (er) return res.send("Error: " + er.message);
        res.send("Transaction completed");
    })
}
const updateEmail = async (req, res) => {
    console.log(req.body);
    const body = req.body
    const userId = body.user_id;
    const userEmail = body.user_email;
    await Db.query(`UPDATE customer SET cus_email='${userEmail}' WHERE cus_id='${userId}'`, (er, re) => {
        if (er) return res.send("Error: " + er.message);
        res.send("Transaction completed");
    })
}
const updatePassword = async (req, res) => {
    console.log(req.body);
    const body = req.body
    const userId = body.user_id;
    const userPass = body.user_password;
    await Db.query(`UPDATE customer SET cus_pass='${userPass}' WHERE cus_id='${userId}'`, (er, re) => {
        if (er) return res.send("Error: " + er.message);
        res.send("Transaction completed");
    })
}
const balanceInquiry = async (req, res) => {
    console.log(req.body);
    const body = req.body
    const userId = body.user_id;
    const sqlCom=`SELECT c.cus_id,(b.CREDIT-(b.DEBIT+b.ORDER_TOTAL)) AS balance FROM customer c 
    LEFT JOIN(SELECT c.cus_id,c.cus_name,h.txn_his_amount,h.user_id,h.txn_his_date,t.txn_id,t.txn_name,t.txn_code,d.txn_code_id,d.txn_code_name,d.txn_sign,SUM(IF(d.txn_sign='DR',h.txn_his_amount,0)) AS DEBIT,SUM(IF(d.txn_sign='CR',h.txn_his_amount,0))AS CREDIT,o.ORDER_TOTAL FROM customer c
        LEFT JOIN transaction_history h ON h.user_id=c.cus_id
        LEFT JOIN transaction t ON t.txn_id=h.txn_id
        LEFT JOIN transaction_code d ON d.txn_code_id=t.txn_code
        LEFT JOIN (SELECT o.user_id,SUM(o.order_price_total) AS ORDER_TOTAL FROM user_order o WHERE o.user_id=(SELECT cus_id FROM customer WHERE cus_id='${userId}')) o ON o.user_id=c.cus_id
        WHERE c.cus_id=(SELECT cus_id FROM customer WHERE cus_id='${userId}')) b ON b.cus_id =c.cus_id 
        WHERE c.cus_id='${userId}'`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er.message);
        let bal=re[0]['balance']
        console.log(bal);
        res.json({"bal":bal});
    })
}
module.exports = {
    updateUserName,
    updateTel,
    updateEmail,
    updatePassword,
    balanceInquiry,
}