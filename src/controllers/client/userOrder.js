const Db = require('../../config/dbcon')

const createOrder=async(req,res)=>{
    const body =req.body;
    const user_id=body.user_id;
    const product_id=body.product_id;
    const product_amout=body.product_amount;
    const product_price =body.product_price;
    const order_price_total =body.order_price_total;
    const cart_data=body.cart_data;
    console.log("data: "+req.body.cart_data);
    console.log("data usr_id: "+req.body.user_id);
    let i=0;
    let sqlCom=`INSERT INTO user_order(order_id, user_id, product_id, product_amount, product_price, order_price_total) VALUES `;
    //Get last order_id
    await Db.query('SELECT IFNULL(MAX(order_id),0) AS order_id FROM user_order;',(er,re)=>{
        if(er) return res.send("Error: "+er)
        console.log("pass error:");
        console.log("pass error:"+re[0]);
        let genOrderId=re[0]['order_id'];
        console.log("order_id: "+genOrderId);
        if(genOrderId==0) genOrderId=10000;
        else genOrderId=parseInt(genOrderId)+1;
        console.log("len: "+cart_data.length);
        cart_data.forEach(el=>{
            console.log("start i "+i);
            if(i==cart_data.length-1){
                //Last row
                sqlCom=sqlCom+`(${genOrderId},${user_id},${el.product_id},${el.product_amount},${el.product_price},${el.order_price_total});`;
            }else{
                sqlCom=sqlCom+`(${genOrderId},${user_id},${el.product_id},${el.product_amount},${el.product_price},${el.order_price_total}),`;
            }
            i=i+1;
    
        });
        console.log("SQL: "+sqlCom);
        Db.query(sqlCom,(er,re)=>{
            if(er)return res.send("Error: "+er);
            res.send("Transaction completed");
        })

    });
}
const updateOrder=async(req,res)=>{

}
const fetchOrder=async(req,res)=>{
    const memId=req.query.mem_id;
    
    console.log("mem_id: "+memId);
    await Db.query(`SELECT o.*,p.pro_name FROM user_order o LEFT JOIN product p on o.product_id=p.pro_id WHERE o.user_id ='${memId}' ORDER BY o.order_id DESC`,(er,re)=>{
        if(er) return res.send("Error: "+er)
        res.send(re);
    })


}
const fetchOrderById=async(req,res)=>{

}

module.exports={
    createOrder,
    fetchOrder,
}