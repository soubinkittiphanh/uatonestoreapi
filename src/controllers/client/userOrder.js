const Db = require('../../config/dbcon')
const dbAsync = require('../../config/dbconAsync')
const OrderHelper = require('../../helper/mobile/orderHelper')
const createOrder = async (req, res) => {
    const body = req.body;
    const user_id = body.user_id;
    const cart_data = body.cart_data;
    console.log("data: " + req.body.cart_data);
    console.log("data usr_id: " + req.body.user_id);

    let i = 0;
    let sqlCom = `INSERT INTO user_order(order_id, user_id, product_id, product_amount, product_price, order_price_total) VALUES `;
    let sqlComCardSale = ``;
    //Get last order_id
    await Db.query('SELECT IFNULL(MAX(order_id),0) AS order_id FROM user_order;', async (er, re) => {
        if (er) return res.send("Error: " + er)
        console.log("pass error:");
        console.log("pass error:" + re[0]);
        let genOrderId = re[0]['order_id'];
        console.log("order_id: " + genOrderId);
        if (genOrderId == 0) genOrderId = 10000;
        else genOrderId = parseInt(genOrderId) + 1;
        console.log("len: " + cart_data.length);

        for (let i = 0; i < cart_data.length; i++) {
            const el = cart_data[i];
            const count_stock = await checkStockAvailability(el.product_id, el.product_amount);
            if (count_stock != 200) {
                console.log("STOCK STATUS CODE: " + count_stock);
                return res.send(count_stock == 503 ? "ເກີດຂໍ້ຜິດພາດ ສິນຄ້າ "+el.product_id+" ບໍ່ພຽງພໍ" : "Connection Error");
            }
            console.log("count_stock first: " + count_stock);
            console.log("start i " + i);
            if (i == cart_data.length - 1) {
                //Last row
                sqlCom = sqlCom + `(${genOrderId},${user_id},${el.product_id},${el.product_amount},${el.product_price},${el.order_price_total});`;
            } else {
                sqlCom = sqlCom + `(${genOrderId},${user_id},${el.product_id},${el.product_amount},${el.product_price},${el.order_price_total}),`;
            }
            sqlComCardSale = sqlComCardSale + `INSERT INTO card_sale(card_code,card_order_id) SELECT c.card_number,'${genOrderId}' FROM card c WHERE c.card_isused =0 AND c.product_id='${el.product_id}' LIMIT ${el.product_amount};`


        }


        console.log("SQL: " + sqlCom);
        Db.query(sqlCom, (er, re) => {
            if (er) {
                console.log("SQL: " + sqlCom);
                console.log("Error: " + er);
                return res.send("Error: " + er);
            }
            // If no error insert to order then we should insert to card_sale for mapping card_sale -> user_order -> card
            console.log("Ready to insert to card_sale");

            Db.query(sqlComCardSale, (er, re) => {
                console.log("********Insert in to card_sale**********");
                console.log("SQL IN " + sqlComCardSale);
                if (er) {
                    console.log("SQL: " + sqlComCardSale);
                    console.log("Error: " + er);
                    return res.send("Error: " + er)
                }
                //update stock value
                Db.query("UPDATE card c SET c.card_isused=1 WHERE c.card_number IN(SELECT s.card_code FROM card_sale s)")
                res.send("Transaction completed");
            })
        })

    });
}
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
const updateOrder = async (req, res) => {

}
const fetchOrder = async (req, res) => {
    const memId = req.query.mem_id;

    console.log("mem_id: " + memId);
    await Db.query(`SELECT o.*,p.pro_name FROM user_order o LEFT JOIN product p on o.product_id=p.pro_id WHERE o.user_id ='${memId}' ORDER BY o.order_id DESC`, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send(re);
    })


}
const fetchOrderById = async (req, res) => {

}

module.exports = {
    createOrder,
    fetchOrder,
}