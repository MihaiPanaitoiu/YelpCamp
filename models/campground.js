//require mongoose
const mongoose = require('mongoose');
const {campgroundSchema} = require("../schemas");
const Review = require('./review')

//adding shortcut for mongoose.Schema
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
   return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };
//creating our Campground Scema
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong>
                <a href="/campgrounds/${this._id}">${this.title}</a>
            </strong>
            <p>
                ${this.description.substring(0,20)}...
            </p>`
})


CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
       const res = await Review.deleteMany({_id: {$in:doc.reviews}})
        console.log(res)
    }
})

//exporting our Campground model
module.exports = mongoose.model('Campground', CampgroundSchema);