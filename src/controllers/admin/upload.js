const Helper = require('../../helper/');
const fs = require('fs');
const path = require('path');
const axios = require('axios').create({ baseURL: 'http://localhost:4000' });

const single = async (req, res) => {
    console.log('=>   Upload/');
    console.log('=>   File: ' + req.file);
    console.log('=>   File name: ' + req.file.originalname);
    console.log('=>   File path: ' + req.file.path);
    var tmp_path = req.file.path;

    /** The original name of the uploaded file
     stored in the variable "originalname". **/
    var target_path = 'uploads/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', () => { res.send('complete'); });
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
    single,
    multi,
    remove_file,
    multiUpdate,
}