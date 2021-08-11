//require mongoose
const mongoose = require('mongoose');

//adding shortcut for mongoose.Schema
const Schema = mongoose.Schema;

//creating our Campground Scema
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

//exporting our Campground model
module.exports = mongoose.model('Campground', CampgroundSchema);