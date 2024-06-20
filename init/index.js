const mongoose= require("mongoose");

const initData=require("./data.js");

const Listing=require("../models/listing.js");
async function main(){
    await mongoose.connect('mongodb+srv://wanderlust:HarshilDBwanderlust@wanderlust.2jkdvuk.mongodb.net/');
 };
 
 main().then((res)=>{
     console.log("connection successful");
 }).catch((err)=>{
     console.log(err);
 });
 
 //create a function init database

 const initDB =async ()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(initData.data);
   console.log("data was initialized");

 }

 initDB();