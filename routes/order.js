const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const Order = require('../models/Orders');


router.get('/getAlltheOrders', async (req, res) => {
    try {
        const totalOrders = await Order.find({})
        res.send(totalOrders)
    } catch (e) {
        res.send("Internal Server Error")

    }
});

router.get('/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await Order.find({user: userId})
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(err);
    }
});

router.post('/placeOrder', authenticate, async (req, res) => {
    try {
        const payload = req.body;
        const order = new Order(payload);
        await order.save();
        res.status(200).send({success: true});
    } catch (e) {
        res.status(500).send({err: e, state: "Internal Server Error"});
    }
});

router.get('/lastOrders', async (req, res) => {
    try {
        const { days } = req.query;
        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate() - days);

        let totalOrders = await Order.aggregate([{
            $match: {'date': {$gt: lastDate}}
        }, {
          $count: "date"
        }]);

        totalOrders = totalOrders[0].date;
        res.status(200).send({result: totalOrders});
    } catch (err) {
        res.status(400).send({err: err});
    }
});

module.exports = router;