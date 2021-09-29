const express = require('express');
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const router  = express.Router();
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');



//basic index route

router.get('/', catchAsync(campgrounds.index));

//route to get the form to add a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//post request to send the data from the form. creating a new campground
router.post('/', isLoggedIn, catchAsync(campgrounds.createCampground))

//show route
router.get('/:id', catchAsync(campgrounds.showCampground));

//route to get the edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//PUT request to send the data from the edit form
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

//DELETE REQUEST
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;