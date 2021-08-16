//requiring mongoose
const mongoose = require('mongoose');
//requiring our model that we exported
const Campground = require('../models/campground')

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


//deleting everything in the database
const seedDB = async () => {
    await Campground.deleteMany({});
    const c = new Campground({ title: 'purple field' });
    await c.save();
}

seedDB();