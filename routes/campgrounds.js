const express = require('express');
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const router  = express.Router();
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');




//basic index route

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

//route to get the form to add a new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

//post request to send the data from the form. creating a new campground
router.post('/', isLoggedIn, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//show route
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}));

//route to get the edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}));

//PUT request to send the data from the edit form
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

//DELETE REQUEST
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds')
}));


module.exports = router;