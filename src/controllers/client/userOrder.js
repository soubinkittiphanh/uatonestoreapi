const Db = require('../../config/dbcon')
const dbAsync = require('../../config/dbconAsync');
const OrderHelper = require('../../helper/mobile/orderHelper')
const createOrder = async (req, res) => {
    const body = req.body;
    console.log("************* CREATE ORDER *****************");
    console.log(`*************Payload: ${body} *****************`);
    console.log(`************* CREATING ORDER **************`);
    console.log(`************* ${new Date()} *************`);
    const user_id = body.user_id;
    const cart_data = body.cart_data;
    //*******NOTE THE PRODUCT TO UPDATE PRDUCT SALE COUNT (STATISTIC)*******//
    let listOfProduct = [];
    //*******END NOTE THE PRODUCT TO UPDATE PRDUCT SALE COUNT (STATISTIC)*******//
    let i = 0;
    let sqlCom = `INSERT INTO user_order(order_id, user_id, product_id, product_amount, product_price, order_price_total, product_discount) VALUES `;
    let sqlComCardSale = ``;
    //Get last order_id
    console.log(`************* GETING ORDER ID **************`);
    console.log(`************* ${new Date()} *************`);
    // Card table locking id
    const lockingSessionId=Date.now()
    Db.query('SELECT IFNULL(MAX(order_id),0) AS order_id FROM user_order;', async (er, re) => {
        if (er) return res.send("Error: " + er)
        let genOrderId = re[0]['order_id'];
        if (genOrderId == 0) genOrderId = 10000;
        else genOrderId = parseInt(genOrderId) + 1;
        console.log(`************* LOOPING THROUGH ALL TXN **************`);
        console.log(`************* ${new Date()} *************`);
        for (let i = 0; i < cart_data.length; i++) {
            const el = cart_data[i];
            console.log(`************* CHECKING STOCK AVAILABILITY **************`);
            console.log(`************* ${new Date()} *************`);
            const count_stock = await OrderHelper.checkStockAvailability(el.product_id, el.product_amount,lockingSessionId);
            if (count_stock != 200) {
                console.log("STOCK STATUS CODE: " + count_stock);
                return res.send(count_stock == 503 ? "ເກີດຂໍ້ຜິດພາດ ສິນຄ້າ |" + el.product_id + "| ບໍ່ພຽງພໍ" : "Connection Error");
            }
            if (i == cart_data.length - 1) {
                //Last row
                sqlCom = sqlCom + `(${genOrderId},${user_id},${el.product_id},${el.product_amount},${el.product_price_retail},${el.product_price_retail * el.product_amount},${el.product_discount || 0});`;
            } else {
                sqlCom = sqlCom + `(${genOrderId},${user_id},${el.product_id},${el.product_amount},${el.product_price_retail},${el.product_price_retail * el.product_amount},${el.product_discount || 0}),`;
            }
            const QRCode = generateQR()
            //20221209 sqlComCardSale = `INSERT INTO card_sale(card_code,card_order_id,price,qrcode,pro_id,pro_discount) SELECT c.card_number,'${genOrderId}','${el.product_price}','${QRCode}','${el.product_id}','${el.product_discount || 0}' FROM card c WHERE c.card_isused =0 AND c.product_id='${el.product_id}' LIMIT ${el.product_amount};`;
            sqlComCardSale = `INSERT INTO card_sale(card_code,card_order_id,price,qrcode,pro_id,pro_discount) SELECT c.card_number,'${genOrderId}','${el.product_price}','${QRCode}','${el.product_id}','${el.product_discount || 0}' FROM card c WHERE c.locking_session_id ='${lockingSessionId}' LIMIT ${el.product_amount};`;
            
            // sqlComCardSale = `INSERT INTO card_sale(card_code,card_order_id,price,qrcode,pro_id,pro_discount) SELECT c.card_number,'${genOrderId}','${el.product_price}','${QRCode}','${el.product_id}','${el.product_discount || 0}' FROM card c WHERE c.card_isused =0 AND c.product_id='${el.product_id}' LIMIT ${el.product_amount}; UPDATE card SET card_isused=1 WHERE card_number=(SELECT c.card_number FROM card WHERE card_isused =0 AND product_id='${el.product_id}' LIMIT ${el.product_amount};)`;
        }
        //update order table
        console.log(`************* PUTTING TXN INTO USER ORDER TABLE **************`);
        console.log(`************* ${new Date()} *************`);
        Db.query(sqlCom, (er, re) => {
            if (er) {
                return res.send("Error: " + er);
            }
            // If no error insert to order then we should insert to card_sale for mapping card_sale -> user_order -> card
            console.log(`************* PUTTING TXN INTO CARD SALE TABLE **************`);
            console.log(`************* ${new Date()} *************`);
            Db.query(sqlComCardSale, (er, re) => {
                console.log("SQL: " + sqlComCardSale);
                if (er) {
                    console.log("Error: " + er);
                    console.log("Trying to insert to card_sale again: ");
                    Db.query(sqlComCardSale, (er, re) => {
                        if (er) {
                            //IF STILL NOT ABLE TO PROCESS SALE THEN WE WILL REVERSE TRANSACTION
                            const resverseSqlcom=`DELETE FROM user_order WHERE order_id=${genOrderId}`
                            Db.query(resverseSqlcom,(er,re)=>{
                                if(er) return res.send(`Error: ບໍ່ສາມາດສົ່ງບັດໄດ້ ກະລຸນາແຈ້ງ ແອັດມິນ ລົບອໍເດີ ເລກ: ${genOrderId}`)
                                return res.send("Error: ກະລຸນາລອງໃຫມ່ອີກຄັ້ງ server timeout" + er)
                            })

                            
                        }
                        else {
                            console.log(`************* PROCESS ORDER IS DONE **************`);
                            res.send("Transaction completed");
                            //update stock value
                            console.log(`************* UPDATE STOCK VALUE **************`);
                            updateStockCount(lockingSessionId);
                        }
                    })
                } else {
                    console.log(`************* PROCESS ORDER IS DONE **************`);
                    res.send("Transaction completed");
                    //update stock value
                    console.log(`************* UPDATE STOCK VALUE **************`);
                    console.log(`************* ${new Date()} *************`);
                    updateStockCount(lockingSessionId);
                }
            })
        })

    });
}
const updateStockCount = async (lockingSessionId) => {
    //Change card status for those card id is in card sale table //UPDATE card c SET c.card_isused=1 WHERE c.card_isused=0 AND c.card_number IN(SELECT s.card_code FROM card_sale s WHERE s.processing_date >='2022-06-21 00:00:00')
    try {
        console.log(`************* UPDATE STOCK COUNT => **************`);
        console.log(`************* ${new Date()} *************`);
        const response = await dbAsync.query(`UPDATE card c SET c.card_isused=1 WHERE locking_session_id='${lockingSessionId}'`)
        console.log(`************* UPDATE STOCK COUNT => DONE **************`);
        console.log(`*********** PROCESS RECORD0: ${ response.affectedRows}`);
        console.log(`*********** PROCESS RECORD1: ${ response[0]['resultSetHeader'].changedRows}`);
       const  [rows, fields]=response;
       console.log("ROWS: "+rows);
       console.log("FIELD: "+fields);
        rows.forEach(item => {
            console.log('id', item.id)
            console.log('id ITEM FULL', item)
           })
        response.forEach(el=>{
            console.log("reponse => "+ el);
        })
        console.log(`************* ${new Date()} *************`);
        await updateProductStockCountDirect();
    } catch (error) {
        console.log("Update stock counter error: " + error);
    }

}
const updateProductStockCountDirect = async () => {
    //update product table set product sale statistic [sale amount]
    console.log(`************* updateProductStockCountDirect **************`);
    console.log(`************* ${new Date()} ************* =>`);
    const sqlCom = 'UPDATE product pro  INNER JOIN  (SELECT d.product_id AS card_pro_id,COUNT(d.card_number)-COUNT(cs.card_code) AS card_count FROM card d LEFT JOIN card_sale cs ON cs.card_code=d.card_number WHERE d.card_isused!=2  GROUP BY d.product_id) proc ON proc.card_pro_id=pro.pro_id SET pro.stock_count=proc.card_count;'
    try {
        const response = await dbAsync.query(sqlCom);
        console.log(`************* updateProductStockCountDirect => DONE **************`);
        console.log(`*********** PROCESS RECORD: ${response['rows']}`);
        console.log(`************* ${new Date()} *************`);
    } catch (error) {
        console.log("Cannot get product sale count");
    }

}
const reverseOrderByOrderId=async(orderId)=>{
    const sqlCom=`DELETE FROM user_order WHERE order_id=${orderId}`
    return Db.query(sqlCom,(er,re)=>{
        if(er) return `05:${er}`
        return '00:Transaction completed'
    })
}
const generateQR = () => {
    console.log("*************** GENERATE QR  ***************");

    let QRCodeStr = '';
    for (let i = 0; i < 16; i++) {
        const subQR = getRandomInt(10)
        QRCodeStr += subQR.toString();
    }

    return QRCodeStr;
}
const getRandomInt = (max) => {
    console.log("*************** GET RANDOM INT  ***************");

    return Math.floor(Math.random() * max);
}

