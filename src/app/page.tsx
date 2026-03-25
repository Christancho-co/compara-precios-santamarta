'use client';
import { useState } from 'react';

const STORES = ['Megatiendas', 'D1', 'Éxito', 'Olímpica', 'Ara'];
const STORE_COLORS: Record<string, string> = {
  'Megatiendas': 'bg-blue-600',
  'D1': 'bg-yellow-500',
  'Éxito': 'bg-red-500',
  'Olímpica': 'bg-green-600',
  'Ara': 'bg-orange-500',
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'comparison' | 'byStore'>('comparison');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error buscando');
      const data = await res.json();
      setResults(data);
    } catch {
      setError('Error al buscar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const totalProducts = results
    ? Object.values(results.stores as Record<string, any[]>).reduce((s, a) => s + a.length, 0)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">🛒 Compara Precios Santa Marta</h1>
                    <p className="text-blue-200 text-sm mt-1">
            Compara precios en Éxito, D1, Ara, Olímpica y Megatiendas
          </p>
          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ej: arroz, aceite, leche..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl shadow transition disabled:opacity-50"
            >
              {loading ? '⏳' : '🔍 Buscar'}
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {STORES.map(s => (
              <div key={s} className="bg-white rounded-2xl shadow p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Resultados */}
        {results && !loading && (
          <>
            {/* Resumen rápido */}
            <div className="bg-white rounded-2xl shadow p-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                📊 Resumen — <span className="text-blue-600">{results.query}</span>
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({totalProducts} productos encontrados)
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {STORES.map(store => {
                  const key = store.toLowerCase().replace('é', 'e').replace('ó', 'o');
                  const storeKey = Object.keys(results.stores).find(
                    k => k.toLowerCase().includes(key.slice(0, 4))
                  );
                  const products: any[] = storeKey ? results.stores[storeKey] : [];
                  const cheapest = products.length
                    ? Math.min(...products.map((p: any) => p.price))
                    : null;

                  return (
                    <div key={store} className="text-center border rounded-xl p-3">
                      <span className={`inline-block text-white text-xs font-bold px-2 py-1 rounded-full mb-2 ${STORE_COLORS[store]}`}>
                        {store}
                      </span>
                      <p className="text-gray-500 text-xs">{products.length} productos</p>
                      {cheapest ? (
                        <p className="text-green-600 font-bold text-sm mt-1">
                          Desde ${cheapest.toLocaleString('es-CO')}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-xs mt-1">Sin datos</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['comparison', 'byStore'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
                    activeTab === tab
                      ? 'bg-blue-700 text-white shadow'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'comparison' ? '⚡ Más baratos' : '🏪 Por tienda'}
                </button>
              ))}
            </div>

            {/* Tab: Más baratos */}
            {activeTab === 'comparison' && (
              <div className="space-y-4">
                {(results.cheapest as any[]).slice(0, 20).map((group: any, i: number) => (
                  <div key={i} className="bg-white rounded-2xl shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700 capitalize">{group.product}</h3>
                      <span className="text-xs text-gray-400">{group.allPrices.length} tiendas</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(group.allPrices as any[]).map((p: any, j: number) => (
                        <a
                          key={j}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 min-w-[100px] text-center border-2 rounded-xl p-2 transition hover:shadow-md ${
                            j === 0
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {j === 0 && (
                            <span className="block text-green-600 text-xs font-bold mb-1">
                              🏆 MÁS BARATO
                            </span>
                          )}
                          <span className={`inline-block text-white text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${STORE_COLORS[p.store] ?? 'bg-gray-500'}`}>
                            {p.store}
                          </span>
                          <p className="font-bold text-gray-800">
                            ${p.price.toLocaleString('es-CO')}
                          </p>
                          {p.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              ${p.originalPrice.toLocaleString('es-CO')}
                            </p>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                {results.cheapest.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    No se encontraron productos para comparar
                  </div>
                )}
              </div>
            )}

            {/* Tab: Por tienda */}
            {activeTab === 'byStore' && (
              <div className="space-y-6">
                {STORES.map(store => {
                  const storeKey = Object.keys(results.stores).find(
                    k => k.toLowerCase().replace('é','e').replace('ó','o')
                      .includes(store.toLowerCase().replace('é','e').replace('ó','o').slice(0, 4))
                  );
                  const products: any[] = storeKey ? results.stores[storeKey] : [];
                  if (products.length === 0) return null;

                  return (
                    <div key={store}>
                      <h3 className={`inline-block text-white font-bold px-3 py-1 rounded-full mb-3 ${STORE_COLORS[store]}`}>
                        {store} — {products.length} productos
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {products.slice(0, 12).map((p: any, i: number) => (
                          <a
                            key={i}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-xl shadow hover:shadow-md transition p-3 flex flex-col"
                          >
                            {p.image && (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-24 object-contain mb-2 rounded"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <p className="text-xs text-gray-600 flex-1 line-clamp-2">{p.name}</p>
                            <div className="mt-2">
                              <span className="font-bold text-gray-800">
                                ${p.price.toLocaleString('es-CO')}
                              </span>
                              {p.originalPrice && (
                                <span className="text-xs text-red-400 line-through ml-1">
                                  ${p.originalPrice.toLocaleString('es-CO')}
                                </span>
                              )}
                              {p.unit && (
                                <p className="text-xs text-gray-400">{p.unit}</p>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Estado vacío */}
        {!results && !loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-xl font-medium">Busca un producto para comparar precios</p>
            <p className="text-sm mt-2">Ej: arroz, aceite vegetal, leche entera, papel higiénico</p>
          </div>
        )}
      </div>
    </main>
  );
}


