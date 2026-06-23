import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  size: string; // e.g. "5kg", "10kg", "1L"
  price: number; // Retail price
  wholesalePrice: number; // Distributor price
  stock: number; // Inventory stock count
}

export interface IProductFact {
  label: string; // e.g. "Protein"
  value: string; // e.g. "12g"
}

export interface IProductSpec {
  label: string; // e.g. "Shelf Life"
  value: string; // e.g. "3 Months"
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  variants: IProductVariant[];
  nutritionalFacts: IProductFact[];
  specifications: IProductSpec[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        wholesalePrice: { type: Number, required: true },
        stock: { type: Number, default: 0, required: true },
      },
    ],
    nutritionalFacts: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    specifications: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
