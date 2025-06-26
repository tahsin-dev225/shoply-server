import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    category : {
        type : String,
        require : true
    }
})

export default categorySchema