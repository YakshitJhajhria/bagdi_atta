import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDistributorApplication extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  gstNumber: string;
  expectedMonthlyVolume: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const DistributorApplicationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    expectedMonthlyVolume: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const DistributorApplication: Model<IDistributorApplication> =
  mongoose.models.DistributorApplication ||
  mongoose.model<IDistributorApplication>('DistributorApplication', DistributorApplicationSchema);

export default DistributorApplication;
