const Db = require('../../config/dbcon')

const createChat = async (req, res) => {
    const body = req.body;
    const chat_type_id = body.chat_type_id;
    const chat_msg = body.chat_msg;
    const chat_user_id = body.chat_user_id;
    console.log("************* CREATE CHAT  *****************");
    console.log(`*************Payload: ${body.chat_type_id} *****************`);
    const custId = body.cust_id;
    const sqlCom = `INSERT INTO chat( msg_type, chat_message, user_id, chat_isread) VALUES ('${chat_type_id}','${chat_msg}','${chat_user_id}',0)`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send("Transaction completed");
    })
}

const fetchChat = async (req, res) => {

    console.log("************* FETCH CHAT *****************");
    const sqlCom = `SELECT * FROM chat`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er);
        res.send(re);
    });
}
const fetchChatByID = async (req, res) => {
    const body = req.query
    console.log("************* FETCH CHAT BY ID *****************");
    console.log(`*************Payload: ${body.chat_type_id} *****************`);
    const sqlCom = `SELECT * FROM chat WHERE user_id='${body.chat_user_id}'`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er);
        res.send(re);
    });
}
module.exports = {
    createChat,
    fetchChat,
    fetchChatByID,
}