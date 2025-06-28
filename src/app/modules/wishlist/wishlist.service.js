import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import wishlistSchema from "./wishlistSchema.js";
const Wishlish = mongoose.model("Wishlist",wishlistSchema)

const addWishlist = catchAsync( async (req, res) => {
    try {
        const { userId, productId} = req.body;

        const existing = await Wishlish.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({ message: "This product is already in your wishlist." });
        }

        const wishlist = new Wishlish({ userId, productId,});
        await wishlist.save();

        res.status(201).json({ message: "Added to your wishlist.", wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getWishlistByUserId = catchAsync( async (req, res) => {
    try {
        const { userId} = req.params;

        const wishlist = await Wishlish.findOne({ userId });
        
        res.status(201).json( wishlist );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getAllWishList = catchAsync( async (req, res) => {
    try {

        const wishlists = await Wishlish.find();
        
        res.status(201).json( wishlists );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export const wishlistService = {
    addWishlist,
    getWishlistByUserId,
    getAllWishList
}