if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


//requiring express
const express = require('express');
//requiring path
const path = require('path');
//requiring mongoose
const mongoose = require('mongoose');
//requiring ejs-mate
const ejsMate = require('ejs-mate');
//requiring express session
const session = require('express-session');
//requiring flash
const flash = require('connect-flash');
//requiring our custom ExpressError
const ExpressError = require('./utils/ExpressError');
//requiring method override middleware
const methodOverride = require('method-override');
//requiring our files where we set the routers
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//requiring routers files
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


//connecting mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });


//adding logic to check if there is an error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

//executing express    
const app = express();

//telling express this is the ejs engine we want to use
app.engine('ejs', ejsMate);
//setting view engine to ejs and setting the path to the view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//using the express urlencoded to parse the req.body
app.use(express.urlencoded({ extended: true }));
//using the method override middleware and setting the string I want to use
//method used to send the PUT/DELETE requests
app.use(methodOverride('_method'));
//using public folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//using session and configuring it
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//using our routers
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


//home route get
app.get('/', (req, res) => {
    res.render('home')
});


app.all('/*', (req, res, next)=> {
    next(new ExpressError('Page not found', 404))
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! something went wrong'
    res.status(statusCode).render('error', { err });
})


//listening to port 3000
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
});