const fetchOrder = async (req, res) => {
    console.log("*************** FETCH ORDER  ***************");

    const memId = req.query.mem_id;
    const fDate = req.query.f_date;
    const tDate = req.query.t_date;

    console.log("mem_id: " + memId);
    Db.query(`SELECT o.*,p.pro_name FROM user_order o LEFT JOIN product p on o.product_id=p.pro_id WHERE o.user_id ='${memId}' AND o.txn_date BETWEEN '${fDate} 00:00:00' AND '${tDate} 23:59:59' ORDER BY o.order_id DESC`, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send(re);
    })
}
const fetchMaxOrderByUserId = async (req, res) => {
    console.log("*************** FETCH MAX ORDER ID'S TXN  ***************");
    const memId = req.query.mem_id;
    console.log("mem_id: " + memId);
    Db.query(`SELECT o.*,p.pro_name FROM user_order o LEFT JOIN product p on o.product_id=p.pro_id WHERE o.user_id ='${memId}' AND o.order_id=(SELECT MAX(order_id) FROM user_order WHERE user_id='${memId}') ORDER BY o.order_id DESC`, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send(re);
    })
}
const fetchOrderByDate = async (req, res) => {
    const body = req.body;
    console.log("*************** FETCH ORDER BY DATE  ***************");
    console.log(`*************Payload: ${body} *****************`);
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
    const userId = req.query.userId
    console.log("************* LOAD ORDER BY DATE *****************");
    console.log(`*************Payload: ${fromDate} *****************`);
    console.log(`*************Payload: ${toDate} *****************`);
    console.log(`*************Payload: ${userId} *****************`);
    let extraCondition;
    if (userId.includes(null) || userId == '') {
        extraCondition = ''
    } else {
        extraCondition = ` AND o.user_id=${userId}`
    }
    const sqlCom = `SELECT o.*,p.pro_name,c.cus_name FROM user_order o LEFT JOIN product p on o.product_id=p.pro_id LEFT JOIN customer c ON c.cus_id=o.user_id WHERE o.txn_date BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59' ${extraCondition}  ORDER BY o.order_id DESC`
    console.log("sal com: " + sqlCom);
    Db.query(sqlCom, (er, re) => {
        if (er) return res.send("Error: " + er)
        res.send(re);
    })
}

module.exports = {
    createOrder,
    fetchOrder,
    fetchOrderByDate,
    fetchMaxOrderByUserId,
    updateStockCount
}