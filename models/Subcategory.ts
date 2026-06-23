import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema: Schema = new Schema(
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Subcategory: Model<ISubcategory> =
  mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);

export default Subcategory;
