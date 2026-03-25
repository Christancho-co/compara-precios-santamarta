import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const radius = parseFloat(searchParams.get('radius') || '5000')

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'lat y lng son requeridos' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase.rpc('get_nearby_stores', {
    user_lat: lat,
    user_lng: lng,
    radius_meters: radius
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
