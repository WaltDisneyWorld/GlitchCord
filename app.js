const expressSession = require("express-session");
const methodOverride = require("method-override");
const http           = require("http");
const socketIO       = require("socket.io");
const bodyParser     = require("body-parser");
const express        = require("express");
const passport       = require("passport");
const LocalStrategy  = require("passport-local");
const mongoose       = require("mongoose");
const flash          = require("req-flash");
const User           = require("./models/user");
const config         = require("./config/config");
const passportStrategy = require("./config/passport");
const indexRoute     = require("./routes/index");
const userRoute      = require("./routes/user");
const channelRoute   = require("./routes/channel");
const ajaxRoute      = require("./routes/ajax");

const app            = express();
const server         = http.createServer(app);
const io             = socketIO(server);
var cookieParser = require('cookie-parser')
const rateLimit = require("express-rate-limit");
 
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
app.use(limiter);
// Configure IO
require("./io/index")(io);
require("string.prototype.safe");

function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps);

// Configure app and mongoose
app.use(express.static(__dirname + "/public"));
var cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.set("view engine", "ejs");
mongoose.Promise = global.Promise;


// boot if db is available
mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        // boot
        server.listen(config.port, ()=>{
            console.log("listenning on " + config.port);
        });
    })
    .catch((dbErr)=>{
        console.log("DB Connection Error: ", dbErr.message);
        process.exit(1);
    });

// seedDB;

// Passport configuration
app.use((expressSession)({
    secret: "a4fw8542071f-c33873-443447-8ee2321",
    resave: false,
    saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());

// Login Strategy
passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, passportStrategy.localSiginStrategy));

// Sign UP Strategy
passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, passportStrategy.localSignupStrategy));

// used to serialize the user for the session
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user);
    });
});

app.use(flash());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    next();
});
// Routes
app.use("/", indexRoute);
app.use("/users", userRoute);
app.use("/channel", channelRoute);
app.use(ajaxRoute);
app.get('*', function(req, res){
    res.status(404).send('<body style="background-color:black;"><center><a href="https://http.cat"><img src="https://http.cat/404"></a></center>');
  });

