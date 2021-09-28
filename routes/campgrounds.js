const express = require('express');
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const router  = express.Router();
//requiring our custom ExpressError
const ExpressError = require('../utils/ExpressError')
const {campgroundSchema} = require("../schemas.js");

const validateCampground = (req, res, next) => {
    //defining our campgroundSchema, that will validate the data before sending it to mongoose
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//basic index route
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

//route to get the form to add a new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
});

//post request to send the data from the form. creating a new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 500)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//show route
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground })
}));

//route to get the edit form
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}));

//PUT request to send the data from the edit form
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    //finding by id and updating the campground. Using the spread method to get the title
    // and location which we sent them both in the [campground] in name in the form
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

//DELETE REQUEST
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));


module.exports = router;