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

        const result = await Cart.updateOne({user: req.params.userId}, { $set: {...payload} }, { upsert: true });

        res.status(200).send({success: true});
    } catch (err) {
        res.status(500).send({err: err})
    }
});

module.exports = router;