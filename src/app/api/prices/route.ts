import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const store_id = searchParams.get('store_id') || ''
  const product_id = searchParams.get('product_id') || ''

  let query = supabase
    .from('store_products')
    .select(`
      *,
      products(normalized_name, category, unit, size_value, size_unit),
      stores(name, address, chain_id,
        chains(name, slug)
      )
    `)

  if (store_id) query = query.eq('store_id', store_id)
  if (product_id) query = query.eq('product_id', product_id)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { store_id, product_id, original_name, base_price, promo_price } = body

  if (!store_id || !product_id || !original_name || !base_price) {
    return NextResponse.json(
      { error: 'store_id, product_id, original_name y base_price son requeridos' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('store_products')
    .upsert({
      store_id,
      product_id,
      original_name,
      base_price,
      promo_price: promo_price || null,
      source: 'manual',
      captured_at: new Date().toISOString()
    }, {
      onConflict: 'store_id,product_id'
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
