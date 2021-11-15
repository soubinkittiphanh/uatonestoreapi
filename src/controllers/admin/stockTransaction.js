const Db = require('../../config/dbcon');

const createStockTransaction=async(req,res)=>{
    const body=req.body;
    console.log("=====> create transaction");
    console.log(body);
    const inputter=body.inputter_id;
    const tranastion_data=body.tranastion_data;
    const card_type=body.card_type;
    let sqlCom=`INSERT INTO card(card_type_code, card_number, card_isused, inputter) VALUES `;
    tranastion_data.forEach(el=>{
        console.log("start i "+i);
        if(i==cart_data.length-1){
            //Last row
            sqlCom=sqlCom+`(${card_type},${el.card_number},0,${inputter});`;
        }else{
            sqlCom=sqlCom+`(${card_type},${el.card_number},0,${inputter}),`;
        }
        i=i+1;

    });
    await Db.query(sqlCom,(er,re)=>{
        if (er)return res.send("Error: "+er)
        res.send("Transaction completed");
    })
}

module.exports={
    createStockTransaction, 
}