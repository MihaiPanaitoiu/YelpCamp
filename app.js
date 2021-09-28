//requiring express
const express = require('express');
//requiring path
const path = require('path');
//requiring mongoose
const mongoose = require('mongoose');
//requiring ejs-mate
const ejsMate = require('ejs-mate');
//requiring joi validation middleware
const Joi = require('joi');
//requiring our Joi validation schema
const { campgroundSchema, reviewSchema } = require('./schemas.js')
//requiring our Async ulitily
const catchAsync = require('./utils/catchAsync');
//requiring our custom ExpressError
const ExpressError = require('./utils/ExpressError')
//requiring our model that we exported
const Campground = require('./models/campground');
//requiring reviews model
const Review = require('./models/review');
//requiring method override middleware
const methodOverride = require('method-override');
const { validate } = require('./models/campground');

const campgrounds = require('./routes/campgrounds');


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

// const validateCampground = (req, res, next) => {
//     //defining our campgroundSchema, that will validate the data before sending it to mongoose
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.use('/campgrounds', campgrounds);


//home route get
app.get('/', (req, res) => {
    res.render('home')
});

// //basic index route
// app.get('/campgrounds', catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds })
// }));
//
// //route to get the form to add a new campground
// app.get('/campgrounds/new', (req, res) => {
//     res.render('campgrounds/new')
// });
//
// //post request to send the data from the form
// app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
//     // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 500)
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
//
// //show route
// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate('reviews');
//     res.render('campgrounds/show', { campground })
// }));
//
// //route to get the edit form
// app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     res.render('campgrounds/edit', { campground })
// }));
//
// //PUT request to send the data from the edit form
// app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     //finding by id and updating the campground. Using the spread method to get the title
//     // and location which we sent them both in the [campground] in name in the form
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     res.redirect(`/campgrounds/${campground._id}`)
// }));
//
// //DELETE REQUEST
// app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds')
// }));

//POST review route
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete route for reviews. Delete the reviews and the object id from the reviews array
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

// app.all('*', (req, res, next)) => {
//     next(new ExpressError('Page not found', 404))
// }

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
