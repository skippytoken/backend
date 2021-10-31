const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// For getting all records from Collection
router.post('/add', async (req, res) => {
    const addprod = new Product({
        productname: req.body.productname,  //check the req obj
        category: req.body.categoryname,
        subcategory: req.body.subcategoryname,
        mrp: req.body.mrp,
        smallsizeavailqty: req.body.smallSizeAvailability,
        mediumsizeavailqty: req.body.mediumSizeAvailability,
        largesizeavailqty: req.body.largeSizeAvailability,
        xlargesizeavailqty: req.body.xlargeSizeAvailability,
        description: req.body.description,
        specifications: req.body.specification,
        washandcare: req.body.washandcare,
        shipping: req.body.shipping,
        prodImg1: req.body.prodImage1,
        prodImg2: req.body.prodImage2,
        prodImg3: req.body.prodImage3,
        prodImg4: req.body.prodImage4,
        prodImg5: req.body.prodImage5,
    });
    try {
        const savedProduct = await addprod.save();
        // res.json({
        //     statuscode: 200,
        //     bodymsg: savedProduct
        // });
        res.status(200).send({ msg: "New product added successfully" })

    } catch (err) {
        res.status(400).send({ message: err });
    }
})

router.get('/getall', async (req, res) => {
    try {
        Product.find({}, function (err, products) {
            res.json({
                statuscode: 200,
                bodymsg: products
            });
        });
    } catch (err) {
        res.json({ message: err });
    }
})


module.exports = router;