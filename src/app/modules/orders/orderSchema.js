import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quantity : {
        type : Number,
        require : true
    },
    price : {
        type : Number,
        required : true
    }
})

export default orderSchema