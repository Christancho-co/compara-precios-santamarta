// Ara bloquea su API directa - scrapeamos su página de búsqueda
import type { Product } from './types';
export async function searchAra(query: string): Promise<Product[]> {
  // Ara tiene su propio sistema - scrapeamos su página de búsqueda
  const url = `https://www.ara.com.co/search?text=${encodeURIComponent(query)}`;
  
  try {
    const res = await
     fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const html = await res.text();
    
    // Ara embebe datos en window.__STATE__ o data-product attrs
    const matches = html.matchAll(/"productName":"([^"]+)","price":(\d+\.?\d*)/g);
    const products: Product[] = [];
    
    for (const match of matches) {
      products.push({
        name: match[1],
        price: parseFloat(match[2]),
        image: '',
        url: `https://www.ara.com.co/search?text=${encodeURIComponent(query)}`,
        store: 'Ara',
      });
    }
    return products;
  } catch {
    return [];
  }
}
