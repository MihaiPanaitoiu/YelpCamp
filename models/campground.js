//require mongoose
const mongoose = require('mongoose');

//adding shortcut for mongoose.Schema
const Schema = mongoose.Schema;

//creating our Campground Scema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

//exporting our Campground model
module.exports = mongoose.model('Campground', CampgroundSchema);