const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const Order = require('../models/Orders');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


router.get('/getAlltheOrders', async (req, res) => {
    try {
        const totalOrders = await Order.find({})
        res.send(totalOrders)
    } catch (err) {
        res.send("Internal Server Error")

    }
});

router.get('/userOrdersdet/:userId', async (req, res) => {
    const userId = req.params.userId || '';
    try {
        const totalOrders = await Order.find({user:ObjectId(userId)})
        // res.send(totalOrders)
        console.log("totalOrderstotalOrders",totalOrders.length);
            return res.json(totalOrders).status(200);
    } catch (e) {
        res.send("Internal Server Error")

    }

});

router.get('/lastOrders',async (req, res) => {
    try {
        let matchCondition = { };
        var weekStart = new Date();
        weekStart.setDate(weekStart.getDate()-7);
        var weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate()-1);
        weekStart.setHours(0,0,0,0);
        weekEnd.setHours(23,59,59,999);
        matchCondition = {"date": {$gte: weekStart,$lt: weekEnd }};
        const totalOrders = await Order.find(matchCondition);
        res.status(200).send({result: totalOrders});
    } catch (err) {
        res.status(400).send({err: err});
    }
});
router.get('/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await Order.find({user: userId}).sort({date: -1});
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/placeOrder', authenticate, async (req, res) => {
    try {
        const payload = req.body;
        const lastOrderId = await Order.aggregate([{ $group : { _id: null, max: { $max : "$orderId" }}}]);
        if (lastOrderId[0] && !lastOrderId[0].max) {
            payload.orderId = 100001;
        } else {
            payload.orderId = parseInt(lastOrderId[0].max) + 1;
        }
        const order = new Order(payload);
        await order.save();
        res.status(200).send({success: true});
    } catch (e) {
        res.status(500).send({err: e, state: "Internal Server Error"});
    }
});




// router.get('/lastOrdersCount', async (req, res) => {
//     console.log('dasdasdasdasdasd')
//     // try {
//     //     const totalOrders = await Order.find({})
//     //     res.send(totalOrders)
//     // } catch (e) {
//     //     res.send("Internal Server Error")

//     // }
// });

// router.get('/userOrdersdet', async (req, res) => {
//     console.log("Helooo yu dadasdasd")
//     // const userId = req.params.id || '';
//     try {
//         const totalOrders = await Order.find({})
//         res.send(totalOrders)
//     } catch (e) {
//         res.send("Internal Server Error")

//     }
// });

module.exports = router;