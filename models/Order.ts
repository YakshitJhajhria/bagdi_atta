import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantityKey: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  quantity: string; // Summary string for backwards compatibility, e.g. "10kg" or "5kg x 2, 25kg x 1"
  price: number; // Total order price
  paymentMethod: 'COD' | 'WHATSAPP';
  status: 'pending' | 'confirmed' | 'rejected';
  orderType: 'D2C' | 'DISTRIBUTOR';
  userId?: mongoose.Types.ObjectId;
  gstNumber?: string;
  companyName?: string;
  items?: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      default: 'Whole Wheat Atta',
    },
    quantity: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'WHATSAPP'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'rejected'],
    },
    orderType: {
      type: String,
      default: 'D2C',
      enum: ['D2C', 'DISTRIBUTOR'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    gstNumber: {
      type: String,
    },
    companyName: {
      type: String,
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantityKey: { type: String, required: true },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
