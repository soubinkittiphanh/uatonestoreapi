const Db = require('../../config/dbconAsync')

const createOrder=async(req,res)=>{
    const body =req.body;
    const user_id=body.user_id;
    const product_id=body.product_id;
    const product_amout=body.product_amount;
    const product_price =body.product_price;
    const order_price_total =body.order_price_total;
    const dataBody=[];
    let i=0;
    let sqlCom=`INSERT INTO user_order(order_id, user_id, product_id, product_amount, product_price, order_price_total) VALUES `;
    //Get last order_id
    await Db.query('SELECT IFNULL(MAX(order_id),0) FROM user_order;',(er,re)=>{
        if(er) return res.send("Error: "+er)
        let genOrderId=res[0]['order_id'];
        console.log("Order_id: "+genOrderId);
        if(genOrderId=0) genOrderId=10000;
        else genOrderId=parseInt(genOrderId)+1;
        dataBody.forEach(el=>{
            i=i++;
            if(i==dataBody.length-1){
                //Last row
                sqlCom=sqlCom+`(${genOrderId},${user_id},${product_id},${product_amout},${product_price},${order_price_total});`;
            }else{
                sqlCom=sqlCom+`(${genOrderId},${user_id},${product_id},${product_amout},${product_price},${order_price_total}),`;
            }
    
        });
        Db.query(sqlCom,(er,re)=>{
            if(er)return res.send("Error: "+er);
            res.send("Transaction completed");
        })

    });
}
const updateOrder=async(req,res)=>{

}
const fetchOrder=async(req,res)=>{

}
const fetchOrderById=async(req,res)=>{

}

module.exports={
    createOrder,
}