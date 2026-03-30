import { NextResponse } from 'next/server'

// Olímpica: extrae clusterHighlights de su API VTEX
async function getOlimpicaPromos() {
  try {
    const res = await fetch(
      'https://www.olimpica.com/api/catalog_system/pub/products/search/?O=OrderByScoreDESC&_from=0&_to=5&sc=1',
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const promos = new Set<string>()
    data?.forEach((p: any) => {
      Object.values(p.clusterHighlights || {}).forEach((v: any) => promos.add(v))
    })
    return [...promos].slice(0, 3).map(p => ({ store: 'olimpica', text: p }))
  } catch { return [{ store: 'olimpica', text: 'Ofertas disponibles en tienda' }] }
}

// Éxito: misma arquitectura VTEX
async function getExitoPromos() {
  try {
    const res = await fetch(
      'https://www.exito.com/api/catalog_system/pub/products/search/?O=OrderByScoreDESC&_from=0&_to=5',
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const promos = new Set<string>()
    data?.forEach((p: any) => {
      Object.values(p.clusterHighlights || {}).forEach((v: any) => promos.add(v))
    })
    return [...promos].slice(0, 3).map(p => ({ store: 'exito', text: p }))
  } catch { return [{ store: 'exito', text: 'Descuentos semanales en todas las secciones' }] }
}

// D1 y Ara: hardcodeadas por ahora
function getD1Promos() {
  return [
    { store: 'd1', text: 'Arroz x10kg desde $18.900' },
    { store: 'd1', text: 'Aceite 3L desde $22.500' },
  ]
}
function getAraPromos() {
  return [
    { store: 'ara', text: 'Precios bajos garantizados' },
    { store: 'ara', text: '2x1 en productos seleccionados' },
  ]
}

export async function GET() {
  const [olimpica, exito] = await Promise.allSettled([
    getOlimpicaPromos(),
    getExitoPromos(),
  ])
  return NextResponse.json({
    promotions: [
      ...(olimpica.status === 'fulfilled' ? olimpica.value : []),
      ...(exito.status === 'fulfilled' ? exito.value : []),
      ...getD1Promos(),
      ...getAraPromos(),
    ],
    updatedAt: new Date().toISOString()
  })
}