const Db = require('../../config/dbcon')
const deleteCard = async (req, res) => {
    const card_id = req.body.card_id;
    const user_id = req.body.user_id;
    var value_date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');

    console.log("************* CARD DELETE *****************");
    console.log("************* DATE TIME "+value_date+ "*****************");
    console.log(`*************Payload: ${card_id} *****************`);
    const sqlCom=`UPDATE card SET card_isused =2,update_user='${user_id}',update_time='${value_date}' WHERE id='${card_id}'`
    // const sqlCom = `INSERT INTO card_his( card_type_code, product_id, card_number, card_isused, inputter) SELECT card_type_code, product_id, card_number, card_isused, '${user_id}' FROM card WHERE card.id = '${card_id}'`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er)
        // Db.query(`DELETE FROM card WHERE id = '${card_id}'`, (er, re) => {
        //     if (er) res.send("Error: " + er);
            return res.send("Transaction completed")
        // })
    })


}

const fetchCard = async (req, res) => {
    const proId = req.query.pro_id
    console.log("************* LOAD CARD *****************");
    console.log(`*************Payload: ${proId} *****************`);
    await Db.query(`SELECT c.*,u.user_name FROM card c LEFT JOIN user_account u ON u.user_id = c.inputter WHERE c.product_id='${proId}'  ORDER BY c.card_input_date DESC`, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send(re);
    })
}
// ******* FUNCTION BELOW IS NOT USED ||PROBLEM WITH A WAIT IS NOT AWAIT******


module.exports = {
    deleteCard,
    fetchCard,

}