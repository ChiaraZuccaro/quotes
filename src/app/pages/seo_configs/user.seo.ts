import { SeoConfig } from "@interfaces/seo.interface";

export const USER_SEO: SeoConfig = {
  title: 'Your Quotes | Memorable Quotes',
  description: 'Explore and manage your personal collection of quotes. Filter them by content, author, category, or length to find the perfect inspiration.',
  keywords: 'my quotes, personal collection, filtered quotes, quote management, inspirational quotes',
  author: 'Memorable Quotes',

  ogTitle: 'Your Quotes – Memorable Quotes',
  ogDescription: 'Access and organize your favorite quotes. Filter by author, content, category, or length for a tailored experience.',
  // ogImage: 'https://yourdomain.com/assets/og-user.jpg',
  ogType: 'website',
  // ogUrl: 'https://yourdomain.com/user', //todo
  ogSiteName: 'Memorable Quotes',

  twitterTitle: 'Your Quotes – Personalize Your Inspiration',
  twitterDescription: 'Manage and filter your collection of quotes with ease, and get inspired daily by your personalized collection.',
  // twitterImage: 'https://yourdomain.com/assets/twitter-user.jpg',
  twitterCard: 'summary_large_image',

  robots: 'index, follow',
  // canonical: 'https://yourdomain.com/user' //todo
}