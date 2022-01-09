const Db = require('../../config/dbcon');
const createAd = async (req, res) => {
    const body = req.body
    const img_name = body.img_name;
    // const img_name=body.img_name;
    await Db.query('', (er, re) => {
        if (er) return res.send("Error: " + er);
        return res.send("Transaction completed");
    })
}
const fetchAd = async (req, res) => {
    await Db.query('', (er, re) => {
        if (er) return res.send("Error: " + er);
        return res.send(re);
    })
}
module.exports = {
    createAd,
    fetchAd,

}