export interface CategoryMeta {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  heroImage: string;
  garmentType: 'SAREE' | 'LEHENGA' | 'KURTI_AND_SUIT' | 'ALL';
  subcategories: {
    slug: string;
    label: string;
    desc: string;
  }[];
}

export const CATEGORIES_META: Record<string, CategoryMeta> = {
  sarees: {
    slug: 'sarees',
    name: 'Sarees (साड़ी)',
    subtitle: 'Woven with Real Zari & Centuries of Indian Heritage',
    description:
      'From the timeless Kadwa looms of Varanasi to the temple borders of Kanchipuram, explore our handpicked collection of pure Katan silk, organza, and festive sarees.',
    heroImage: '/images/bento-banarasi.jpg',
    garmentType: 'SAREE',
    subcategories: [
      { slug: 'banarasi', label: 'Banarasi Silk', desc: 'Handwoven Katan & Brocade' },
      { slug: 'kanjivaram', label: 'Kanjivaram', desc: 'Pure Mulberry Silk, GI Tag' },
      { slug: 'chiffon', label: 'Chiffon', desc: 'Lightweight & Festive' },
      { slug: 'georgette', label: 'Georgette', desc: 'Printed & Embroidered' },
      { slug: 'organza', label: 'Organza', desc: 'Sheer Elegance' },
      { slug: 'pre-stitched', label: 'Pre-Stitched', desc: 'Ready-to-Drape' },
    ],
  },
  lehengas: {
    slug: 'lehengas',
    name: 'Lehengas (लहंगा)',
    subtitle: 'The Pinnacle of Bridal & Occasion Splendor',
    description:
      'Impeccably hand-embroidered with authentic Zardozi, Gota Patti, and Kundan craftsmanship. Each lehenga is made to command the spotlight.',
    heroImage: '/images/hero-lehenga.jpg',
    garmentType: 'LEHENGA',
    subcategories: [
      { slug: 'bridal', label: 'Bridal Lehengas', desc: 'Heavy Embroidery & Zardozi' },
      { slug: 'reception', label: 'Reception', desc: 'Elegant & Graceful' },
      { slug: 'sangeet', label: 'Sangeet', desc: 'Lightweight & Vibrant' },
      { slug: 'floral', label: 'Floral & Organza', desc: 'Pastel & Dreamy' },
      { slug: 'velvet', label: 'Velvet Lehengas', desc: 'Regal & Rich' },
    ],
  },
  'kurtis-suits': {
    slug: 'kurtis-suits',
    name: 'Kurtis, Suits & Gowns',
    subtitle: 'Graceful Ethnic Silhouettes, Shararas & Floor-Length Gowns',
    description:
      'Elevate your wardrobe with mastercrafted Shararas, Ghararas, tailored Straight Suits, and regal Floor-Length Gowns with handcrafted Chikankari and block print motifs.',
    heroImage: '/images/ivory-sharara.jpg',
    garmentType: 'KURTI_AND_SUIT',
    subcategories: [
      { slug: 'festive', label: 'Festive Kurtis', desc: 'For Celebrations' },
      { slug: 'sharara', label: 'Sharara Sets', desc: 'Flared Bottoms' },
      { slug: 'gharara', label: 'Gharara Sets', desc: 'Traditional Silhouette' },
      { slug: 'straight', label: 'Straight Suits', desc: 'Versatile & Chic' },
      { slug: 'gowns', label: 'Floor-Length Gowns', desc: 'Grand Entrances & Soirées' },
    ],
  },
  collections: {
    slug: 'collections',
    name: 'Curated Collections',
    subtitle: 'Editorial Signature Series & Royal Editions',
    description:
      'Explore curated selections from our master weavers, featuring limited edition bridal ensembles, royal Banaras silks, and pastel soirée edits.',
    heroImage: '/images/hero-lehenga.jpg',
    garmentType: 'ALL',
    subcategories: [
      { slug: 'royal-banaras', label: 'Royal Banaras', desc: 'Varanasi Mastercraft' },
      { slug: 'bridal-heritage', label: 'Bridal Heritage', desc: 'Grand Wedding Sets' },
      { slug: 'pastel-soiree', label: 'Pastel Soirée', desc: 'Daytime Celebrations' },
    ],
  },
};
