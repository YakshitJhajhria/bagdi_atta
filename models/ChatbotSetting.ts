import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatbotSetting extends Document {
  welcomeMessage: string;
  moq: string;
  distributor: string;
  shipping: string;
  returns: string;
  products: string;
  whatsapp: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatbotSettingSchema: Schema = new Schema(
  {
    welcomeMessage: {
      type: String,
      default: 'Hello! Welcome to Bagdi Atta support. How can I help you today? Feel free to select one of the quick options below or ask your question directly!',
      required: true,
    },
    moq: {
      type: String,
      default: 'Our wholesale B2B distributor orders require a **Minimum Order Quantity (MOQ) of 100 kg** total weight. You can mix and match different sizes (5kg, 10kg, 25kg) and products (Atta, Oils, Pulses) to meet this minimum.',
      required: true,
    },
    distributor: {
      type: String,
      default: 'To become a distributor, please visit our **[Distributor Portal](/distributor/apply)** and submit the application form. Our admin team will review and approve your application within 24-48 hours. Once approved, you can login to access wholesale pricing.',
      required: true,
    },
    shipping: {
      type: String,
      default: 'We offer **free home delivery** on all retail (D2C) orders. Orders are typically processed and shipped within 24-48 hours. B2B wholesale shipping and transit freight terms are coordinated upon order confirmation.',
      required: true,
    },
    returns: {
      type: String,
      default: 'We stand by our quality and offer a **7-day return policy**. If you receive a damaged packet or are unsatisfied with the quality, please contact us on WhatsApp with your Order ID, and we will initiate a free replacement or refund.',
      required: true,
    },
    products: {
      type: String,
      default: 'We offer premium organic staple products:\n- **Bagdi Atta** (5kg, 10kg, 25kg) — traditional stone-ground wheat flour\n- **Mustard Oil** (1L, 5L) — wood-pressed cold-extracted oil\n- **Moong Dal** (1kg, 2kg) — organic unpolished split yellow pulse\n\nYou can browse all items on our **[Products Catalog](/products)** page.',
      required: true,
    },
    whatsapp: {
      type: String,
      default: 'Need immediate human support? You can reach us directly on WhatsApp at **[+91 98765 43210](https://wa.me/919876543210)**. We are active from 9 AM to 8 PM daily.',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const ChatbotSetting: Model<IChatbotSetting> =
  mongoose.models.ChatbotSetting || mongoose.model<IChatbotSetting>('ChatbotSetting', ChatbotSettingSchema);

export default ChatbotSetting;
