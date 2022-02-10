const Helper = require('../../helper/');
const fs = require('fs');
const Db = require('../../config/dbcon')
const env=require('../../config');
const axios = require('axios').create({ baseURL: `http://localhost:${env.port||4000}` });

const singleMaster=async(req,res)=>{
     const body=req.FORM;
    
     console.log('=>   File: ' + req.file);
     console.log('=>   title: ' +  JSON.stringify(req.body.FORM));
     console.log('=>   title: .body' +  JSON.stringify(req.body));
     console.log('=>   title: .title' +  body.title);
     console.log('=>   title: .title' +  req.body.title);
     console.log('=>   title: .title' +  req.body[0].title);
     console.log('=>   File name: ' + req.file.originalname);
     console.log('=>   File path: ' + req.file.path);
     var tmp_path = req.file.path;
     const rndName = Date.now();
 
    //  var target_path = 'uploads/' +rndName+ req.file.originalname;
    //  var src = fs.createReadStream(tmp_path);
    //  var dest = fs.createWriteStream(target_path);
    //  src.pipe(dest);
    //  src.on('end', async() => { 
    //      const sqlCom=`INSERT INTO image_path_master(app_id,app_txn_id,img_path,img_name,img_remark)VALUES('${rndName+ req.file.originalname}','${target_path}','')`
    //      await Db.query(sqlCom, (er, re) => {
    //          if (er) return res.send("Error: " + er);
    //          return res.send("Transaction completed");
    //      })
    //      // res.send('Transaction complete'); 
    //  });
    //  src.on('error', (err) => { res.send('error'); });

}

const single = async (req, res) => {
    // const body=req.FORM;
    console.log('=>   File: ' + req.file);
    console.log('=>   File name: ' + req.file.originalname);
    console.log('=>   File path: ' + req.file.path);
    var tmp_path = req.file.path;
    const rndName = Date.now();

    /** The original name of the uploaded file
     stored in the variable "originalname". **/
    var target_path = 'uploads/' +rndName+ req.file.originalname;
    //customize upload 
    // fs.rename(oldpath, newpath, function (err) {
    //     if (err) {
    //         console.log('Error: ' + err);
    //         return res.send('Error: ' + err)
    //         // throw err;
    //     }
    // });

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', async() => { 
        const sqlCom=`INSERT INTO image_path_ad(img_name,img_path,remark)VALUES('${rndName+ req.file.originalname}','${target_path}','')`
        await Db.query(sqlCom, (er, re) => {
            if (er) return res.send("Error: " + er);
            return res.send("Transaction completed");
        })
        // res.send('Transaction complete'); 
    });
    src.on('error', (err) => { res.send('error'); });
}

const multi = async (req, res) => {
    const files = req.files;
    console.log('jSON: ' + req.body.FORM);
    console.log('Files: ' + files.length);
    const rndName = Date.now();
    let imagesObj = [];

    files.forEach(el => {
        var target_path = 'uploads/';
        var oldpath = el.path;
        var newpath = target_path + rndName + el.originalname;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log('Error: ' + err);
                return res.send('Error: ' + err)
                // throw err;
            }
        });
        imagesObj.push({ 'name': rndName + el.originalname, 'path': newpath })
        console.log('Loop len: ' + imagesObj.length);
        console.log("Inside loop");
    });
    console.log("Outside loop");
    let sqlComMessage;
    const commandResult = await axios.post("/product_i", { ...req.body, imagesObj }).then((res) => {
        console.log("AXIOS Succeed: " + res.data);
        sqlComMessage = res.data
        console.log("REQUEST STATUS CODE: " + res.data);
        console.log("REQUEST STATUS CODE DATA: " + res.status);
        return res.data === 'Transaction completed' ? true : false;
    }).catch(er => {
        sqlComMessage = er;
        console.log("AXIOS Error: " + er);
        return false;
    })
    console.log("Return client: " + commandResult);
    //*****************  REMOVE FILE IF THERE IS ERROR  *****************//
    if (commandResult === false) {
        console.log("False and removing files... ");
        imagesObj.forEach(el => {
            fs.unlinkSync(el.path, er => {
                console.log("Error: cannot remove file " + er);
            })
        })
        console.log("False and removing files...completed ");
    }
    res.send(commandResult ? 'Transaction completed' : 'Error: ' + sqlComMessage);
}
const remove_file = async (req, res) => {
    console.log("IMAGE NAME: " + req.body.img_name);
    const imageName = req.body.img_name
    fs.existsSync(`uploads/${imageName}`) && fs.unlinkSync(`uploads/${imageName}`, er => {
        if (er) return res.send('Error: cannot remove file ' + er)
    })
    Helper.ImgH.remove(imageName) ? res.send('Transaction completed') : res.send('Error SQL')
}
const multiUpdate = async (req, res) => {
    const files = req.files;
    console.log('jSON: ' + req.body.FORM);
    console.log('Files: ' + files.length);
    const rndName = Date.now();
    let imagesObj = [];

    files.forEach(el => {
        var target_path = 'uploads/';
        var oldpath = el.path;
        var newpath = target_path + rndName + el.originalname;
        !(fs.existsSync(`${target_path}${el.originalname}`)) &&
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log('Error: ' + err);
                    return res.send('Error: ' + err)
                    // throw err;
                }

            });
        imagesObj.push({ 'name': rndName + el.originalname, 'path': newpath })
        console.log('Loop len: ' + imagesObj.length);
        console.log("Inside loop");
    });
    console.log("Outside loop");
    let sqlComMessage;
    const commandResult = await axios.put("/product_e", { ...req.body, imagesObj }).then((res) => {
        console.log("AXIOS Succeed: " + res.data);
        sqlComMessage = res.data
        console.log("REQUEST STATUS CODE update: " + res.data);
        console.log("REQUEST STATUS CODE DATA update: " + res.status);
        return res.data === 'Transaction completed' ? true : false;
    }).catch(er => {
        sqlComMessage = er;
        console.log("AXIOS Error: " + er.data.Error);
        console.log("AXIOS Error: " + er.Error);
        console.log("AXIOS Error: " + er);
        return false;
    })
    console.log("Return client update: " + commandResult);
    //*****************  REMOVE FILE IF THERE IS ERROR  *****************//
    if (!commandResult) {
        console.log("False and removing files... ");
        imagesObj.forEach(el => {
            fs.unlinkSync(el.path, er => {
                console.log("Error: cannot remove file " + er);
            })
        })
        console.log("False and removing files...completed ");
    }
    res.send(commandResult ? 'Transaction completed' : 'Error: ' + sqlComMessage);
}

module.exports = {
    singleMaster,
    single,
    multi,
    remove_file,
    multiUpdate,
}