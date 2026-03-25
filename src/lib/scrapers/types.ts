export interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  url: string;
  store: string;
  unit?: string;
  pricePerGram?: number;
  category?: string;
  brand?: string;
}

export interface ScraperResult {
  store: string;
  products: Product[];
  timestamp: string;
}
