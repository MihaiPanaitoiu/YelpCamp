//require mongoose
const mongoose = require('mongoose');
const {campgroundSchema} = require("../schemas");
const Review = require('./review')

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

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
       const res = await Review.deleteMany({_id: {$in:doc.reviews}})
        console.log(res)
    }
})

//exporting our Campground model
module.exports = mongoose.model('Campground', CampgroundSchema);