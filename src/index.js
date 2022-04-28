console.log("Hello welcome to online stores");
const buildApp =require("./models/app.js");
const env=require("./config");
const startApp=async()=>{

    const app = await buildApp();
    
    app.listen(env.port || 4000,()=>{

        console.log("app is runing: "+env.port || 4000);
        console.log("app is runing "+env.db);

    }).setTimeout(0)
   


}
startApp();