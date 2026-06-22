import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  PaymentMethod,
  PaymentStatus,
  DeliveryStatus,
} from '@/lib/constants';

export interface IOrderItem {
  productId: string;
  brandName: string;
  packingSize: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  firmName?: string;
  mobile: string;
  whatsapp?: string;
  address: {
    street: string;
    city: string;
    district: string;
    state: string;
    pin: string;
  };
  deliveryNotes?: string;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  deliveryStatus: DeliveryStatus;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: Date;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    firmName: { type: String },
    mobile: { type: String, required: true },
    whatsapp: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, required: true },
    },
    deliveryNotes: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        brandName: { type: String, required: true },
        packingSize: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'bank_transfer', 'pay_on_delivery'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    deliveryStatus: {
      type: String,
      enum: [
        'Order Placed',
        'Confirmed',
        'Processing',
        'Dispatched',
        'Out for Delivery',
        'Delivered',
      ],
      default: 'Order Placed',
    },
    trackingNumber: { type: String },
    courierName: { type: String },
    estimatedDelivery: { type: Date },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ mobile: 1 });
OrderSchema.index({ deliveryStatus: 1, createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
