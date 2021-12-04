const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const Transaction = require('../models/Transaction');


router.get('/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await Transaction.find({user: userId}).sort({created_at: -1});
        res.status(200).send({result});
    } catch (e) {
        res.status(500).send({err: e});

    }
});

router.post('/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const payload = req.body;
        payload.user = userId;

        const transaction = new Transaction(payload);
        await transaction.save();

        res.status(200).send({success: true, data: transaction});
    } catch (err) {
        res.status(500).send({err: err});
    }
});

module.exports = router;