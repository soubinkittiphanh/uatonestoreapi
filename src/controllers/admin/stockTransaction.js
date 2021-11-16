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
    let sqlSurveyElement='';
    let i=0;
    tranastion_data.forEach(el=>{
        console.log("start i "+i);
        if(i==tranastion_data.length-1){
            //Last row
            sqlSurveyElement=sqlSurveyElement+`'${el}'`
            sqlCom=sqlCom+`(${card_type},${el},0,${inputter},'${product_id}');`;
        }else{
            sqlSurveyElement=sqlSurveyElement+`'${el}',`
            sqlCom=sqlCom+`(${card_type},${el},0,${inputter},'${product_id}'),`;
        }
        i=i+1;
        
    });
    const sqlSurvey=`SELECT COUNT(c.card_number) as exist_count FROM card c WHERE c.card_number IN (${sqlSurveyElement})`
    console.log("Survey sql: "+sqlSurvey);
    await Db.query(sqlSurvey,(er,re)=>{
        if(er)return res.send("Error: "+er);
        const exist_count=re[0]["exist_count"]
        if(exist_count>0) return res.send("ລາຍການຊ້ຳ ເລກບັດຊ້ຳ ຈຳນວນ: "+exist_count);
        Db.query(sqlCom,(er,re)=>{
            console.log(er);
            if (er)return res.send("Error: "+er)
            res.send("Transaction completed");
        })
    })

}

module.exports={
    createStockTransaction, 
}