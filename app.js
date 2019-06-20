require("dotenv").config();

var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    seedDB                = require("./seeds");

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/Yelp_Camp_final", {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG.
app.use(require("express-session")({
    secret: "You are hacked.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;      //to use value of currentUser in every route
    // res.locals.message = req.flash("error");      //to use value of message in every route
    res.locals.error = req.flash("error");      //to use value of message in every route
    res.locals.success = req.flash("success");      //to use value of message in every route
    next();
});

//Seed the database
// seedDB();

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started."); 
});