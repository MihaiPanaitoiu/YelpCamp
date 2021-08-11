const express = require('express');
const app = express();
const path = require('path');

// const mongoose = require('mongoose');
// const methodOverride = require('method-override');

// const Product = require('./models/product');

// mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('MONGO connection OPEN!')
//     })
//     .catch(err => {
//         console.log("oh no !MONGO connection error")
//         console.log(err);
//     })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(express.urlencoded({ extended: true }))
// app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})


app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
})