const Db = require('../../config/dbcon')
const deleteCard = async (req, res) => {
    const card_id = req.body.card_id;
 console.log("************* CARD DELETE *****************");
 console.log(`*************Payload: ${card_id} *****************`);
    await Db.query(`DELETE FROM CARD WHERE id = '${card_id}'`, (er, re) => {
        if (er) res.send("Error: " + er);
        return res.send("Transaction completed")
    })
    
}

const fetchCard=async(req,res)=>{
    console.log("************* LOAD CARD *****************");
    console.log(`*************Payload: NULL *****************`);
    await Db.query("SELECT * FROM card",(er,re)=>{
        if (er) return res.send("Error: "+er)
        res.send(re);
    })
}
// ******* FUNCTION BELOW IS NOT USED ||PROBLEM WITH A WAIT IS NOT AWAIT******


module.exports = {
    deleteCard,
    fetchCard,

}