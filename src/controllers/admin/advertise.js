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
const updateAd=async(req,res)=>{

    console.log("************* TOGGLE ADVERTISE *****************");
    console.log(`*************Payload: NONE *****************`);
    const body=req.body;
    const id=body.id;
    const isactive=body.active;
    const sqlCom=`UPDATE image_path_ad SET isactive='${isactive}' WHERE id=${id}`
    await Db.query(sqlCom,(er,re)=>{
        if(er)return res.send("Error: "+er)
        res.send("Transaction completed");
    })
}

module.exports={
    fetchAd,
    updateAd,
}