const Token=require('../config')
const jwt=require('jsonwebtoken');
const login=(u_name)=>{
    console.log('=>'+process.env.ACCESS_TOKEN_SECRET);
    const username={user:u_name};
    const accessToken=jwt.sign(username,Token.actksecret,{expiresIn:'30s'});
    return {accessToken:accessToken}
}

module.exports={login}