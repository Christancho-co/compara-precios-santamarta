import { NextRequest, NextResponse } from 'next/server';
import { searchMegatiendas } from '@/lib/scrapers/megatiendas';
import { searchD1 } from '@/lib/scrapers/d1';
import { searchExito } from '@/lib/scrapers/exito';
import { searchOlimpica } from '@/lib/scrapers/olimpica';
import { searchAra } from '@/lib/scrapers/ara';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim();
  if (!query) {
    return NextResponse.json({ error: 'Parámetro q requerido' }, { status: 400 });
  }

  const [megatiendas, d1, exito, olimpica, ara] = await Promise.allSettled([
    searchMegatiendas(query),
    searchD1(query),
    searchExito(query),
    searchOlimpica(query),
    searchAra(query),
  ]);

  const stores = {
    megatiendas: megatiendas.status === 'fulfilled' ? megatiendas.value : [],
    d1:          d1.status === 'fulfilled'          ? d1.value          : [],
    exito:       exito.status === 'fulfilled'       ? exito.value       : [],
    olimpica:    olimpica.status === 'fulfilled'    ? olimpica.value    : [],
    ara:         ara.status === 'fulfilled'         ? ara.value         : [],
  };

  const cheapest = buildComparisonGroups(stores);

  return NextResponse.json({
    query,
    timestamp: new Date().toISOString(),
    stores,
    cheapest,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}

function buildComparisonGroups(stores: Record<string, any[]>) {
  const allProducts = Object.entries(stores).flatMap(([, products]) => products);

  const groups: Record<string, any[]> = {};
  allProducts.forEach(p => {
    const key = normalizeKey(p.name);
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  return Object.entries(groups)
    .filter(([, ps]) => ps.length >= 1)
    .map(([key, products]) => ({
      product: key,
      cheapest: [...products].sort((a, b) => a.price - b.price)[0],
      allPrices: [...products].sort((a, b) => a.price - b.price),
      savings: products.length > 1
        ? Math.max(...products.map(p => p.price)) - Math.min(...products.map(p => p.price))
        : 0,
    }))
    .sort((a, b) => b.savings - a.savings); // primero los de mayor ahorro
}

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 35);
}
