require('dotenv').config()
const express = require("express");
const cors = require("cors");
const Router = require('./router')
const buildApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));// Link uploads folder available via static route
    console.log("DIRNAME " + __dirname);
    app.get("/hello", (req, res) => {
        res.send("Succeed server is ready")
    })
    Router.category(app);
    Router.product(app);
    Router.sale(app);
    Router.user(app);
    Router.customer(app);
    Router.txntype(app);
    Router.txn(app);
    Router.txnHis(app);
    Router.login(app);
    Router.upload(app);
    Router.authenticate(app);
    Router.userorder(app);
    Router.updateUserInfo(app);
    Router.fetchStockCategory(app);
    Router.stockAction(app);
    Router.userIbox(app);
    Router.registerCus(app);
    Router.card(app);
    Router.advertise(app);
    Router.bank(app);
    Router.chatType(app);
    Router.chat(app);
    Router.walletTxn(app);
    return app;
}

module.exports = buildApp;