const mongoose=require("mongoose");

const Schema=mongoose.Schema;


const listingSchema=new Schema({
    title:{
        type:String,
        requires:true,

    },
    description:String,
    image:{
        type:Object,
        default:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBjb2N1bnV0JTIwdHJlZXxlbnwwfHwwfHx8MA%3D%3D",

        set:(v)=>v===""?"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBjb2N1bnV0JTIwdHJlZXxlbnwwfHwwfHx8MA%3D%3D":v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;

