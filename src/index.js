console.log("Hello welcome to online stores");
const buildApp =require("./models/app.js");
const startApp=async()=>{

    const app = await buildApp();
    
    app.listen(4000,()=>{
        console.log("app is runing");
    })


}
startApp();