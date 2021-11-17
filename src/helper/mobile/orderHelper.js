const Db = require('../../config/dbcon');
// const  Db =require('../config/dbcon');

const checkStockAvailability = async (product_id,order_qty) => {

    // 200 = no error available
    // 500 = SQL ERROR
    // 503 = Product stock not suffient


    const sqlCom = `SELECT d.product_id AS card_pro_id,COUNT(d.card_number)-COUNT(cs.card_code) AS card_count FROM card d
    LEFT JOIN card_sale cs ON cs.card_code=d.card_number WHERE d.product_id ='${product_id}'
    GROUP BY d.product_id`;
    let stockCount = 0;
    await Db.query(sqlCom, (er, re) => {
        if (er) {
            console.log("Stock check Error: "+er);
            return 500}
        stockCount = re[0]["card_count"];
        if (stockCount-order_qty<0) {
            return 503
        }
        return 200

    })
}

module.exports={
    checkStockAvailability,
}