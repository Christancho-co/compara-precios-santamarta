import type { Product } from './types';

export async function searchOlimpica(query: string): Promise<Product[]> {
  const url = `https://www.olimpica.com/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=15&map=ft`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'es-CO,es;q=0.9',
        'Referer': 'https://www.olimpica.com/',
      },
      cache: 'no-store',
    });

    console.log('[Olimpica] status:', res.status);

    const data = await res.json();

    console.log('[Olimpica] productos:', Array.isArray(data) ? data.length : 'no es array');

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => {
      const seller = item.items?.[0]?.sellers?.[0]?.commertialOffer;
      return {
        name: item.productName,
        price: seller?.Price ?? 0,
        originalPrice: seller?.ListPrice !== seller?.Price ? seller?.ListPrice : undefined,
        image: item.items?.[0]?.images?.[0]?.imageUrl ?? '',
        url: `https://www.olimpica.com/${item.linkText}/p`,
        store: 'Olímpica',
      };
    }).filter((p: Product) => p.price > 0);

  } catch (e) {
    console.error('[Olimpica] error:', e);
    return [];
  }
}
