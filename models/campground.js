//require mongoose
const mongoose = require('mongoose');
const {campgroundSchema} = require("../schemas");
const Review = require('./review')

//adding shortcut for mongoose.Schema
const Schema = mongoose.Schema;

//creating our Campground Scema
const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url:String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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