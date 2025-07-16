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

    // 💰 Optional: Total price calculation
    status: {
      type: String,
      enum: ["processing", "courier", "delivered", "cancelled"],
      default: "processing",
    },
    cancleReason: {
      type: String,
    },

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
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      thana: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      houseNumber: {
        type: String,
        default : ''
      },
    },
  },
  {
    timestamps: true,
  }
);

export default orderSchema;
