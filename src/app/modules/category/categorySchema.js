import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
});

export default categorySchema;
