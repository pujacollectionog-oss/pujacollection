'use client';

import React, { useState } from 'react';
import { getReviewsByProductId, type ProductReview } from '@/lib/mock/reviews';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export function ProductReviewsSection({ productId, productName }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(() => getReviewsByProductId(productId));
  const [formOpen, setFormOpen] = useState(false);
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Review Form state
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleHelpful = (revId: string) => {
    if (helpfulLiked[revId]) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setHelpfulLiked((prev) => ({ ...prev, [revId]: true }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || !title.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      authorName: name.trim(),
      authorCity: city.trim() || 'Nepal',
      rating,
      date: 'Just now',
      title: title.trim(),
      content: content.trim(),
      isVerifiedBuyer: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setName('');
    setCity('');
    setTitle('');
    setContent('');
    setTimeout(() => {
      setSubmitted(false);
      setFormOpen(false);
    }, 2500);
  };

  const avgScore = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;
  const threeStarCount = reviews.filter((r) => r.rating === 3).length;

  return (
    <section className="mt-16 pt-12 border-t border-[rgba(226,190,194,0.4)]" aria-labelledby="reviews-heading">
      <div className="space-y-8">

        {/* Section Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="label-sm text-[#735c00] block mb-1">Customer Testimonials</span>
            <h2 id="reviews-heading" className="headline-md text-[#1a1c1b]">
              Verified Buyer Reviews &amp; Ratings
            </h2>
            <p className="font-sans text-xs text-[#8e6f74] mt-1">
              Real feedback from customers across all 7 provinces of Nepal
            </p>
          </div>

          <button
            onClick={() => setFormOpen(!formOpen)}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] transition-all shadow-md cursor-pointer self-start md:self-auto"
          >
            <span>✍️</span>
            <span>{formOpen ? 'Close Review Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Write a Review Collapsible Form */}
        {formOpen && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[rgba(115,92,0,0.25)] shadow-md animate-fade-in space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(226,190,194,0.4)]">
              <h3 className="font-display text-lg font-bold text-[#1a1c1b]">
                Write a Review for {productName}
              </h3>
              <span className="label-sm text-[#055858]">✓ Verified Buyer Feedback</span>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2 border border-emerald-200 animate-fade-in">
                <span className="text-3xl">🎉</span>
                <h4 className="font-display text-lg font-bold">Dhanyabad for your review!</h4>
                <p className="text-xs font-sans text-emerald-700">
                  Your feedback has been published and helps other shoppers across Nepal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Selector */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                          star <= rating ? 'text-[#fed65b]' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="font-sans text-xs font-bold text-[#735c00] ml-2">
                      ({rating} out of 5 stars)
                    </span>
                  </div>
                </div>

                {/* Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sabina Karki"
                      className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                      Your City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Biratnagar, Morang"
                      className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                    />
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Gorgeous Banarasi silk with pure golden zari!"
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                  />
                </div>

                {/* Review Details */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Detailed Review &amp; Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts on the fabric quality, color richness, fitting, packaging, and delivery experience..."
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="py-2.5 px-5 rounded-xl text-xs font-semibold text-[#5a4044] border border-[rgba(115,92,0,0.3)] hover:bg-[#f4f4f1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] shadow-md cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Rating Breakdown Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 md:p-8 rounded-3xl border border-[rgba(115,92,0,0.18)] shadow-sm items-center">
          {/* Average Score Box (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-[rgba(226,190,194,0.4)] pb-6 md:pb-0 md:pr-6">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-[#a00041]">{avgScore}</span>
              <span className="font-sans text-sm text-[#8e6f74]">/ 5.0</span>
            </div>
            <div className="flex text-[#fed65b] text-lg my-1">
              ★★★★★
            </div>
            <p className="font-sans text-xs text-[#5a4044]">
              Based on <strong>{reviews.length}</strong> customer reviews
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(5,88,88,0.1)] text-[#055858] text-[11px] font-bold">
              <span>✓</span>
              <span>100% Verified Purchases</span>
            </div>
          </div>

          {/* Rating Progress Bars (8 cols) */}
          <div className="md:col-span-8 space-y-2.5">
            {[
              { stars: '5 Stars', count: fiveStarCount, pct: Math.round((fiveStarCount / reviews.length) * 100) },
              { stars: '4 Stars', count: fourStarCount, pct: Math.round((fourStarCount / reviews.length) * 100) },
              { stars: '3 Stars', count: threeStarCount, pct: Math.round((threeStarCount / reviews.length) * 100) },
              { stars: '2 Stars', count: 0, pct: 0 },
              { stars: '1 Star', count: 0, pct: 0 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3 text-xs font-sans">
                <span className="w-14 text-[#5a4044] font-medium flex-shrink-0">{bar.stars}</span>
                <div className="flex-1 h-2.5 rounded-full bg-[#f4f4f1] overflow-hidden">
                  <div
                    className="h-full bg-[#b45309] rounded-full transition-all duration-500"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[#8e6f74] font-mono text-[11px] flex-shrink-0">
                  {bar.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-[rgba(226,190,194,0.4)] shadow-sm space-y-3 hover:border-[#b45309] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(160,0,65,0.08)] text-[#a00041] flex items-center justify-center font-bold font-sans text-sm">
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-[#1a1c1b] flex items-center gap-2">
                      {rev.authorName}
                      {rev.isVerifiedBuyer && (
                        <span className="text-[10px] font-bold text-[#055858] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </h4>
                    <p className="font-sans text-[11px] text-[#8e6f74]">
                      📍 {rev.authorCity} · {rev.date}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex text-[#fed65b] text-sm">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < rev.rating ? 'text-[#fed65b]' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Review body */}
              <div className="space-y-1">
                <h5 className="font-sans text-sm font-bold text-[#1a1c1b]">
                  {rev.title}
                </h5>
                <p className="font-sans text-xs md:text-sm text-[#5a4044] leading-relaxed">
                  {rev.content}
                </p>
              </div>

              {/* Helpful footer */}
              <div className="pt-2 flex items-center justify-between text-xs font-sans text-[#8e6f74]">
                <span>Quality &amp; Authenticity Verified</span>
                <button
                  onClick={() => handleHelpful(rev.id)}
                  disabled={helpfulLiked[rev.id]}
                  className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg border border-slate-200 hover:border-amber-400 text-xs font-medium hover:text-[#b45309] transition-colors cursor-pointer disabled:opacity-60"
                >
                  <span>👍 Helpful</span>
                  <span className="font-mono font-bold">({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
