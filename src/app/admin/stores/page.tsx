'use client'

import { useState, useEffect } from 'react'

interface Store {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  opening_hours: string
  is_active: boolean
  chains: { name: string; slug: string }
}

const CHAIN_COLORS: Record<string, string> = {
  exito: 'bg-yellow-500/20 text-yellow-400',
  d1: 'bg-red-500/20 text-red-400',
  ara: 'bg-orange-500/20 text-orange-400',
  olimpica: 'bg-blue-500/20 text-blue-400',
  megatiendas: 'bg-purple-500/20 text-purple-400',
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])

  useEffect(() => {
    fetch('/api/stores')
      .then(r => r.json())
      .then(setStores)
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">🏪 Tiendas</h2>
      <p className="text-gray-400 mb-6">
        {stores.length} sedes activas en Santa Marta
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stores.map(store => (
          <div
            key={store.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  CHAIN_COLORS[store.chains?.slug] || 'bg-gray-700 text-gray-300'
                }`}>
                  {store.chains?.name}
                </span>
              </div>
              <span className="text-green-400 text-xs">● Activa</span>
            </div>
            <h3 className="font-bold text-white mt-2">{store.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{store.address}</p>
            <p className="text-gray-500 text-xs mt-2">{store.opening_hours}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-600">
              <span>📍 {store.lat.toFixed(4)}, {store.lng.toFixed(4)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
