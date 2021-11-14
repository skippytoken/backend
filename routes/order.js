const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');


router.get('/getAlltheOrders', async (req, res) => {
    try {

        const totalOrders = await Order.find({})
        res.send(totalOrders)


    } catch (e) {

        res.send("Internal Server Error")

    }
})


router.post('/placeOrder', async (req, res) => {
    try {



    } catch (e) {

        console.log(e)
    }
})








module.exports = router