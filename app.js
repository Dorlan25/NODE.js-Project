var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var flash          = require("connect-flash");
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
var Campground     = require("./models/campground");
var Comment        = require("./models/comment");
var User           = require("./models/user");
var seedDB         = require("./seeds");
var methodOverride = require("method-override");

//Requiring routes
var commentRoutes      = require("./routes/comments");
var campgroundsRoutes  = require("./routes/campground");
var indexRoutes        = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://robert:963852741Ira*@yelpcamp-rheyy.mongodb.net/test?retryWrites=true&w=majority", {
	
// }).then(() =>{
// 	console.log("Connected to db");
// }).catch(err => {
// 	console.log("Error: ", err.message);
// });
//mongodb+srv://robert:<password>@yelpcamp-rheyy.mongodb.net/test?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "dilan is good", 
	resave: false, 
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, function(){
	console.log("Yelp Camp listening on port 3000");
});