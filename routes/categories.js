const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// For getting all records from Collection
router.post('/add', async (req, res) => {

    const addcat = new Category({
        categoryname: req.body.categoryName  //check the req obj
    });
    try {
        const savedCategory = await addcat.save();
        res.json({
            statuscode: 200,
            bodymsg: savedCategory
        });
    } catch (err) {
        res.json({ message: err });
    }
})

router.get('/getall', async (req, res) => {
    console.log("req", req.body)
    try {
        Category.find({}, function (err, categories) {
            res.json({
                statuscode: 200,
                bodymsg: categories
            });
        });
    } catch (err) {
        res.json({ message: err });
    }
})


module.exports = router;