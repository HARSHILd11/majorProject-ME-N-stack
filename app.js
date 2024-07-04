const express = require("express");

const app = express();
const session = require("express-session");
const flash = require("connect-flash");


app.listen(8080, () => {
    console.log("connected to localhost 8080");

});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

const user = require("./models/user.js")
app.use(session({ secret: "mysupersecrate", resave: false, saveUninitialized: true }));


const sessionConfig = {
    secret: "Mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


app.use(session(sessionConfig));

app.use(flash());

//signup login passport js authentication middleware for node js 

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));//inside passport we create a local strategy to authenticate users and to authenticate them we use user auuthenticate  

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

const mongoose = require("mongoose");

async function main() {
    await mongoose.connect('mongodb+srv://wanderlust:HarshilDBwanderlust@wanderlust.2jkdvuk.mongodb.net/');
};

main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

//require listing from models  
const Listing = require("./models/listing.js");


// //app.get("/testListing", async(req,res)=>{

//     //create a sample listing to check if it is working or not 

//     // let sampleListing=new Listing({
//     //     title:"new home ",
//     //     description:"by the beach ",
//     //     price:1200,
//     //     location:"indore",
//     //     country:"india"

//     // })

//     // await sampleListing.save();
//     // console.log("saved");
//     // res.send("sucessfull");


// })

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
})

//crude operations 

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// index route]

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});

    res.render("./listings/index.ejs", { allListings });
})


//create new listing create route 
app.get("/listings/new", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("listings/new.ejs");
    } else {

        res.redirect("/login");
    }
});

//show route 

// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     next();
// })
app.get("/listings/:id", async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id).populate("review").populate("owner");
  
    const user = await User.findById(req.user?.id)
    console.log(user);
    res.render("./listings/show.ejs", { listing,user });
console.log(listing);


})



app.post("/listings", async (req, res) => {



    let listing = new Listing(req.body);
    await listing.save();

    res.redirect("/listings")



});

//update route

app.get("/listings/:id/edit", async (req, res) => {



    if (req.isAuthenticated()) {
        let { id } = req.params;

        const listing = await Listing.findById(id)
        console.log(listing.image.url);
        res.render("./listings/edit.ejs", { listing });
    } else {

        res.redirect("/login");
    }

})

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect("/listings")
})

// delete route

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    res.redirect("/listings")
})


//templating //ejs-mate 

const ejsMate = require("ejs-mate");
//helps to create many templates 
//navbar 

app.engine('ejs', ejsMate);

//use static files 
app.use(express.static(path.join(__dirname, "/public")))

//reviews
const Review = require("./models/review.js");

app.post("/listings/:id/reviews", async (req, res) => {



    if (req.isAuthenticated()) {
        let listing = await Listing.findById(req.params.id);
        console.log(req.params.id);
        let newReview = new Review(req.body.review);
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();

        console.log("new review saved");
        res.redirect(`/listings/${listing._id}`);
    } else {

        res.redirect("/login");
    }

})


//delete review route 

app.delete(
    "/listings/:id/review/:reviewId", async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    });

//sessions cookies flash ........



// middleware



//demo user

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"harshil@gmail.com",
//         username:"Harshil",

//     })
//   let  registereduser=await  User.register(fakeUser,"helloworld");

//   res.send(registereduser);
// })


app.get("/signup", async (req, res) => {
    res.render("users/signup.ejs");
})


app.post("/signup", async (req, res) => {
    try {
        console.log(req.body);
        let { username, email, password } = req.body; // Assuming password is handled by passport-local-mongoose

        const newUser = new User({ username, email, password });

        const registeredUser = await User.register(newUser, password); // Assuming password is available in req.body
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            return res.redirect("/listings");
        });
    } catch (err) {
        console.error(err);
        res.render("alert.ejs", { msg: err.message }); // Generic error message for now
    }
});


//login 

app.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

app.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {

    res.redirect("/listings");


})

app.get("/logout", (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                console.error(err);
                next(err);
                return res.redirect('/login'); // Redirect to login with error message
            }
            res.redirect("/listings");
        });
    } else {
        res.redirect('/login'); // Redirect to login if already logged out
    }
});

