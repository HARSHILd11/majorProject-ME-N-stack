const express=require("express"
);

const app=express();

const mongoose=require("mongoose");

app.listen(8080,()=>{
    console.log("listening on port 8080");

})

app.get("/",(req,res)=>{
    res.send("welcome");
});

//connect the database 

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}


main().then(()=>{
    console.log("connected to db ");
}).catch((err)=>{
    console.log(err);
})



/// listing 
const Listing=require("./models/listing.js");
const {describe} = require("node:test");

// app.get("/testlisting",async(req,res)=>{
//     let samplelisting=new Listing({
//         title:"My new Villa",
//         describe:"By the beach ",
//         price:1200,location:"Calangute,goa",
//         country:"india"
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successfull");
      
// });

//initlize the data base 
// we will create a folder init we will do all the init part in thata


//index route 

app.get("/listings",(req,res)=>{
    Listing.find({}).then((res)=>{
        console.log(res);
    })
})
