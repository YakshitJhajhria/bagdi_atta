import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantityKey: string;
  quantity: number;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'distributor' | 'admin';
  phone?: string;
  address?: string;
  cart: ICartItem[];
  wishlist: string[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'customer',
      enum: ['customer', 'distributor', 'admin'],
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    cart: [
      {
        productId: { type: String, required: true },
        quantityKey: { type: String, required: true },
        quantity: { type: Number, default: 1, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        categorySlug: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    wishlist: [{ type: String }],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
