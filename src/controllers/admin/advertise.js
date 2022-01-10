const Db = require('../../config/dbcon')
const fetchAd=async(req,res)=>{

    console.log("************* FETCH ADVERTISE *****************");
    console.log(`*************Payload: NONE *****************`);

    const sqlCom=`SELECT * FROM image_path_ad WHERE id =(SELECT MAX(id) FROM image_path_ad)`
    await Db.query(sqlCom,(er,re)=>{
        if(er)return res.send("Error: "+er)
        res.send(re);
    })
}

module.exports={
    fetchAd,
}