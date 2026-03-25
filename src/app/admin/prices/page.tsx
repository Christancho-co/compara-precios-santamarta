'use client'

import { useState, useEffect } from 'react'

interface Store {
  id: string
  name: string
  address: string
  chains: { name: string; slug: string }
}

interface Product {
  id: string
  normalized_name: string
  category: string
  unit: string
  size_value: number
  size_unit: string
}

export default function PricesPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedStore, setSelectedStore] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [basePrice, setBasePrice] = useState('')
  const [promoPrice, setPromoPrice] = useState('')
  const [originalName, setOriginalName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/stores')
      .then(r => r.json())
      .then(setStores)
  }, [])

  useEffect(() => {
    if (searchProduct.length < 2) {
      setProducts([])
      return
    }
    const timeout = setTimeout(() => {
      fetch(`/api/products/search?q=${searchProduct}&limit=10`)
        .then(r => r.json())
        .then(setProducts)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchProduct])

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setOriginalName(product.normalized_name)
    setProducts([])
    setSearchProduct(product.normalized_name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStore || !selectedProduct || !basePrice || !originalName) {
      setMessage('❌ Completa todos los campos requeridos')
      return
    }

    setLoading(true)
    setMessage('')

    const res = await fetch('/api/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_id: selectedStore,
        product_id: selectedProduct.id,
        original_name: originalName,
        base_price: parseFloat(basePrice),
        promo_price: promoPrice ? parseFloat(promoPrice) : null
      })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('✅ Precio guardado correctamente')
      setBasePrice('')
      setPromoPrice('')
      setSearchProduct('')
      setSelectedProduct(null)
      setOriginalName('')
    } else {
      setMessage(`❌ Error: ${data.error}`)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold mb-2">💰 Cargar Precios</h2>
      <p className="text-gray-400 mb-8">
        Agrega o actualiza el precio de un producto en una tienda específica.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Tienda */}
        <div>
          <label htmlFor="store" className="block text-sm font-medium text-gray-300 mb-2">
            🏪 Tienda *
          </label>
          <select
            id="store"
            value={selectedStore}
            onChange={e => setSelectedStore(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
          >
            <option value="">Selecciona una tienda...</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.chains?.name} - {store.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buscar producto */}
        <div className="relative">
          <label htmlFor="product-search" className="block text-sm font-medium text-gray-300 mb-2">
            📦 Producto *
          </label>
          <input
            type="text"
            value={searchProduct}
            onChange={e => {
              setSearchProduct(e.target.value)
              setSelectedProduct(null)
            }}
            placeholder="Escribe para buscar: arroz, leche, aceite..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
          />
          {products.length > 0 && (
            <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-auto">
              {products.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelectProduct(product)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
                >
                  <p className="text-white font-medium capitalize">
                    {product.normalized_name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {product.category} · {product.size_value} {product.size_unit} · {product.unit}
                  </p>
                </button>
              ))}
            </div>
          )}
          {selectedProduct && (
            <p className="text-green-400 text-xs mt-1">
              ✅ Seleccionado: {selectedProduct.normalized_name} ({selectedProduct.size_value}{selectedProduct.size_unit})
            </p>
          )}
        </div>

        {/* Nombre original */}
        <div>
          <label htmlFor="original-name" className="block text-sm font-medium text-gray-300 mb-2">
            🏷️ Nombre exacto en la tienda *
          </label>
          <input
            type="text"
            id="original-name"
            value={originalName}
            onChange={e => setOriginalName(e.target.value)}
            placeholder="Ej: Arroz Diana x 1000g"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
          />
          <p className="text-gray-500 text-xs mt-1">
            Escribe el nombre tal como aparece en la tienda o etiqueta
          </p>
        </div>

        {/* Precio base */}
        <div>
          <label htmlFor="base-price" className="block text-sm font-medium text-gray-300 mb-2">
            💵 Precio base (COP) *
          </label>
          <input
            type="number"
            id="base-price"
            value={basePrice}
            onChange={e => setBasePrice(e.target.value)}
            placeholder="Ej: 4500"
            min="0"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
          />
        </div>

        {/* Precio promocional */}
        <div>
          <label htmlFor="promo-price" className="block text-sm font-medium text-gray-300 mb-2">
            🔥 Precio promocional (COP){' '}
            <span className="text-gray-500 font-normal">opcional</span>
          </label>
          <input
            type="number"
            value={promoPrice}
            onChange={e => setPromoPrice(e.target.value)}
            placeholder="Ej: 3900 (si tiene descuento activo)"
            min="0"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none"
          />
          <p className="text-gray-500 text-xs mt-1">
            Solo si tiene promoción activa esta semana
          </p>
        </div>

        {/* Mensaje */}
        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${
            message.startsWith('✅')
              ? 'bg-green-900/30 border border-green-700 text-green-400'
              : 'bg-red-900/30 border border-red-700 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 px-6 rounded-lg transition"
        >
          {loading ? 'Guardando...' : 'Guardar Precio'}
        </button>

      </form>
    </div>
  )
}
