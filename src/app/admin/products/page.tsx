'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { CategoryBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CATEGORIES, Category } from '@/lib/constants';
import { normalizePackingSizes } from '@/lib/product-types';
import { Plus, Pencil, Trash2, Download, X, Upload } from 'lucide-react';

interface ProductImage {
  url: string;
  cloudinaryId: string;
}

interface Product {
  _id: string;
  brandName: string;
  technicalName: string;
  category: Category;
  dose: string;
  packingSizes: { size: string; price: number; mrp: number }[];
  details: { en: string; gu: string; hi: string };
  imageUrl: string;
  images: ProductImage[];
  isFeatured: boolean;
  isActive: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    brandName: '',
    technicalName: '',
    category: 'Insecticide' as Category,
    dose: '',
    packingRows: [{ size: '', price: '', mrp: '' }] as { size: string; price: string; mrp: string }[],
    detailsEn: '',
    imageUrl: '/images/product-placeholder.svg',
    images: [] as ProductImage[],
    isFeatured: false,
    isActive: true,
  });

  const fetchProducts = () => {
    fetch('/api/products?admin=true&limit=200')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      brandName: '', technicalName: '', category: 'Insecticide',
      dose: '',
      packingRows: [{ size: '', price: '', mrp: '' }],
      detailsEn: '',
      imageUrl: '/images/product-placeholder.svg',
      images: [],
      isFeatured: false, isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    // Build images array: use existing images, or fall back to legacy imageUrl
    let images = p.images || [];
    if (images.length === 0 && p.imageUrl && p.imageUrl !== '/images/product-placeholder.svg') {
      images = [{ url: p.imageUrl, cloudinaryId: '' }];
    }
    const normalizedPacking = normalizePackingSizes(p.packingSizes);
    setForm({
      brandName: p.brandName,
      technicalName: p.technicalName,
      category: p.category,
      dose: p.dose,
      packingRows: normalizedPacking.length
        ? normalizedPacking.map((sku) => ({
            size: sku.size,
            price: sku.price ? String(sku.price) : '',
            mrp: sku.mrp ? String(sku.mrp) : '',
          }))
        : [{ size: '', price: '', mrp: '' }],
      detailsEn: p.details?.en || '',
      imageUrl: p.imageUrl,
      images,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64 = await fileToBase64(file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, folder: 'lykan/products' }),
        });
        const data = await res.json();
        if (data.url) {
          setForm((f) => {
            const newImages = [...f.images, { url: data.url, cloudinaryId: data.publicId || '' }];
            return {
              ...f,
              images: newImages,
              imageUrl: newImages[0]?.url || '/images/product-placeholder.svg',
            };
          });
          toast.success(`Image ${i + 1} uploaded`);
        } else {
          toast.error(`Failed to upload image ${i + 1}`);
        }
      } catch {
        toast.error(`Failed to upload image ${i + 1}`);
      }
    }

    setUploading(false);
    // Reset file input so the same files can be selected again
    if (fileRef.current) fileRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((f) => {
      const newImages = f.images.filter((_, i) => i !== index);
      return {
        ...f,
        images: newImages,
        imageUrl: newImages[0]?.url || '/images/product-placeholder.svg',
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const packingSizes = form.packingRows
      .filter((row) => row.size.trim())
      .map((row) => ({
        size: row.size.trim(),
        price: parseFloat(row.price) || 0,
        mrp: parseFloat(row.mrp) || 0,
      }));

    const payload = {
      brandName: form.brandName,
      technicalName: form.technicalName,
      category: form.category,
      dose: form.dose,
      packingSizes,
      details: form.detailsEn,
      imageUrl: form.images[0]?.url || form.imageUrl,
      images: form.images,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };

    const url = editing ? `/api/products/${editing._id}` : '/api/products';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editing ? 'Product updated' : 'Product created');
      setModalOpen(false);
      fetchProducts();
    } else {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      fetchProducts();
    }
  };

  const toggleField = async (id: string, field: 'isFeatured' | 'isActive', value: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchProducts();
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !confirm(`Delete ${selected.length} products?`)) return;
    await fetch('/api/products/bulk', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    });
    setSelected([]);
    fetchProducts();
    toast.success('Bulk delete complete');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-navy">Products</h1>
        <div className="flex gap-2">
          <a href="/api/products/export">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Export</Button>
          </a>
          {selected.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              Delete ({selected.length})
            </Button>
          )}
          <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add Product</Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left"><input type="checkbox" onChange={(e) => {
                  setSelected(e.target.checked ? products.map((p) => p._id) : []);
                }} /></th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Technical</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Images</th>
                <th className="p-3 text-left">Featured</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.includes(p._id)}
                      onChange={(e) => setSelected(e.target.checked ? [...selected, p._id] : selected.filter((id) => id !== p._id))} />
                  </td>
                  <td className="p-3">
                    <div className="relative w-10 h-10">
                      <Image src={p.imageUrl} alt="" fill className="object-contain" />
                    </div>
                  </td>
                  <td className="p-3 font-medium">{p.brandName}</td>
                  <td className="p-3 text-gray-500">{p.technicalName || '-'}</td>
                  <td className="p-3"><CategoryBadge category={p.category} /></td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {(p.images?.length > 0 ? p.images.length : (p.imageUrl && p.imageUrl !== '/images/product-placeholder.svg' ? 1 : 0))} img
                    </span>
                  </td>
                  <td className="p-3">
                    <input type="checkbox" checked={p.isFeatured}
                      onChange={(e) => toggleField(p._id, 'isFeatured', e.target.checked)} />
                  </td>
                  <td className="p-3">
                    <input type="checkbox" checked={p.isActive}
                      onChange={(e) => toggleField(p._id, 'isActive', e.target.checked)} />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="space-y-4">
          {/* Multi-image upload zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images {form.images.length > 0 && <span className="text-gray-400">({form.images.length} uploaded)</span>}
            </label>

            {/* Thumbnail grid of uploaded images */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {form.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className={`relative aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-green-500' : 'border-border'}`}>
                      <Image src={img.url} alt="" fill className="object-contain p-1" />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                          Cover
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-green-50/30 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload images</p>
                  <p className="text-xs text-gray-400 mt-0.5">You can select multiple files</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <Input label="Brand Name *" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} />
          <Input label="Technical Name" value={form.technicalName} onChange={(e) => setForm({ ...form, technicalName: e.target.value })} />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <Textarea label="Dose Instructions" value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Packing Sizes (Size / Price / MRP)</label>
            <div className="space-y-2">
              {form.packingRows.map((row, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    className="input-field flex-1"
                    placeholder="e.g. 250 ML"
                    value={row.size}
                    onChange={(e) => {
                      const rows = [...form.packingRows];
                      rows[index] = { ...rows[index], size: e.target.value };
                      setForm({ ...form, packingRows: rows });
                    }}
                  />
                  <input
                    className="input-field w-24"
                    placeholder="Price"
                    type="number"
                    min="0"
                    value={row.price}
                    onChange={(e) => {
                      const rows = [...form.packingRows];
                      rows[index] = { ...rows[index], price: e.target.value };
                      setForm({ ...form, packingRows: rows });
                    }}
                  />
                  <input
                    className="input-field w-24"
                    placeholder="MRP"
                    type="number"
                    min="0"
                    value={row.mrp}
                    onChange={(e) => {
                      const rows = [...form.packingRows];
                      rows[index] = { ...rows[index], mrp: e.target.value };
                      setForm({ ...form, packingRows: rows });
                    }}
                  />
                  {form.packingRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, packingRows: form.packingRows.filter((_, i) => i !== index) })}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setForm({ ...form, packingRows: [...form.packingRows, { size: '', price: '', mrp: '' }] })}
            >
              + Add Packing Size
            </Button>
          </div>

          <Textarea
            label="Product Details (English only — auto-translated to Gujarati & Hindi)"
            value={form.detailsEn}
            onChange={(e) => setForm({ ...form, detailsEn: e.target.value })}
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
          </div>

          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving ? 'Translating & saving...' : editing ? 'Update' : 'Save'} Product
          </Button>
        </div>
      </Modal>
    </div>
  );
}
