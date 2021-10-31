const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');


// For getting all records from Collection
router.post('/add', async (req, res) => {
    const addcat = new SubCategory({
        subcategoryname: req.body.subCategoryName,
        categoryname: req.body.categoryName  //check the req obj
    });
    try {
        const savedSubCategory = await addcat.save();
        res.json({
            statuscode: 200,
            bodymsg: savedSubCategory
        });
    } catch (err) {
        res.json({ message: err });
    }
})



router.post('/getall', async (req, res) => {
    console.log("req", `${req.body.value}`)
    try {

        const subCat = await SubCategory.find({ categoryname: req.body.value })
        res.status(200).send(subCat)

        // SubCategory.find({}, function (err, subcategories) {
        //     res.json({
        //         statuscode: 200,
        //         bodymsg: subcategories
        //     });
        // });
    } catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;