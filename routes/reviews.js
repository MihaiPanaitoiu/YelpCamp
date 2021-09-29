const express = require('express');
const router  = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews')



//POST review route
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//delete route for reviews. Delete the reviews and the object id from the reviews array
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;