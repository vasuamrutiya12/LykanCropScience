import mongoose, { Schema, Document, Model } from 'mongoose';
import { Category, slugify } from '@/lib/constants';

export interface IProductImage {
  url: string;
  cloudinaryId: string;
}

export interface IPackingSize {
  size: string;
  price: number;
  mrp: number;
}

export interface IProductDetails {
  en: string;
  gu: string;
  hi: string;
}

export interface IProduct extends Document {
  brandName: string;
  technicalName: string;
  slug: string;
  category: Category;
  dose: string;
  packingSizes: IPackingSize[];
  pricePerPacking: Map<string, number>;
  details: IProductDetails;
  imageUrl: string;
  cloudinaryId?: string;
  images: IProductImage[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    brandName: { type: String, required: true, trim: true },
    technicalName: { type: String, default: '' },
    slug: { type: String, unique: true },
    category: {
      type: String,
      enum: ['Insecticide', 'Fungicide', 'Herbicide', 'PGR'],
      required: true,
    },
    dose: { type: String, default: '' },
    packingSizes: [
      {
        size: { type: String, required: true },
        price: { type: Number, default: 0 },
        mrp: { type: Number, default: 0 },
      },
    ],
    pricePerPacking: { type: Map, of: Number, default: {} },
    details: {
      en: { type: String, default: '' },
      gu: { type: String, default: '' },
      hi: { type: String, default: '' },
    },
    imageUrl: { type: String, default: '/images/product-placeholder.svg' },
    cloudinaryId: { type: String },
    images: [{
      url: { type: String, required: true },
      cloudinaryId: { type: String, required: true },
    }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('brandName')) {
    this.slug = slugify(this.brandName);
  }
  next();
});

ProductSchema.index({ brandName: 'text', technicalName: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });

// Delete cached model to ensure schema updates (like adding `images` field)
// are picked up during Next.js dev hot-reload
if (mongoose.models.Product) {
  mongoose.deleteModel('Product');
}

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
