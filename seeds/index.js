//requiring mongoose
const mongoose = require('mongoose');
//requiring our model that we exported
const Campground = require('../models/campground');
//requiring cities file
const cities = require('./cities');
//requiring descriptors and places
const { descriptors, places } = require('./seedHelpers')

//connecting mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

//adding logic to check if there is an error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

//function where we pass an array and get a random element from the array
const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    //deleting everything in the database
    await Campground.deleteMany({});
    //looping over seeds files and getting 50 new entries in the db
    for (let i = 0; i < 50; i++) {
        //generate random number from 1 to 1000
        const random1000 = Math.floor(Math.random() * 1000);
        //creating a new campground each time this is looped
        const camp = new Campground({
            //adding a location from cities.js
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            //adding a title from seedHelpers.js
            title: `${sample(descriptors)} ${sample(places)}`
        })
        //awaiting saving the campgrounds in db
        await camp.save();
    }
}

//executing seedDB and closing the connection
seedDB().then(() => {
    mongoose.connection.close()
});