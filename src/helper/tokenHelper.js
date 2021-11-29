const Token=require('../config')
const jwt=require('jsonwebtoken');
const login=(u_name,u_id,u_phone,u_email,u_debit,u_credit)=>{
    console.log('=>'+process.env.ACCESS_TOKEN_SECRET);
    const username={user:u_name};
    const accessToken=jwt.sign(username,Token.actksecret,{expiresIn:'30s'});
    return {accessToken:accessToken,userName:u_name,userId:u_id,userPhone:u_phone,userEmail:u_email,userDebit:u_debit,userCredit:u_credit}
}

module.exports={login}