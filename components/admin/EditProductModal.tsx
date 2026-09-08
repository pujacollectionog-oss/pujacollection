'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { MockProduct, ProductImageItem } from '@/lib/mock/products';

interface EditProductModalProps {
  isOpen: boolean;
  product: MockProduct | null;
  onClose: () => void;
  onSave: (updatedProduct: MockProduct) => Promise<{ success: boolean; error?: string }>;
}

interface SizeVariantConfig {
  id: string;
  size: string;
  title: string;
  stockQuantity: number;
}

export function EditProductModal({
  isOpen,
  product,
  onClose,
  onSave,
}: EditProductModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sarees');
  const [garmentType, setGarmentType] = useState<'SAREE' | 'LEHENGA' | 'KURTI_AND_SUIT'>('SAREE');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [fabric, setFabric] = useState('Pure Katan Silk');
  const [desc, setDesc] = useState('');
  const [occasion, setOccasion] = useState('Bridal');
  const [badge, setBadge] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [silkMark, setSilkMark] = useState(true);
  const [handloom, setHandloom] = useState(true);

  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [sizeVariants, setSizeVariants] = useState<SizeVariantConfig[]>([]);

  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Populate form when product changes or modal opens
  useEffect(() => {
    if (!product) return;

    setName(product.name || '');
    setCategory(product.categorySlug || 'sarees');
    setGarmentType((product.garmentType as any) || 'SAREE');
    setPrice(product.basePrice ? String(product.basePrice) : '');
    setComparePrice(product.compareAtPrice ? String(product.compareAtPrice) : '');
    setFabric(product.fabricType || 'Pure Katan Silk');
    setDesc(product.description || '');
    setOccasion(product.occasion || 'Bridal');
    setBadge(product.badge || '');
    setIsFeatured(Boolean(product.isFeatured ?? true));
    setSilkMark(Boolean(product.silkMarkCertified));
    setHandloom(Boolean(product.handloomCertified));

    // Images
    const loadedImages =
      product.images && product.images.length > 0
        ? product.images.map((img, idx) => ({
            url: img.url,
            altText: img.altText || product.name,
            isPrimary: img.isPrimary !== undefined ? Boolean(img.isPrimary) : idx === 0,
            macroZoomUrl: img.macroZoomUrl,
          }))
        : [{ url: '/images/hero-lehenga.jpg', altText: product.name, isPrimary: true }];

    // Ensure at least one primary
    if (!loadedImages.some((i) => i.isPrimary)) {
      loadedImages[0].isPrimary = true;
    }
    setImages(loadedImages);

    // Size variants
    if (product.variants && product.variants.length > 0) {
      setSizeVariants(
        product.variants.map((v, idx) => ({
          id: v.id || `v-${idx}`,
          size: v.size || v.title || 'Standard',
          title: v.title || v.size || 'Standard',
          stockQuantity: Number(v.stockQuantity) || 0,
        }))
      );
    } else {
      setSizeVariants([
        { id: `v-${Date.now()}-std`, size: 'Standard', title: 'Standard One-Size', stockQuantity: 5 },
      ]);
    }

    setFormError('');
    setUploadError('');
    setCustomUrlInput('');
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const totalCalculatedStock = sizeVariants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);

  // Size Preset Template Helpers
  const applySizePreset = (preset: 'standard' | 'saree' | 'plus' | 'free') => {
    if (preset === 'standard') {
      setSizeVariants([
        { id: `v-${Date.now()}-s`, size: 'S', title: 'S (32")', stockQuantity: 5 },
        { id: `v-${Date.now()}-m`, size: 'M', title: 'M (34")', stockQuantity: 8 },
        { id: `v-${Date.now()}-l`, size: 'L', title: 'L (36")', stockQuantity: 5 },
        { id: `v-${Date.now()}-xl`, size: 'XL', title: 'XL (38")', stockQuantity: 2 },
      ]);
    } else if (preset === 'saree') {
      setSizeVariants([
        { id: `v-${Date.now()}-free`, size: 'Free Size', title: 'Free Size (6.3m Drape + Blouse)', stockQuantity: 15 },
      ]);
    } else if (preset === 'plus') {
      setSizeVariants([
        { id: `v-${Date.now()}-xl`, size: 'XL', title: 'XL (38")', stockQuantity: 5 },
        { id: `v-${Date.now()}-xxl`, size: 'XXL', title: 'XXL (40")', stockQuantity: 5 },
        { id: `v-${Date.now()}-3xl`, size: '3XL', title: '3XL (42")', stockQuantity: 3 },
      ]);
    } else {
      setSizeVariants([
        { id: `v-${Date.now()}-std`, size: 'Standard', title: 'Standard One-Size', stockQuantity: 10 },
      ]);
    }
  };

  const handleUpdateSize = (index: number, field: keyof SizeVariantConfig, value: string | number) => {
    setSizeVariants((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          [field]: field === 'stockQuantity' ? Math.max(0, Number(value) || 0) : value,
        };
      })
    );
  };

  const handleAddSizeRow = () => {
    setSizeVariants((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}-${prev.length}`,
        size: 'Custom',
        title: 'Custom Size',
        stockQuantity: 5,
      },
    ]);
  };

  const handleRemoveSizeRow = (index: number) => {
    if (sizeVariants.length <= 1) {
      alert('A product must have at least one size variant.');
      return;
    }
    setSizeVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setUploadError(data.error || 'Failed to upload image(s).');
        return;
      }

      if (data.files && Array.isArray(data.files)) {
        const mapped: ProductImageItem[] = data.files.map((f: { url: string; name: string }, idx: number) => ({
          url: f.url,
          altText: name || f.name,
          isPrimary: images.length === 0 && idx === 0,
        }));

        setImages((prev) => {
          const hasPrimary = prev.some((img) => img.isPrimary);
          if (!hasPrimary && mapped.length > 0) {
            mapped[0].isPrimary = true;
          }
          return [...prev, ...mapped];
        });
      }
    } catch {
      setUploadError('Network error uploading images.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const url = customUrlInput.trim();
    setImages((prev) => [
      ...prev,
      {
        url,
        altText: name || 'Product photo',
        isPrimary: prev.length === 0,
      },
    ]);
    setCustomUrlInput('');
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      setFormError('Product name and base price are required.');
      return;
    }

    const basePriceNum = parseInt(price, 10) || 0;
    const comparePriceNum = comparePrice ? parseInt(comparePrice, 10) : undefined;

    // Ensure images have primary flagged and sorted
    const finalImages =
      images.length > 0
        ? images
        : [{ url: '/images/hero-lehenga.jpg', altText: name, isPrimary: true }];

    const formattedVariants = sizeVariants.map((v) => ({
      id: v.id || `v-${Date.now()}-${v.size}`,
      title: v.title || v.size,
      size: v.size,
      stockQuantity: Number(v.stockQuantity) || 0,
    }));

    const updatedProduct: MockProduct = {
      ...product,
      name: name.trim(),
      garmentType,
      categorySlug: category,
      description: desc.trim() || product.description || 'Authentic luxury Indian ethnic wear crafted by master karigars.',
      fabricDetails: `${fabric} with pure gold zari embellishment.`,
      fabricType: fabric as any,
      occasion: occasion as any,
      badge: badge.trim() || undefined,
      basePrice: basePriceNum,
      compareAtPrice: comparePriceNum,
      isFeatured,
      silkMarkCertified: silkMark,
      handloomCertified: handloom,
      images: finalImages,
      variants: formattedVariants,
      tags: [category, occasion.toLowerCase(), badge.toLowerCase()].filter(Boolean),
    };

    setIsSaving(true);
    setFormError('');

    const res = await onSave(updatedProduct);
    setIsSaving(false);

    if (res && res.success === false) {
      setFormError(res.error || 'Failed to update product in database.');
      return;
    }

    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 animate-fade-in-up flex flex-col h-[88vh] max-h-[860px] font-sans overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-slate-200 flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-lg font-bold">
              ✏️
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#0f172a]">
                Edit Ensemble Details
              </h3>
              <p className="text-xs text-slate-500">
                Update product information, primary photos, sizes, and pricing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          id="edit-product-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-5 md:px-8 space-y-5 text-xs"
        >
          {/* Product Name */}
          <div>
            <label className="block font-bold text-[#0f172a] mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rani Pink Banarasi Katan Silk Saree"
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none text-xs font-semibold"
            />
          </div>

          {/* Category, Garment Type, Fabric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  if (val === 'sarees') setGarmentType('SAREE');
                  else if (val === 'lehengas') setGarmentType('LEHENGA');
                  else setGarmentType('KURTI_AND_SUIT');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none bg-white font-semibold cursor-pointer"
              >
                <option value="sarees">Sarees</option>
                <option value="lehengas">Bridal Lehengas</option>
                <option value="kurtis-suits">Kurtis &amp; Suits</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Garment Type *
              </label>
              <select
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none bg-white font-semibold cursor-pointer"
              >
                <option value="SAREE">Saree</option>
                <option value="LEHENGA">Lehenga</option>
                <option value="KURTI_AND_SUIT">Kurti &amp; Suit</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Fabric Type *
              </label>
              <select
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none bg-white font-semibold cursor-pointer"
              >
                <option value="Pure Katan Silk">Pure Katan Silk</option>
                <option value="Mulberry Silk">Mulberry Silk</option>
                <option value="Velvet">Velvet</option>
                <option value="Organza">Organza</option>
                <option value="Georgette">Georgette</option>
                <option value="Chiffon">Chiffon</option>
                <option value="Chanderi Cotton">Chanderi Cotton</option>
              </select>
            </div>
          </div>

          {/* Pricing, Badge & Occasion */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Price (NPR) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Compare Price (NPR)
              </label>
              <input
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="55000"
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none bg-white font-semibold cursor-pointer"
              >
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Heritage">Heritage</option>
                <option value="Exclusive">Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none bg-white font-semibold cursor-pointer"
              >
                <option value="Bridal">Bridal</option>
                <option value="Festive">Festive</option>
                <option value="Partywear">Partywear</option>
                <option value="Casual">Casual</option>
              </select>
            </div>
          </div>

          {/* Certifications & Badges Row */}
          <div className="flex flex-wrap gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#be123c] rounded focus:ring-0 cursor-pointer"
              />
              <span>⭐ Featured Collection</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={silkMark}
                onChange={(e) => setSilkMark(e.target.checked)}
                className="w-4 h-4 text-[#be123c] rounded focus:ring-0 cursor-pointer"
              />
              <span>🏷️ Silk Mark Certified</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={handloom}
                onChange={(e) => setHandloom(e.target.checked)}
                className="w-4 h-4 text-[#be123c] rounded focus:ring-0 cursor-pointer"
              />
              <span>🧶 Handloom Certified</span>
            </label>
          </div>

          {/* SIZES & STOCK PER SIZE CONFIGURATOR */}
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-bold text-[#0f172a] block text-xs">
                  📐 Sizes &amp; Inventory Stock per Size
                </label>
                <span className="text-[11px] text-slate-500">
                  Total available stock: <strong className="text-[#be123c] font-mono">{totalCalculatedStock} units</strong>
                </span>
              </div>

              {/* Size Preset Buttons */}
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => applySizePreset('standard')}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#be123c] transition-colors cursor-pointer"
                >
                  S/M/L/XL
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset('saree')}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#be123c] transition-colors cursor-pointer"
                >
                  Free Size
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset('plus')}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#be123c] transition-colors cursor-pointer"
                >
                  Plus Sizes
                </button>
              </div>
            </div>

            {/* Size Rows */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase px-1">
                <div className="col-span-4">Size Code</div>
                <div className="col-span-5">Display Label</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-1 text-center">✕</div>
              </div>

              {sizeVariants.map((v, idx) => (
                <div
                  key={v.id || idx}
                  className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-xs"
                >
                  <div className="col-span-4">
                    <input
                      type="text"
                      required
                      value={v.size}
                      onChange={(e) => handleUpdateSize(idx, 'size', e.target.value)}
                      placeholder="e.g. S"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0f172a] outline-none focus:border-[#be123c]"
                    />
                  </div>

                  <div className="col-span-5">
                    <input
                      type="text"
                      required
                      value={v.title}
                      onChange={(e) => handleUpdateSize(idx, 'title', e.target.value)}
                      placeholder='e.g. S (32" Chest)'
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 outline-none focus:border-[#be123c]"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      required
                      min="0"
                      value={v.stockQuantity}
                      onChange={(e) => handleUpdateSize(idx, 'stockQuantity', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-[#be123c] text-center outline-none focus:border-[#be123c]"
                    />
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSizeRow(idx)}
                      className="text-slate-400 hover:text-rose-600 font-bold text-sm p-1 cursor-pointer"
                      title="Remove size"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleAddSizeRow}
                className="w-full py-2 rounded-xl bg-white border border-dashed border-slate-300 text-slate-700 hover:border-[#be123c] hover:text-[#be123c] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>+</span>
                <span>Add Another Size Variant</span>
              </button>
            </div>
          </div>

          {/* Multi-Image File Uploader Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-[#0f172a] block">
                  Product Photo Gallery ({images.length} {images.length === 1 ? 'image' : 'images'})
                </label>
                <span className="text-[11px] text-slate-500">
                  Select which photo is primary (shown on storefront cards).
                </span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>📷</span>
                <span>{isUploading ? 'Uploading…' : 'Upload Images'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadError && (
              <p className="text-rose-600 font-bold text-[11px]">⚠️ {uploadError}</p>
            )}

            {/* Uploaded Image Thumbnails Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-white transition-all shadow-xs ${
                      img.isPrimary ? 'border-[#be123c] ring-2 ring-rose-500/20' : 'border-slate-200'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || name}
                      fill
                      unoptimized
                      sizes="100px"
                      className="object-cover"
                    />

                    {/* Primary Badge */}
                    {img.isPrimary ? (
                      <span className="absolute top-1.5 left-1.5 bg-[#be123c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                        ★ Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="absolute top-1.5 left-1.5 bg-black/70 hover:bg-[#be123c] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                      >
                        Set Primary
                      </button>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 bg-black/75 hover:bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image by URL fallback */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Or paste image URL (e.g. /images/hero-lehenga.jpg)..."
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none bg-white"
              />
              <button
                type="button"
                onClick={handleAddCustomUrl}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                + Add URL
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-[#0f172a] mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Artisan handloom details, zari weave texture, and occasion notes..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none text-xs"
            />
          </div>

          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold animate-fade-in flex items-center justify-between">
              <span>⚠️ {formError}</span>
              <button
                type="button"
                onClick={() => setFormError('')}
                className="text-rose-500 hover:text-rose-800 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </form>

        {/* Modal Fixed Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 md:px-8 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="py-2.5 px-4 rounded-xl font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={isSaving}
            className="py-2.5 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#be123c] text-white hover:bg-[#9f1239] shadow-sm cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <span>Save &amp; Update Product</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
