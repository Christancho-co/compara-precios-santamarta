import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  try {
    const { data: storeProducts, error } = await supabase
      .from('store_products')
      .select('id, original_name, base_price, promo_price, store_id, product_id')
      .order('original_name');

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name');

    if (storesError) {
      console.error('Error fetching stores:', storesError);
    }

    const storeMap = new Map(stores?.map(s => [s.id, s.name]) || []);
    const grouped = new Map<string, any[]>();

    for (const sp of storeProducts || []) {
      const normalizedName = normalizeProductName(sp.original_name);
      
      if (query && !normalizedName.includes(query) && !sp.original_name.toLowerCase().includes(query)) {
        continue;
      }

      if (!grouped.has(normalizedName)) {
        grouped.set(normalizedName, []);
      }

      const storeName = storeMap.get(sp.store_id) || 'Desconocido';
      const price = sp.promo_price || sp.base_price;

      grouped.get(normalizedName)!.push({
        store_name: storeName,
        price: parseFloat(price.toString()),
        original_name: sp.original_name,
        store_id: sp.store_id
      });
    }

    const products = Array.from(grouped.entries()).map(([normalizedName, stores]) => {
      const sortedStores = stores.sort((a, b) => a.price - b.price);
      return {
        normalized_name: normalizedName,
        stores: sortedStores,
        cheapest_price: sortedStores[0]?.price || 0,
        cheapest_store: sortedStores[0]?.store_name || '',
        store_count: sortedStores.length
      };
    });

    products.sort((a, b) => a.normalized_name.localeCompare(b.normalized_name));

    return NextResponse.json(
      { products, total: products.length, query: query || null },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+x\s+\d+.*$/i, '')
    .replace(/\d+\s*(g|kg|ml|l|gr|und?s?|unidades?)\s*$/i, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3)
    .join(' ');
}
