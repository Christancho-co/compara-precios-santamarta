import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const limit = parseInt(searchParams.get('limit') || '20')

  let supabaseQuery = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('normalized_name')
    .limit(limit)

  if (query) {
    supabaseQuery = supabaseQuery.ilike('search_text', `%${query}%`)
  }

  if (category) {
    supabaseQuery = supabaseQuery.eq('category', category)
  }

  const { data, error } = await supabaseQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
