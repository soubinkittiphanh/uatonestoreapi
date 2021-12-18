const Db = require('../../config/dbcon')
const deleteCard = async (req, res) => {
    const card_id = req.body.card_id;
 console.log("************* CARD DELETE *****************");
 console.log(`*************Payload: ${card_id} *****************`);
    await Db.query(`DELETE FROM card WHERE id = '${card_id}'`, (er, re) => {
        if (er) res.send("Error: " + er);
        return res.send("Transaction completed")
    })
    
}

const fetchCard=async(req,res)=>{
    const proId=req.query.pro_id
    console.log("************* LOAD CARD *****************");
    console.log(`*************Payload: ${proId} *****************`);
    await Db.query(`SELECT * FROM card WHERE product_id='${proId}' and card_isused = 0`,(er,re)=>{
        if (er) return res.send("Error: "+er)
        res.send(re);
    })
}
// ******* FUNCTION BELOW IS NOT USED ||PROBLEM WITH A WAIT IS NOT AWAIT******


module.exports = {
    deleteCard,
    fetchCard,

}