export interface Game {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  thumbnail: string | null;
  iframeUrl: string;
  shortDescription: string | null;
  description: string | null;
  instructions: string | null;
  rating: number;
  plays: number;
  isNew: boolean;
  isTrending: boolean;
  isHot: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface HomePageGames {
  newGames: Game[];
  trendingGames: Game[];
  hotGames: Game[];
  popularGames: Game[];
  featuredGames: Game[];
}

export interface GameReportInput {
  gameSlug: string;
  reason: string;
  details?: string;
}

export interface MutationResult {
  success: boolean;
  error?: string;
}
