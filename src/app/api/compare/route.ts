import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { items, lat, lng, radius } = body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'items es requerido y debe ser un array' },
      { status: 400 }
    )
  }

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'lat y lng son requeridos' },
      { status: 400 }
    )
  }

  // 1. Buscar product_ids desde nombres
  const productNames = items.map((i: { name: string }) => i.name.toLowerCase())

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, normalized_name, category, size_value, size_unit')
    .eq('is_active', true)

  if (prodError) {
    return NextResponse.json({ error: prodError.message }, { status: 500 })
  }

  // Matching por similitud simple
  const matchedProducts = productNames.map((name: string) => {
    const match = products?.find(p =>
      p.normalized_name.includes(name) ||
      name.includes(p.normalized_name) ||
      p.normalized_name.split(' ').some((word: string) =>
        word.length > 3 && name.includes(word)
      )
    )
    return {
      searched: name,
      matched: match || null
    }
  })

  const foundIds = matchedProducts
    .filter(m => m.matched !== null)
    .map(m => m.matched!.id)

  if (foundIds.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron productos en el catálogo' },
      { status: 404 }
    )
  }

  // 2. Llamar función de comparación
  const { data: results, error: cmpError } = await supabase.rpc('compare_list', {
    product_ids: foundIds,
    user_lat: lat,
    user_lng: lng,
    radius_meters: radius || 5000
  })

  if (cmpError) {
    return NextResponse.json({ error: cmpError.message }, { status: 500 })
  }

  // 3. Etiquetar ganadores
  const ranked = results as any[]
  if (ranked.length > 0) {
    ranked[0].badge = '🏆 Mejor opción'
    const cheapest = [...ranked].sort((a, b) => a.final_total - b.final_total)[0]
    const nearest  = [...ranked].sort((a, b) => a.distance_meters - b.distance_meters)[0]
    cheapest.is_cheapest = true
    nearest.is_nearest   = true
  }

  return NextResponse.json({
    searched_items: items.length,
    matched_items: foundIds.length,
    not_found: matchedProducts.filter(m => !m.matched).map(m => m.searched),
    results: ranked,
    summary: {
      cheapest: ranked.sort((a, b) => a.final_total - b.final_total)[0],
      nearest:  ranked.sort((a, b) => a.distance_meters - b.distance_meters)[0],
      best_balance: ranked[0]
    }
  })
}
