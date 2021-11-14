const Db = require('../../config/dbcon')
const Login = require('../../helper/tokenHelper')
const Authmember = async (req, res) => {
    const body = req.body;
    const u_id = body.mem_id;
    const u_pw = body.mem_pwd;
    await Db.query(`SELECT * FROM user_account where user_id='${u_id}' AND user_pass='${u_pw}'`, (er, re) => {
        if (er) return res.send("Error: " + er)

    })
}
const Authcustomer = async (req, res) => {
    const body = req.body;
    console.log(body);
    const u_id = body.cus_id;
    const u_pw = body.cus_pwd;

    await Db.query(`SELECT * FROM customer where cus_id='${u_id}' AND cus_pass='${u_pw}'`, (er, re) => {
        if (er) return res.send("Error: " + er)
        console.log(re);
        // console.log(re[0].cus_name);
        re.length > 0 ? res.send(Login.login(re[0]['cus_name'],re[0]['cus_id'],re[0]['cus_tel'],re[0]['cus_email']))
            : res.send({"accessToken":"","error":"ລະຫັດຜ່ານ ຫລື ໄອດີບໍ່ຖືກຕ້ອງ"})

    })
}

module.exports = {
    Authcustomer,
    Authmember,
}