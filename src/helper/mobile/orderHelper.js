const dbAsync = require('../../config/dbconAsync')

const checkStockAvailability = async (product_id, order_qty) => {

    // 200 = no error available
    // 500 = SQL ERROR
    // 503 = Product stock not suffient
    console.log("Product: " + product_id);
    console.log("Product qty: " + order_qty);
   // const sqlCom = `SELECT p.pro_id,IFNULL(s.card_count,0) AS card_count FROM product p LEFT JOIN (SELECT d.product_id AS card_pro_id,COUNT(d.card_number)-COUNT(cs.card_code) AS card_count FROM card d LEFT JOIN card_sale cs ON cs.card_code=d.card_number WHERE d.product_id ='${product_id}' GROUP BY d.product_id) s ON s.card_pro_id = p.pro_id WHERE p.pro_id='${product_id}'`;
    const sqlCom = `SELECT c.product_id AS pro_id,IFNULL(COUNT(c.card_number),0) AS card_count FROM card c WHERE c.product_id='${product_id}' AND c.card_isused=0`;
    let stockCount = 0;
    let statusCode = 0;
    try {
        const response = await dbAsync.query(sqlCom);
        stockCount = response[0][0]["card_count"];
        const productId = response[0][0]["pro_id"];
        console.log("Stock count: "+stockCount+', Product: '+productId);
        if (stockCount - order_qty < 0) {
            statusCode = 503
            console.log("Statuscode: " + statusCode);
        } else {
            statusCode = 200;
            console.log("Statuscode: " + statusCode);
        }
    } catch (error) {
        console.log(("Error: " + error));
    }
    console.log("Status: " + statusCode);
    return statusCode;
}

module.exports={
    checkStockAvailability,
}