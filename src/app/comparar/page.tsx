'use client'

import { useState } from 'react'

interface ResultItem {
  store_id: string
  chain_name: string
  store_name: string
  address: string
  distance_meters: number
  items_found: number
  items_total: number
  subtotal: number
  savings: number
  final_total: number
  coverage_pct: number
  is_cheapest?: boolean
  is_nearest?: boolean
}

interface CompareResult {
  searched_items: number
  matched_items: number
  not_found: string[]
  results: ResultItem[]
  summary: {
    cheapest?: ResultItem
    nearest?: ResultItem
    best_balance?: ResultItem
  }
}

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(n)

const CHAIN_COLORS: Record<string, string> = {
  'Éxito':       'border-yellow-500 bg-yellow-500/10',
  'D1':          'border-red-500 bg-red-500/10',
  'Ara':         'border-orange-500 bg-orange-500/10',
  'Olímpica':    'border-blue-500 bg-blue-500/10',
  'Megatiendas': 'border-purple-500 bg-purple-500/10',
}

const CHAIN_BADGE: Record<string, string> = {
  'Éxito':       'bg-yellow-500/20 text-yellow-400',
  'D1':          'bg-red-500/20 text-red-400',
  'Ara':         'bg-orange-500/20 text-orange-400',
  'Olímpica':    'bg-blue-500/20 text-blue-400',
  'Megatiendas': 'bg-purple-500/20 text-purple-400',
}

