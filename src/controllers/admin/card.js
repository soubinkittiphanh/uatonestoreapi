const Db = require('../../config/dbcon')
const deleteCard = async (req, res) => {
    const card_id = req.body.card_id;
    const user_id = req.body.user_id;
    console.log("************* CARD DELETE *****************");
    console.log(`*************Payload: ${card_id} *****************`);
    const sqlCom = `INSERT INTO card_his( card_type_code, product_id, card_number, card_isused, inputter) SELECT card_type_code, product_id, card_number, card_isused, '${user_id}' FROM card WHERE card.id = '${card_id}'`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er)
        Db.query(`DELETE FROM card WHERE id = '${card_id}'`, (er, re) => {
            if (er) res.send("Error: " + er);
            return res.send("Transaction completed")
        })
    })


}

const fetchCard = async (req, res) => {
    const proId = req.query.pro_id
    console.log("************* LOAD CARD *****************");
    console.log(`*************Payload: ${proId} *****************`);
    await Db.query(`SELECT * FROM card WHERE product_id='${proId}' and card_isused = 0`, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send(re);
    })
}
// ******* FUNCTION BELOW IS NOT USED ||PROBLEM WITH A WAIT IS NOT AWAIT******


module.exports = {
    deleteCard,
    fetchCard,

}