import type { Product } from './types';
import { fetch as undiciFetch } from 'undici';

export async function searchOlimpica(query: string): Promise<Product[]> {
  const url = `https://www.olimpica.com/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=15&map=ft`;

  try {
    const res = await undiciFetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-CO,es;q=0.9',
        'Referer': 'https://www.olimpica.com/',
      },
    });

    const text = await res.text();
    console.log('[Olimpica] status:', res.status);
    console.log('[Olimpica] preview:', text.slice(0, 200));

    // ✅ Después — acepta 200 Y 206 (Partial Content)
if (res.status !== 200 && res.status !== 206) return [];
if (!text.startsWith('[')) {
  console.log('[Olimpica] respuesta inesperada:', text.slice(0, 100));
  return [];
}

    const data = JSON.parse(text);

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
