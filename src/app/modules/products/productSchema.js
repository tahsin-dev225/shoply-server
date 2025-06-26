import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
    },

    // ⭐ NEW FIELDS BELOW

    // Rating out of 5
    rating: {
        type: Number,
        default: 0, // future use
        min: 0,
        max: 5,
    },

    // How many users rated
    numReviews: {
        type: Number,
        default: 0,
    },

    // Stock availability
    inStock: {
        type: Boolean,
        default: true,
    },

    // Total sales (for popularity)
    sold: {
        type: Number,
        default: 0,
    },

    // Featured product
    isFeatured: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true 
})

export default productSchema