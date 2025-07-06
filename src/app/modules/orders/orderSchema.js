import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        }
      }
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "courier", "delivered", "cancelled"],
      default: "processing",
    },

    // 💰 Optional: Total price calculation
    totalPrice: {
      type: Number,
    },

    // 🚚 Optional: for future
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "sslcommerz"],
      default: "cash",
    },

    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default orderSchema;
