import mongoose, { Schema, Document, Model } from 'mongoose';
import { InquiryStatus, BusinessType } from '@/lib/constants';

export interface IInquiry extends Document {
  customerName: string;
  mobile: string;
  whatsapp?: string;
  city: string;
  state: string;
  businessType: BusinessType;
  message?: string;
  products: { productId?: string; brandName: string }[];
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    whatsapp: { type: String },
    city: { type: String, required: true },
    state: { type: String, default: 'Gujarat' },
    businessType: {
      type: String,
      enum: ['Dealer', 'Retailer', 'Farmer', 'Other'],
      required: true,
    },
    message: { type: String },
    products: [
      {
        productId: { type: String },
        brandName: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
    adminNotes: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

InquirySchema.index({ status: 1, createdAt: -1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
