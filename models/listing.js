// model listing 

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: Object,
        default:" https://cf.bstatic.com/xdata/images/hotel/max1280x900/503764986.jpg?k=d03505f72c94cff3b44d43fb1cd86207ef3d5fa2b546a3e569c5aaf081a5dda6&o=&hp=1", 

        set:(v)=>v===""?" https://cf.bstatic.com/xdata/images/hotel/max1280x900/503764986.jpg?k=d03505f72c94cff3b44d43fb1cd86207ef3d5fa2b546a3e569c5aaf081a5dda6&o=&hp=1":v , //ternary operators
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },

    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
      

    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;