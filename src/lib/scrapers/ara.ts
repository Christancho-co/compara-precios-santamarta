import type { Product } from './types';

export async function searchAra(query: string): Promise<Product[]> {
  // Ara en línea usa VTEX igual que las demás
  const url = `https://www.mercaraenlinea.com/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=15&map=ft`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-CO,es;q=0.9',
        'Referer': 'https://www.mercaraenlinea.com/',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Ara HTTP ${res.status}`);
    const data = await res.json();

    return data.map((item: any) => {
      const seller = item.items?.[0]?.sellers?.[0]?.commertialOffer;
      return {
        name: item.productName,
        price: seller?.Price ?? 0,
        originalPrice: seller?.ListPrice !== seller?.Price ? seller?.ListPrice : undefined,
        image: item.items?.[0]?.images?.[0]?.imageUrl ?? '',
        url: `https://www.mercaraenlinea.com/${item.linkText}/p`,
        store: 'Ara',
      };
    }).filter((p: Product) => p.price > 0);

  } catch (e) {
    console.error('Ara scraper error:', e);
    return [];
  }
}
