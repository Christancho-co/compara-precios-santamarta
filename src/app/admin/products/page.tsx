'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  normalized_name: string
  category: string
  unit: string
  size_value: number
  size_unit: string
  is_active: boolean
}

const CATEGORIES = [
  'todos', 'granos', 'aceites', 'lacteos', 'carnes',
  'fruver', 'panaderia', 'bebidas', 'condimentos',
  'aseo personal', 'aseo hogar', 'otros'
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState('todos')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category !== 'todos') params.set('category', category)
    params.set('limit', '100')

    fetch(`/api/products/search?${params}`)
      .then(r => r.json())
      .then(setProducts)
  }, [search, category])

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">📦 Productos</h2>
      <p className="text-gray-400 mb-6">
        {products.length} productos encontrados
      </p>

      {/* Filtros */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-400 focus:outline-none flex-1 min-w-48"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-400 focus:outline-none"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Tamaño</th>
              <th className="text-left px-4 py-3">Unidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b border-gray-800/50 hover:bg-gray-800/50 transition ${
                  i % 2 === 0 ? '' : 'bg-gray-800/20'
                }`}
              >
                <td className="px-4 py-3 font-medium capitalize">
                  {product.normalized_name}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {product.size_value} {product.size_unit}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {product.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
