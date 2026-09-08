'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useProductStore } from '@/store/useProductStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { ConfirmDialogModal } from '@/components/ui/ConfirmDialogModal';
import { EditProductModal } from '@/components/admin/EditProductModal';
import type { MockProduct } from '@/lib/mock/products';

interface UploadedImageItem {
  url: string;
  altText: string;
  isPrimary: boolean;
}

interface SizeVariantConfig {
  id: string;
  size: string;
  title: string;
  stockQuantity: number;
}

export function InventoryTab() {
  const { formatPrice } = useCurrencyStore();
  const { products, addProduct, updateStock, deleteProduct } = useProductStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MockProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // New product form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('sarees');
  const [newGarmentType, setNewGarmentType] = useState<'SAREE' | 'LEHENGA' | 'KURTI_AND_SUIT'>('SAREE');
  const [newPrice, setNewPrice] = useState('');
  const [newComparePrice, setNewComparePrice] = useState('');
  const [newFabric, setNewFabric] = useState('Pure Katan Silk');
  const [newDesc, setNewDesc] = useState('');
  const [newImages, setNewImages] = useState<UploadedImageItem[]>([
    { url: '/images/hero-lehenga.jpg', altText: 'Primary product photo', isPrimary: true },
  ]);
  const [sizeVariants, setSizeVariants] = useState<SizeVariantConfig[]>([
    { id: 'v-s', size: 'S', title: 'S (32")', stockQuantity: 5 },
    { id: 'v-m', size: 'M', title: 'M (34")', stockQuantity: 8 },
    { id: 'v-l', size: 'L', title: 'L (36")', stockQuantity: 5 },
    { id: 'v-xl', size: 'XL', title: 'XL (38")', stockQuantity: 2 },
  ]);

  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalCalculatedStock = sizeVariants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'ALL' && p.categorySlug !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchFabric = p.fabricDetails.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      if (!matchName && !matchFabric && !matchId) return false;
    }
    return true;
  });

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
        const mapped: UploadedImageItem[] = data.files.map((f: { url: string; name: string }, idx: number) => ({
          url: f.url,
          altText: newName || f.name,
          isPrimary: newImages.length === 0 && idx === 0,
        }));

        setNewImages((prev) => {
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
    setNewImages((prev) => [
      ...prev,
      {
        url,
        altText: newName || 'Product photo',
        isPrimary: prev.length === 0,
      },
    ]);
    setCustomUrlInput('');
  };

  const handleSetPrimaryImage = (index: number) => {
    setNewImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setNewImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice.trim()) return;

    const basePriceNum = parseInt(newPrice, 10) || 15000;
    const comparePriceNum = newComparePrice ? parseInt(newComparePrice, 10) : undefined;

    const finalImages =
      newImages.length > 0
        ? newImages
        : [{ url: '/images/hero-lehenga.jpg', altText: newName, isPrimary: true }];

    const formattedVariants = sizeVariants.map((v) => ({
      id: v.id || `v-${Date.now()}-${v.size}`,
      title: v.title || v.size,
      size: v.size,
      stockQuantity: Number(v.stockQuantity) || 0,
    }));

    const newProd: MockProduct = {
      id: `p-${Date.now().toString().slice(-6)}`,
      name: newName.trim(),
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      garmentType: newGarmentType,
      categorySlug: newCategory,
      description: newDesc.trim() || 'Authentic luxury Indian ethnic wear crafted by master karigars.',
      fabricDetails: `${newFabric} with pure gold zari embellishment.`,
      fabricType: newFabric as any,
      craftDetails: 'Handcrafted traditional artisan weave.',
      careInstructions: 'Dry Clean Only. Wrapped in muslin storage bag.',
      silkMarkCertified: true,
      handloomCertified: true,
      occasion: 'Bridal',
      basePrice: basePriceNum,
      compareAtPrice: comparePriceNum,
      isCustomizable: false,
      customizationFee: 0,
      isFeatured: true,
      badge: 'New',
      images: finalImages,
      variants: formattedVariants,
      tags: ['new-arrival', newCategory],
    };

    setIsSavingProduct(true);
    setProductFormError('');

    const res = await addProduct(newProd);
    setIsSavingProduct(false);

    if (res && res.success === false) {
      setProductFormError(res.error || 'Failed to save product to database.');
      return;
    }

    setAddModalOpen(false);
    setNewName('');
    setNewPrice('');
    setNewComparePrice('');
    setNewDesc('');
    setNewImages([{ url: '/images/hero-lehenga.jpg', altText: 'Primary photo', isPrimary: true }]);
    setToastMessage('✓ New ensemble with custom sizes & stock successfully published to database!');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {isSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fade-in flex items-center justify-between">
          <span>{toastMessage || '✓ Operation completed successfully!'}</span>
          <button onClick={() => setIsSuccessToast(false)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ensemble name, fabric, or SKU..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-sans rounded-xl border border-slate-200 focus:border-[#be123c] outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 outline-none cursor-pointer"
            >
              <option value="ALL">All Categories ({products.length})</option>
              <option value="sarees">Sarees</option>
              <option value="lehengas">Lehengas</option>
              <option value="kurtis-suits">Kurtis &amp; Suits</option>
            </select>

            {/* Add Product Button */}
            <button
              onClick={() => {
                if (categoryFilter === 'sarees') applySizePreset('saree');
                else applySizePreset('standard');
                setAddModalOpen(true);
              }}
              className="py-2.5 px-5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#be123c] text-white hover:bg-[#9f1239] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>+</span>
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Garment &amp; SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Configured Sizes &amp; Stock</th>
                <th className="py-3.5 px-4">Price (NPR)</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4 text-center">Adjust Stock</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                const isOutOfStock = totalStock === 0;
                const isLowStock = totalStock > 0 && totalStock <= 5;
                const primaryImg = p.images.find((i) => i.isPrimary) || p.images[0];

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          <Image
                            src={primaryImg?.url || '/images/hero-lehenga.jpg'}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                          {p.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1 rounded font-mono font-bold">
                              {p.images.length}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#0f172a] block truncate max-w-[180px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            SKU: {p.id.toUpperCase()} · {p.images.length} {p.images.length === 1 ? 'photo' : 'photos'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 capitalize font-medium text-slate-700">
                      {p.categorySlug.replace('-', ' ')}
                    </td>

                    {/* Configured Sizes & Breakdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                        {p.variants.map((v) => (
                          <span
                            key={v.id}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                              v.stockQuantity === 0
                                ? 'bg-rose-50 text-rose-700 border-rose-200 line-through'
                                : v.stockQuantity <= 2
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                            title={`${v.title || v.size}: ${v.stockQuantity} units`}
                          >
                            <span>{v.size || v.title}</span>
                            <span className="text-slate-400">:</span>
                            <span className="text-[#be123c]">{v.stockQuantity}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#be123c]">
                      {formatPrice(p.basePrice)}
                      {p.compareAtPrice && (
                        <span className="text-[10px] text-slate-400 line-through block font-normal">
                          {formatPrice(p.compareAtPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOutOfStock
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isLowStock
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        {totalStock} units
                      </span>
                    </td>

                    {/* Stock Adjuster */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => updateStock(p.id, -1)}
                          disabled={totalStock <= 0}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                          title="Reduce all sizes stock by 1"
                        >
                          −
                        </button>
                        <span className="font-mono text-xs font-bold w-6 text-center text-slate-800">
                          {totalStock}
                        </span>
                        <button
                          onClick={() => updateStock(p.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                          title="Increase all sizes stock by 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditTarget(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-bold transition-colors cursor-pointer flex items-center gap-1 border border-slate-200 hover:border-amber-300 shadow-2xs text-[11px]"
                          title="Edit product details, photos, and stock"
                        >
                          <span>✏️</span>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-slate-200 hover:border-rose-300 shadow-2xs"
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal with Multi-Image & Size Quantity Configurator */}
      {addModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setAddModalOpen(false)}>
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 animate-fade-in-up flex flex-col h-[85vh] max-h-[820px] font-sans overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-slate-200 flex-shrink-0 bg-white">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0f172a]">
                  Add New Ensemble to Store
                </h3>
                <p className="text-xs text-slate-500">Configure photos, sizes, stock per size, and pricing.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form id="add-product-form" onSubmit={handleAddProduct} className="flex-1 overflow-y-auto px-6 py-5 md:px-8 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-[#0f172a] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rani Pink Banarasi Katan Silk Saree"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none"
                />
              </div>

              {/* Category & Fabric */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewCategory(val);
                      if (val === 'sarees') {
                        setNewGarmentType('SAREE');
                        applySizePreset('saree');
                      } else if (val === 'lehengas') {
                        setNewGarmentType('LEHENGA');
                        applySizePreset('standard');
                      } else {
                        setNewGarmentType('KURTI_AND_SUIT');
                        applySizePreset('standard');
                      }
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
                    Fabric Type *
                  </label>
                  <select
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
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

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1">
                    Price (NPR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
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
                    value={newComparePrice}
                    onChange={(e) => setNewComparePrice(e.target.value)}
                    placeholder="55000"
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none font-mono"
                  />
                </div>
              </div>

              {/* SIZES & STOCK PER SIZE CONFIGURATOR */}
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-bold text-[#0f172a] block text-xs">
                      📐 Sizes &amp; Stock Quantity per Size
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Total inventory calculated: <strong className="text-[#be123c] font-mono">{totalCalculatedStock} units</strong>
                    </span>
                  </div>

                  {/* Size Preset Buttons */}
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => applySizePreset('standard')}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#be123c] transition-colors"
                    >
                      S/M/L/XL
                    </button>
                    <button
                      type="button"
                      onClick={() => applySizePreset('saree')}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#be123c] transition-colors"
                    >
                      Free Size
                    </button>
                    <button
                      type="button"
                      onClick={() => applySizePreset('plus')}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#be123c] transition-colors"
                    >
                      Plus Sizes
                    </button>
                  </div>
                </div>

                {/* Size Rows Table */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase px-1">
                    <div className="col-span-4">Size Code</div>
                    <div className="col-span-5">Display Label</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-1 text-center">✕</div>
                  </div>

                  {sizeVariants.map((v, idx) => (
                    <div key={v.id || idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                      {/* Size Code e.g. S, M, L */}
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

                      {/* Display Label e.g. S (32") */}
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

                      {/* Stock Quantity */}
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

                      {/* Delete Row */}
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeRow(idx)}
                          className="text-slate-400 hover:text-rose-600 font-bold text-sm p-1"
                          title="Remove size"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Another Size Button */}
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
                      Product Photo Gallery ({newImages.length} {newImages.length === 1 ? 'image' : 'images'})
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Upload multiple angles (front, back, fabric macro zoom, model drape).
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
                {newImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                    {newImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-white transition-all shadow-xs ${
                          img.isPrimary ? 'border-[#be123c] ring-2 ring-rose-500/20' : 'border-slate-200'
                        }`}
                      >
                        <Image src={img.url} alt={img.altText} fill unoptimized sizes="100px" className="object-cover" />

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
                    className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition-colors"
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
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Artisan handloom details, zari weave texture, and occasion notes..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none"
                />
              </div>
              {productFormError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold animate-fade-in flex items-center justify-between">
                  <span>⚠️ {productFormError}</span>
                  <button type="button" onClick={() => setProductFormError('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
                </div>
              )}
            </form>

            {/* Modal Fixed Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 md:px-8 border-t border-slate-200 bg-slate-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(false);
                  setProductFormError('');
                }}
                disabled={isSavingProduct}
                className="py-2.5 px-4 rounded-xl font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-product-form"
                disabled={isSavingProduct}
                className="py-2.5 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#be123c] text-white hover:bg-[#9f1239] shadow-sm cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isSavingProduct ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing to Database…</span>
                  </>
                ) : (
                  <span>Publish &amp; Save Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={Boolean(editTarget)}
        product={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={async (updatedProduct) => {
          const res = await addProduct(updatedProduct);
          if (res && res.success) {
            setToastMessage(`✓ Product "${updatedProduct.name}" successfully updated!`);
            setIsSuccessToast(true);
            setTimeout(() => setIsSuccessToast(false), 4000);
          }
          return res;
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Product"
        itemName={deleteTarget?.name}
        itemType="product"
        message="Are you sure you want to remove this item from the catalog? This will permanently delete its photos and size variants from the store database."
        confirmLabel="Yes, Remove Product"
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
