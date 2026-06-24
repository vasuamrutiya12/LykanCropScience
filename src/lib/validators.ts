import { z } from 'zod';
import { BUSINESS_TYPES, CATEGORIES, PAYMENT_METHODS } from './constants';

export const inquirySchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  whatsapp: z.string().optional(),
  sameAsMobile: z.boolean().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  businessType: z.enum(BUSINESS_TYPES),
  message: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string().optional(),
        brandName: z.string(),
      })
    )
    .default([]),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(10),
});

export const productSchema = z.object({
  brandName: z.string().min(1),
  technicalName: z.string().optional(),
  category: z.enum(CATEGORIES),
  dose: z.string().optional(),
  packingSizes: z
    .array(
      z.object({
        size: z.string().min(1),
        price: z.number().min(0).default(0),
        mrp: z.number().min(0).default(0),
      })
    )
    .default([]),
  pricePerPacking: z.record(z.number()).optional(),
  details: z
    .union([
      z.string(),
      z.object({
        en: z.string().default(''),
        gu: z.string().optional(),
        hi: z.string().optional(),
      }),
    ])
    .optional(),
  imageUrl: z.string().optional(),
  cloudinaryId: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    cloudinaryId: z.string(),
  })).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const deliverySchema = z.object({
  customerName: z.string().min(2),
  firmName: z.string().optional(),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  whatsapp: z.string().optional(),
  street: z.string().min(5),
  city: z.string().min(2),
  district: z.string().min(2),
  state: z.string().min(2),
  pin: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN'),
  deliveryNotes: z.string().optional(),
});

export const orderSchema = z.object({
  ...deliverySchema.shape,
  items: z
    .array(
      z.object({
        productId: z.string(),
        brandName: z.string(),
        packingSize: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    )
    .min(1),
  paymentMethod: z.enum(PAYMENT_METHODS),
  subtotal: z.number(),
  total: z.number(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(1),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type DeliveryInput = z.infer<typeof deliverySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
