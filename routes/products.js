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
        // xlargesizeavailqty: req.body.xlargeSizeAvailability,
        description: req.body.description,
        specifications: req.body.specification,
        washandcare: req.body.washandcare,
        shipping: req.body.shipping,
        productImages: req.body.productImages
    });
    try {
        const savedProduct = await addprod.save();
        console.log("savedProductsavedProductsavedProduct",savedProduct);
        res.status(200).send({ msg: "New product added successfully", result: savedProduct })

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

router.put('/:id', async (req, res) => {
    try {
        const payload = req.body;
        const producId = req.params.id || null;
        const result = await Product.updateOne({_id: producId}, {$set: {...payload}});
        res.status(200).send({success: true});
    } catch (err) {
        res.status(400).send({err});
    }
})


module.exports = router;