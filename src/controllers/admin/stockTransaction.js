const Db = require('../../config/dbcon');

const createStockTransaction=async(req,res)=>{
    const body=req.body;
    const inputter=body.inputter_id;
    const tranastion_data=body.tranastion_data;
    let sqlCom=`INSERT INTO user_order(card_type_code, card_number, card_isused, inputter) VALUES `;
    tranastion_data.forEach(el=>{
        console.log("start i "+i);
        if(i==cart_data.length-1){
            //Last row
            sqlCom=sqlCom+`(${card_type_code},${el.card_number},0,${inputter});`;
        }else{
            sqlCom=sqlCom+`(${card_type_code},${el.card_number},0,${inputter}),`;
        }
        i=i+1;

    });
}