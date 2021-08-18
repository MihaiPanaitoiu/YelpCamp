//requiring express
const express = require('express');
//requiring path
const path = require('path');
//requiring mongoose
const mongoose = require('mongoose');
//requiring ejs-mate
const ejsMate = require('ejs-mate');
//requiring our model that we exported
const Campground = require('./models/campground');
// const campground = require('./models/campground');
//requiring method override middleware
const methodOverride = require('method-override');

// const Product = require('./models/product');

//connecting mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

// mongoose.set('useFindAndModify', false);

//adding logic to check if there is an error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

//executing express    
const app = express();

//telling express this is the ejs engine we want to use
app.engine('ejs', ejsMate);
//setting view engine to ejs and setting the path to the view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//using the express urlencoded to parse the req.body
app.use(express.urlencoded({ extended: true }));
//using the method override middleware and setting the string I want to use
//method used to send the PUT/DELETE requests
app.use(methodOverride('_method'));


//home route get
app.get('/', (req, res) => {
    res.render('home')
});

//basic index route
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

//route to get the form to add a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});

//post request to send the data from the form
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

//show route
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
});

//route to get the edit form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
});

//PUT request to send the data from the edit form
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    //finding by id and updating the campground. Using the spread method to get the title
    // and location which we sent them both in the [campground] in name in the form
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

//DELETE REQUEST
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})


//listening to port 3000
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
});
