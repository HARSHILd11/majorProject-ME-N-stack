const express=require("express");

const app= express();

app.listen(8080,()=>{
    console.log("connected to localhost 8080");

});

app.get("/",(req,res)=>{
    res.send("HEllO USER")
});

const mongoose=require("mongoose");

async function main(){
   await mongoose.connect('mongodb+srv://wanderlust:HarshilDBwanderlust@wanderlust.2jkdvuk.mongodb.net/');
};

main().then((res)=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

//require listing from models  
const   Listing=require("./models/listing.js")


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

//crude operations 

const path =require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

// index route]

app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});

    res.render("./listings/index.ejs" ,{allListings}); 
})


//create new listing create route 
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})
//show route 


app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;

    const listing= await Listing.findById(id)

    res.render("./listings/show.ejs",{listing});

})

app.post("/listings",async(req,res)=>{
   
    
    let listing=new Listing(req.body);
   await  listing.save();
   res.redirect("/listings")
   
  
});

//update route

app.get("/listings/:id/edit",async(req,res)=>{
  
     let {id}= req.params;

    const listing= await Listing.findById(id)
    console.log(listing.image.url);
    res.render("./listings/edit.ejs",{listing});

})

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//
app.put("/listings/:id" ,async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings")
})

// delete route

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   
    res.redirect("/listings")
})