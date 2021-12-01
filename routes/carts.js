const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const Cart = require('../models/Carts');


router.get('/checkout/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await Cart.findOne({user: userId});
        res.status(200).send({result})
    } catch (e) {
        res.status(500).send({err: e})

    }
});

router.post('/checkout/:userId', authenticate, async (req, res) => {
    try {
        const payload = req.body;
        payload.user = req.params.userId;
        console.log('payload: ', payload);
        const result = await Cart.updateOne({user: userId}, { $set: payload }, { upsert: true });
        res.status(200).send({success: true});
    } catch (e) {
        res.status(500).send({err: e})
    }
});

module.exports = router;