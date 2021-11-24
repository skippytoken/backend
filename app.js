const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));
//Import Routes
const userRoute = require('./routes/users');
const categoryRoute = require('./routes/categories');
const subcategoryRoute = require('./routes/subcategories');
const subcatRoute = require('./routes/subcategories');
const productRoute = require('./routes/products');
const connectToDB = require('./config/dbConfig')
const OrderRoute = require('./routes/order')




// Connect To DB
mongoose.connect("mongodb+srv://skippyadmin:SkippyTOKEN2021mongo@cluster0.zcbuw.mongodb.net/skippytoken?retryWrites=true&w=majority"
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(res => {
    console.log("Mongo Db is Connected")
  })
  .catch(err => {
    console.log(err)
  })
//     process.env.DB_CONNECTION,
//     { useUnifiedTopology: true, useNewUrlParser: true }, 
//     () => console.log('Connected to DB!'))

// app.listen(port, () => console.log(`Server listening on the port::${port}`));

// connectToDB().then(_ => {
//   app.listen(PORT, _ => {
//     console.log(`Server started on port ${PORT}`)
//   })
// })

//routes redirect
app.use('/user', userRoute)
app.use('/category', categoryRoute)
app.use('/subcategory', subcategoryRoute)
app.use('/product', productRoute)
app.use('/order', OrderRoute)
//Routes
app.get('/', (req, res) => {
  res.send('Backend for Ecommerce')
})

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})
