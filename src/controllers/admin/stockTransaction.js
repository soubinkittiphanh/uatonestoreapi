const Db = require('../../config/dbcon');

const createStockTransaction=async(req,res)=>{
    const body=req.body;
    console.log("=====> create transaction");
    console.log(body);
    const inputter=body.inputter_id;
    const tranastion_data=body.tranastion_data;
    const card_type=body.card_type;
    const product_id=body.product_id;
    let sqlCom=`INSERT INTO card(card_type_code, card_number, card_isused, inputter,product_id) VALUES `;
    let i=0;
    tranastion_data.forEach(el=>{
        console.log("start i "+i);
        if(i==tranastion_data.length-1){
            //Last row
            sqlCom=sqlCom+`(${card_type},${el},0,${inputter},'${product_id}');`;
        }else{
            sqlCom=sqlCom+`(${card_type},${el},0,${inputter},'${product_id}'),`;
        }
        i=i+1;

    });
    await Db.query(sqlCom,(er,re)=>{
        console.log(er);
        if (er)return res.send("Error: "+er)
        res.send("Transaction completed");
    })
}

module.exports={
    createStockTransaction, 
}