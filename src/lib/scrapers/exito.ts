export async function searchExito(query: string): Promise<Product[]> {
  // Éxito usa VTEX también
  const url = `https://www.exito.com/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=15&map=ft`;
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    
    return data.map((item: any) => {
      const seller = item.items?.[0]?.sellers?.[0]?.commertialOffer;
      return {
        name: item.productName,
        price: seller?.Price ?? 0,
        originalPrice: seller?.ListPrice !== seller?.Price ? seller?.ListPrice : undefined,
        image: item.items?.[0]?.images?.[0]?.imageUrl ?? '',
        url: `https://www.exito.com/${item.linkText}/p`,
        store: 'Éxito',
      };
    }).filter((p: Product) => p.price > 0);
  } catch {
    return [];
  }
}
