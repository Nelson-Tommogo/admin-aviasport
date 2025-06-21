
import { Schema, model } from "mongoose";

const SparePartsSchema = Schema({
    name: { type: String, required: true },
    brand:{ type: String, required: true },
    price:{ type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
  });

const SparePart = model("SparePart", SparePartsSchema);

export default SparePart;