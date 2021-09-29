const express = require('express');
const router  = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');



//POST review route
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete route for reviews. Delete the reviews and the object id from the reviews array
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router;