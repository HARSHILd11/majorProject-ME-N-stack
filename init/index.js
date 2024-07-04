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
   initData.data=initData.data.map((obj)=>({...obj,owner:"668646a20e87016f2bd84bbc"}))
   await Listing.insertMany(initData.data);
   console.log("data was initialized");

 }

 initDB();