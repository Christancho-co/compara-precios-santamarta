import type { Product } from './types';

export async function searchOlimpica(query: string): Promise<Product[]> {
  const url = `https://www.olimpica.com/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=15&map=ft`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-CO,es;q=0.9',
        'Referer': 'https://www.olimpica.com/',
        'Origin': 'https://www.olimpica.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
      cache: 'no-store',
    });

    const text = await res.text();

    // LOG para ver qué devuelve realmente
    console.log('[Olimpica] status:', res.status);
    console.log('[Olimpica] preview:', text.slice(0, 300));

    if (!res.ok || !text.startsWith('[')) return [];

    const data = JSON.parse(text);

    return data.map((item: any) => {
      const seller = item.items?.[0]?.sellers?.[0]?.commertialOffer;
      const price = seller?.Price ?? seller?.price ?? 0;
      return {
        name: item.productName,
        price,
        originalPrice: seller?.ListPrice !== price ? seller?.ListPrice : undefined,
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
