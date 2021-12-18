
const CategoryCtr = require('../controllers/admin/category')
const ProdCtr = require('../controllers/admin/product')
const Sale = require('../controllers/admin/sale')
const User = require('../controllers/admin/user')
const Customer = require('../controllers/admin/customer')
const TxnType = require('../controllers/admin/txnType')
const Txn = require('../controllers/admin/txn')
const TxnHis = require('../controllers/admin/txnHis')
const Login = require('../controllers/login');
const jwt = require('jsonwebtoken');
const Token = require('../config');
const Upload = require('../controllers/admin/upload')
const Auth = require('../controllers/admin/authen')
const OrderUser=require('../controllers/client/userOrder')
const UserInfo=require('../controllers/mobile/userInfo')
const StockCate=require('../controllers/admin/stockCategory')
const StockMethod=require('../controllers/admin/stockTransaction')
const Card=require('../controllers/admin/card')
const UserInbox=require('../controllers/client/userInbox')
const RegisterCustomer=require('../controllers/client/register')
const multer = require('multer')

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/img', 'image/png', 'image/jpeg', 'image/gif']
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPE"
        return cb(error, false);
    }
    cb(null, true);
}
const uploadModule = multer({ dest: './uploads/', fileFilter, limits: { fileSize: 200000 } })
const upload = async (app) => {
    app.post('/uploadsinle', uploadModule.single('file'), Upload.single)
    app.post('/uploadmulti', uploadModule.array('files'), Upload.multi)
    app.post('/uploadmulti_update', uploadModule.array('files'), Upload.multiUpdate)
    app.post('/unlink_file', Upload.remove_file)
}
const category = async (app) => {
    app.post("/category_i", CategoryCtr.createCate);
    app.put('/category_e', CategoryCtr.updateCate);
    app.get('/category_f', CategoryCtr.fetchCate);
    app.get('/', (req, res) => {
        res.json({ "status": "succeed" });
    });

}
const product = async (app) => {
    app.post('/product_i', ProdCtr.createProd);
    app.put('/product_e', ProdCtr.updateProd);
    app.get('/product_f', ProdCtr.fetchProd);
    app.post('/product_f_id', ProdCtr.fetchProdId);
}

const sale = async (app) => {
    app.post('/sale_i', Sale.createSale)
    app.put('/sale_e', Sale.updateSale)
}
const user = async (app) => {
    app.post('/user_i', User.createUser)
    // app.put('/user_e', authentication, User.updateUser) //authenticate first
    app.put('/user_e', User.updateUser)
    app.get('/user_f', User.fetchUser)
}
const customer = async (app) => {
    app.post('/customer_i', Customer.createCustomer)
    app.put('/customer_e', Customer.updateCustomer)
    app.get('/customer_f', Customer.fetchCustomer)
}
const txntype = async (app) => {
    app.post('/txn_type_i', TxnType.createTxnType)
    app.put('/txn_type_e', TxnType.updateTxnType)
    app.get('/txn_type_f', TxnType.fetchTxnType)
}
const txn = async (app) => {
    app.post('/txn_i', Txn.createTxn)
    app.put('/txn_e', Txn.updateTxn)
    app.get('/txn_f', Txn.fetchTxn)
}
const txnHis = async (app) => {
    app.post('/txn_his_i', TxnHis.createTxnHis)
    app.put('/txn_his_e', TxnHis.updateTxnHis)
    app.get('/txn_his_f', TxnHis.fetchTxnHis)
}
const authenticate = async (app) => {
    app.post('/mem_auth', Auth.Authmember)
    app.post('/cus_auth', Auth.Authcustomer)
}
const login = async (app) => {
    app.get('/login', Login.login)
}
const userorder=async (app)=>{
    app.post('/order_i',OrderUser.createOrder)
    app.get('/order_f',OrderUser.fetchOrder)
}
const updateUserInfo=async (app)=>{
    app.post('/username_e',UserInfo.updateUserName)
    app.post('/usertel_e',UserInfo.updateTel)
    app.post('/userpass_e',UserInfo.updatePassword)
    app.post('/useremail_e',UserInfo.updateEmail)
    app.post('/userbalance_f',UserInfo.balanceInquiry)
    app.post('/resetpassword_e',UserInfo.resetPasswordByPhone)
}
const fetchStockCategory=async (app)=>{
    app.get('/stockcate_f',StockCate.fetchStockCategory)

}
const stockAction=async (app)=>{
    app.post('/stock_action_i',StockMethod.createStockTransaction)

}
const userIbox=async (app)=>{
    app.get('/user_inbox_f',UserInbox.fetchInbox)
    app.post('/user_inbox_markreaded_u',UserInbox.markReaded)

}
const registerCus=async (app)=>{

    app.post('/register_i',RegisterCustomer.createCustomer)

}
const card=async (app)=>{

    app.post('/card_x',Card.deleteCard)
    app.get('/card_f',Card.fetchCard)

}
function authentication(req, res, next) {
    console.log("Middleware");
    const authHeader = req.headers['authorization']
    console.log("Middleware header: "+authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    console.log("Middleware: "+token);
    if (token == null) return res.sendStatus(401).send('Invalid token null')
    jwt.verify(token, Token.actksecret, (er, user) => {
        if (er) return res.send('Token invalid or expired!').status(403)//res.sendStatus(403).send('invalid')
        console.log(user);
        req.user = user;
        next()
    })
}

module.exports = {
    category,
    product,
    sale,
    user,
    login,
    upload,
    customer,
    txntype,
    txn,
    txnHis,
    authenticate,
    userorder,
    updateUserInfo,
    fetchStockCategory,
    stockAction,
    userIbox,
    registerCus,
    card,
}