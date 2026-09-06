export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorCity: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  content: string;
  isVerifiedBuyer: boolean;
  helpfulCount: number;
}

export const initialProductReviews: Record<string, ProductReview[]> = {
  default: [
    {
      id: 'rev-01',
      productId: 'default',
      authorName: 'Aayusha Shrestha',
      authorCity: 'Kathmandu',
      rating: 5,
      date: '14 Feb 2026',
      title: 'Exquisite silk texture and flawless zari border!',
      content: 'Ordered this for my sister’s wedding reception. The fabric is genuinely pure silk with a rich luster that looks even more breathtaking in person. Free delivery arrived in Kathmandu in just 3 days in a protective muslin bag.',
      isVerifiedBuyer: true,
      helpfulCount: 18,
    },
    {
      id: 'rev-02',
      productId: 'default',
      authorName: 'Prerana Sharma',
      authorCity: 'Biratnagar',
      rating: 5,
      date: '02 Feb 2026',
      title: 'Authentic Indian handloom quality in Nepal',
      content: 'I was hesitant about ordering ethnic wear online, but Puja Collection exceeded expectations. The embroidery detail is authentic and heavy without feeling stiff. Payment via Fonepay QR was seamless.',
      isVerifiedBuyer: true,
      helpfulCount: 12,
    },
    {
      id: 'rev-03',
      productId: 'default',
      authorName: 'Sabina Karki',
      authorCity: 'Pokhara',
      rating: 5,
      date: '24 Jan 2026',
      title: 'Stunning drape and generous margins',
      content: 'The drape of this ensemble is royal and graceful. Loved that the blouse fabric had ample margin for a comfortable fit. Got compliments from everyone at the family celebration!',
      isVerifiedBuyer: true,
      helpfulCount: 9,
    },
    {
      id: 'rev-04',
      productId: 'default',
      authorName: 'Anjali Shah',
      authorCity: 'Dharan',
      rating: 4,
      date: '18 Jan 2026',
      title: 'Beautiful vibrant color and fast delivery',
      content: 'The color is exact to the photos and the zari border shines beautifully under festive lighting. Very prompt delivery across Koshi Province.',
      isVerifiedBuyer: true,
      helpfulCount: 5,
    },
  ],
};

export const getReviewsByProductId = (productId: string): ProductReview[] => {
  return initialProductReviews[productId] || initialProductReviews.default;
};
