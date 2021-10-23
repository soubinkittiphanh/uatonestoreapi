const Db = require('../../config/dbcon');
const createProd = async (req, res) => {
    console.log(req.body.FORM);
    const body = JSON.parse(req.body.FORM);
    const pro_cat = body.pro_category;
    let pro_id = body.pro_id;
    const pro_name = body.pro_name;
    const pro_price = body.pro_price;
    const pro_desc = body.pro_desc;
    const pro_status = +body.pro_status;
    const image_path = req.body.imagesObj;
    let sqlComImages = 'INSERT INTO image_path(pro_id, img_name, img_path)VALUES';

    //*****************  QUERY LAST PRODUCT ID SQL  *****************//
    await Db.query('SELECT MAX(pro_id) AS ID FROM product HAVING MAX(pro_id) IS NOT NULL', (er, re) => {
        console.log("=====> Processing product db");
        if (er) return res.send("Error: " + er)
        if (re.length < 1) pro_id = 1000;
        else pro_id = parseInt(re[0]['ID']) + 1
        image_path.forEach((i, idx, element) => {
            console.log("Element len: " + element.length);
            console.log("Element name: " + i.name);
            console.log("Element i: " + i);
            console.log("Element idx: " + idx);
            if (idx === element.length - 1) sqlComImages += `(${pro_id},'${i.name}','${i.path}');`;
            else sqlComImages += `(${pro_id},'${i.name}','${i.path}'),`;

        });
        const sqlCom = `INSERT INTO product(pro_category, pro_id, pro_name, pro_price, pro_desc, pro_status)VALUES('${pro_cat}','${pro_id}','${pro_name}','${pro_price}','${pro_desc}','${pro_status}');`
        //*****************  INSERT PRODUCT SQL  *****************//
        Db.query(sqlCom, (er, re) => {
            console.log("Execute:=>");
            if (er) {
                // res.status(503).({"Error":er});
                res.send('Error naja :-) ໂປແກມເມີ ກາກ.... ' + er);
            } else if (re) {
                //*****************  INSERT IMAGES SQL  *****************//
                Db.query(sqlComImages, (er, re) => {
                    if (er) return res.send("Error: naja :-) ໂປແກມເມີ ກາກ.... " + er);
                    res.send("Transaction completed");
                });
            }
        })
    })

}
const updateProd = async (req, res) => {
    console.log(req.body.FORM);
    const body = JSON.parse(req.body.FORM);
    const pro_cat = body.pro_category;
    let pro_id = body.pro_id;
    const pro_name = body.pro_name;
    const pro_price = body.pro_price;
    const pro_desc = body.pro_desc;
    const pro_status = +body.pro_status;
    const image_path = req.body.imagesObj;
    let sqlComImages = 'INSERT INTO image_path(pro_id, img_name, img_path)VALUES';
    const sqlCom = `UPDATE product SET pro_category='${pro_cat}', pro_name='${pro_name}', pro_price='${pro_price}', pro_desc='${pro_desc}', pro_status='${pro_status}' WHERE pro_id='${pro_id}'`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send('Error: ' + er)

        if (image_path.length < 1) return res.send('Transaction completed');
        image_path.forEach((i, idx, element) => {
            console.log("Element len: " + element.length);
            console.log("Element name: " + i.name);
            console.log("Element i: " + i);
            console.log("Element idx: " + idx);
            if (idx === element.length - 1) sqlComImages += `(${pro_id},'${i.name}','${i.path}');`;
            else sqlComImages += `(${pro_id},'${i.name}','${i.path}'),`;

        });
        //*****************  INSERT IMAGES SQL  *****************//
        Db.query(sqlComImages, (er, re) => {
            if (er) return res.send("Error: naja :-) ໂປແກມເມີ ກາກ.... " + er);
            res.send("Transaction completed");
        });

    })
}
const fetchProd = async (req, res) => {
    await Db.query('SELECT p.*,c.categ_name FROM product p LEFT JOIN product_category c ON c.categ_id=p.pro_category', (er, re) => {
        if (er) return res.send('SQL ' + er)
        res.send(re)
    })
}
const fetchProdId = async (req, res) => {
    const pro_id = req.body.proid;
    await Db.query(`SELECT p.*,i.img_name,i.img_path FROM product p LEFT JOIN image_path i ON i.pro_id=p.pro_id WHERE p.pro_id=${pro_id}`, (er, re) => {
        if (er) return res.send('SQL ' + er)
        res.send(re)
    })
}

module.exports = {
    createProd,
    updateProd,
    fetchProd,
    fetchProdId
}