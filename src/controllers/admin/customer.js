const Db = require('../../config/dbcon');

const createCustomer = async (req, res) => {
    console.log(req.body);
    const body = req.body
    let cus_id = body.cus_id;
    const cus_pass = body.cus_pass;
    const cus_name = body.cus_name;
    const cus_tel = body.cus_tel;
    const cus_email = body.cus_email;
    const cus_active = body.cus_active==true?1:0;
    await Db.query("SELECT MAX(cus_id) AS ID FROM customer HAVING MAX(cus_id) IS NOT NULL", (er, re) => {
        if (er) return res.send("Error: " + er)
        if (re.length < 1) cus_id = 1000
        else cus_id = parseInt(re[0]['ID']) + 1
        const sqlCom = `INSERT INTO customer(cus_id,cus_pass,cus_name,cus_tel,cus_email,cus_active) VALUES('${cus_id}','${cus_pass}','${cus_name}','${cus_tel}','${cus_email}','${cus_active}')`
        Db.query(sqlCom, (er, re) => {
            if (er) return res.send('Error: ' + er)
            res.send('Transaction completed')
        })
    })
}
const updateCustomer = async (req, res) => {
    console.log(req.body);
    const body = req.body
    let cus_id = body.cus_id;
    const cus_pass = body.cus_pass;
    const cus_name = body.cus_name;
    const cus_tel = body.cus_tel;
    const cus_email = body.cus_email;
    const cus_active = body.cus_active==true?1:0;

    const sqlCom = `UPDATE customer SET cus_pass='${cus_pass}', cus_name='${cus_name}',
    cus_tel='${cus_tel}',cus_email='${cus_email}',cus_active='${cus_active}' WHERE cus_id='${cus_id}'`
    await Db.query(sqlCom, (er, re) => {
        if (er) return res.send('Error: ' + er)
        res.send('Transaction completed')
    })
}
const fetchCustomer = async (req, res) => {
    await Db.query('SELECT * FROM customer', (er, re) => {
        if (er) res.send("Error: " + er)
        res.send(re)
    })
}

module.exports = {
    createCustomer,
    updateCustomer,
    fetchCustomer,

}