export default function CompararPage() {
  const [listText, setListText]         = useState('')
  const [loading, setLoading]           = useState(false)
  const [result, setResult]             = useState<CompareResult | null>(null)
  const [error, setError]               = useState('')
  const [locating, setLocating]         = useState(false)
  const [userLocation, setUserLocation] = useState<{lat:number;lng:number}|null>(null)

  const getLocation = () => {
    if (!navigator?.geolocation) {
      setError('Geolocalización no disponible en este navegador')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        // fallback a coordenadas de Santa Marta
        setUserLocation({ lat: 11.2408, lng: -74.2110 })
        setLocating(false)
      },
      { timeout: 10000 }
    )
  }

  const handleCompare = async () => {
    setError('')
    const rawLines = listText.split('\n').map(l => l.trim()).filter(Boolean)
    if (rawLines.length === 0) { setError('Escribe al menos un producto'); return }

    const loc   = userLocation || { lat: 11.2408, lng: -74.2110 }
    const items = rawLines.map(name => ({ name }))

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, lat: loc.lat, lng: loc.lng, radius: 8000 })
      })

      // protección si la respuesta no es JSON válido
      const data = await res.json().catch(() => ({ error: 'Respuesta no válida del servidor' }))

      if (!res.ok) {
        const msg = data?.error || 'Error al comparar'
        setError(msg)
        return
      }

      // validaciones mínimas sobre la estructura de la respuesta
      if (!data || !Array.isArray(data.results)) {
        setError('Respuesta inesperada del servidor')
        return
      }

      // normalizar campos opcionales
      const normalized: CompareResult = {
        searched_items: Number(data.searched_items) || items.length,
        matched_items: Number(data.matched_items) || 0,
        not_found: Array.isArray(data.not_found) ? data.not_found : [],
        results: data.results as ResultItem[],
        summary: data.summary || {}
      }

      setResult(normalized)
    } catch (err: any) {
      setError(err?.message || 'Error de red al comparar')
    } finally {
      setLoading(false)
    }
  }

  const productCount = listText.split('\n').map(l => l.trim()).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-400">🛒 Market Compare</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Escribe tu lista y te decimos dónde comprar más barato en Santa Marta
          </p>
        </div>

        <div className="mb-4">
          {userLocation ? (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 border border-green-800 rounded-lg px-4 py-2">
              <span>📍</span>
              <span>Ubicación activa · {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
              <button onClick={()=>setUserLocation(null)} className="ml-auto text-gray-500 hover:text-red-400 text-xs">cambiar</button>
            </div>
          ) : (
            <button onClick={getLocation} disabled={locating}
              className="w-full border border-gray-700 hover:border-green-500 rounded-lg px-4 py-3 text-gray-300 hover:text-green-400 transition text-sm">
              {locating ? '📍 Obteniendo ubicación...' : '📍 Usar mi ubicación para mejores resultados'}
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Tu lista de mercado <span className="text-gray-600">(un producto por línea)</span>
          </label>
          <textarea
            value={listText}
            onChange={e => setListText(e.target.value)}
            rows={8}
            aria-label="Tu lista de mercado"
            placeholder={'arroz\nhuevos\nleche\naceite\npan\nazucar\npollo\nfrijol'}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-green-400 focus:outline-none resize-none text-sm font-mono"
          />
          <p className="text-gray-600 text-xs mt-1">{productCount} {productCount===1 ? 'producto' : 'productos'} en tu lista</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm" role="alert">{error}</div>
        )}

        <button onClick={handleCompare} disabled={loading||productCount===0}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-4 rounded-xl text-lg transition mb-8">
          {loading ? '⏳ Comparando precios...' : '🔍 Comparar precios'}
        </button>

        {result && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs">Buscados</p>
                <p className="text-2xl font-bold text-white mt-1">{result.searched_items}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs">Encontrados</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{result.matched_items}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs">Tiendas</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{result.results.length}</p>
              </div>
            </div>

            {result.not_found.length > 0 && (
              <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg text-sm text-yellow-400">
                ⚠️ No encontrados: <strong>{result.not_found.join(', ')}</strong>
              </div>
            )}

            {result.summary?.cheapest && (
              <div className="mb-4 bg-green-900/20 border-2 border-green-500 rounded-xl p-5">
                <p className="text-green-400 text-xs font-bold uppercase mb-2">🏆 Mejor precio total</p>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-xl font-bold">{result.summary.cheapest.chain_name}</p>
                    <p className="text-gray-400 text-sm">{result.summary.cheapest.store_name}</p>
                    <p className="text-gray-500 text-xs mt-1">📍 {(result.summary.cheapest.distance_meters/1000).toFixed(1)} km · {result.summary.cheapest.items_found}/{result.summary.cheapest.items_total} productos</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-green-400 text-2xl font-bold">{COP(result.summary.cheapest.final_total)}</p>
                    {result.summary.cheapest.savings > 0 && (
                      <p className="text-green-600 text-xs mt-1">Ahorras {COP(result.summary.cheapest.savings)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result.summary?.nearest && result.summary.nearest.store_id !== result.summary.cheapest?.store_id && (
              <div className="mb-6 bg-blue-900/20 border-2 border-blue-500 rounded-xl p-5">
                <p className="text-blue-400 text-xs font-bold uppercase mb-2">📍 Tienda más cercana</p>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-xl font-bold">{result.summary.nearest.chain_name}</p>
                    <p className="text-gray-400 text-sm">{result.summary.nearest.store_name}</p>
                    <p className="text-gray-500 text-xs mt-1">📍 {(result.summary.nearest.distance_meters/1000).toFixed(1)} km · {result.summary.nearest.items_found}/{result.summary.nearest.items_total} productos</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-blue-400 text-2xl font-bold">{COP(result.summary.nearest.final_total)}</p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-lg font-bold mb-3 text-gray-300">Ranking completo</h2>
            <div className="space-y-3 mb-8">
              {result.results.map((store, i) => (
                <div key={store.store_id}
                  className={`border-2 rounded-xl p-4 ${CHAIN_COLORS[store.chain_name]||'border-gray-700 bg-gray-900'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold text-lg w-5 shrink-0">{i+1}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CHAIN_BADGE[store.chain_name]||'bg-gray-700 text-gray-300'}`}>{store.chain_name}</span>
                          {store.is_cheapest && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">💰 Más barato</span>}
                          {store.is_nearest  && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">📍 Más cercano</span>}
                        </div>
                        <p className="text-white font-medium">{store.store_name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{store.address}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                          <span>📍 {(store.distance_meters/1000).toFixed(1)} km</span>
                          <span>📦 {store.items_found}/{store.items_total} productos</span>
                          <span>🎯 {store.coverage_pct}% cobertura</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold text-lg">{COP(store.final_total)}</p>
                      {store.savings > 0 && (
                        <>
                          <p className="text-gray-500 text-xs line-through">{COP(store.subtotal)}</p>
                          <p className="text-green-400 text-xs">-{COP(store.savings)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}