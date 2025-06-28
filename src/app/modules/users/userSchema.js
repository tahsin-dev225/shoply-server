import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true,
        unique: true,
    },
    role : {
        type : String,
        default : 'user'
    },
    order : {
        type : Number,
        default : 0
    },
    totalSpent : {
        type : Number,
        default : 0
    },
})

export default userSchema