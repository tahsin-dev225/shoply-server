import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true,
        unique: true,
    },
    price : {
        type : Number,
        required : true
    }
})

export default orderSchema