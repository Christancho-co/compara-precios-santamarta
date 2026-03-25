// Megatiendas usa VTEX - API pública confirmada ✅
export interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  url: string;
  store: string;
  unit?: string;
  pricePerGram?: number;
}

export async function searchMegatiendas(query: string): Promise<Product[]> {
  const url = `https://www.megatiendas.co/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=20&map=ft`;
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
    next: { revalidate: 3600 }, // cache 1 hora
  });

  if (!res.ok) return [];

  const data = await res.json();

  return data.map((item: any) => {
    const seller = item.items?.[0]?.sellers?.[0]?.commertialOffer;
    const price = seller?.Price ?? 0;
    const listPrice = seller?.ListPrice ?? 0;
    const unit = item.items?.[0]?.measurementUnit ?? '';
    const unitMultiplier = item.items?.[0]?.unitMultiplier ?? 1;
    const gramo = unit === 'g' ? price / (unitMultiplier) : undefined;

    return {
      name: item.productName,
      price,
      originalPrice: listPrice !== price ? listPrice : undefined,
      image: item.items?.[0]?.images?.[0]?.imageUrl ?? '',
      url: `https://www.megatiendas.co/${item.linkText}/p`,
      store: 'Megatiendas',
      unit: `${unitMultiplier}${unit}`,
      pricePerGram: gramo,
    };
  }).filter((p: Product) => p.price > 0);
}

