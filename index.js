//requiring express
const express = require('express');
//requiring path
const path = require('path');
//requiring mongoose
const mongoose = require('mongoose');
//requiring our model that we exported
const Campground = require('./models/campground')
// const methodOverride = require('method-override');

// const Product = require('./models/product');

//connecting mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

//adding logic to check if there is an error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

//executing express    
const app = express();

//setting view engine to ejs and setting the path to the view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(express.urlencoded({ extended: true }))
// app.use(methodOverride('_method'));


//home route get
app.get('/', (req, res) => {
    res.render('home')
})

//making and saving new campgrund
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My backyard', description: 'Cheap camping' });
    await camp.save();
    res.send(camp)
})




//listening to port 3000
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
})

//this is a test push from the staging branch