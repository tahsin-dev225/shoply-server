import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import wishlistSchema from "./wishlistSchema.js";
const Wishlish = mongoose.model("Wishlist",wishlistSchema)

const addWishlist = catchAsync( async (req, res) => {
        const { userId, productId} = req.body;

        const existing = await Wishlish.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({ message: "This product is already in your wishlist." });
        }

        const wishlist = new Wishlish({ userId, productId,});
        await wishlist.save();

        res.status(201).json({ message: "Added to your wishlist.", wishlist });
});

const getWishlistByUserId = catchAsync( async (req, res) => {
        const { userId} = req.params;

        const wishlist = await Wishlish.find({ userId });
        
        res.status(201).json( wishlist );
});

const getSingleWishlist = catchAsync( async (req, res) => {
        const { userId,productId} = req.query;

        const wishlist = await Wishlish.find({ userId });
        
        res.status(201).json( wishlist );
});

const getAllWishList = catchAsync( async (req, res) => {
        const wishlists = await Wishlish.find();
        
        res.status(201).json( wishlists );
});

export const wishlistService = {
    addWishlist,
    getWishlistByUserId,
    getAllWishList
}