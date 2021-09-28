//requiring express
const express = require('express');
//requiring path
const path = require('path');
//requiring mongoose
const mongoose = require('mongoose');
//requiring ejs-mate
const ejsMate = require('ejs-mate');
// //requiring joi validation middleware
// const Joi = require('joi');
// //requiring our Joi validation schema
// const { campgroundSchema, reviewSchema } = require('./schemas.js')
// //requiring our Async ulitily
// const catchAsync = require('./utils/catchAsync');
//requiring our custom ExpressError
const ExpressError = require('./utils/ExpressError')
// //requiring our model that we exported
// const Campground = require('./models/campground');
// //requiring reviews model
// const Review = require('./models/review');
//requiring method override middleware
const methodOverride = require('method-override');
// const { validate } = require('./models/campground');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


//connecting mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });


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

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


//home route get
app.get('/', (req, res) => {
    res.render('home')
});


app.all('/*', (req, res, next)=> {
    next(new ExpressError('Page not found', 404))
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! something went wrong'
    res.status(statusCode).render('error', { err });
})


//listening to port 3000
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
});
