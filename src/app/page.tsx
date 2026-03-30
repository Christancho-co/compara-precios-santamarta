'use client';

import { useEffect, useState } from 'react';  
import { 
  Search, 
  LayoutDashboard, 
  ListPlus, 
  MapPin, 
  ArrowLeftRight, 
  ChevronRight, 
  TrendingDown, 
  History,
  Menu,
  Bell,
  User,
  MoreVertical,
  Filter,
  Check
} from 'lucide-react';

const STORES = ['Megatiendas', 'D1', 'Éxito', 'Olímpica', 'Ara'];

const STORE_COLORS: Record<string, string> = {
  'Megatiendas': 'bg-blue-600',
  'D1': 'bg-[#E30613]',
  'Éxito': 'bg-[#FFD100]',
  'Olímpica': 'bg-[#ED1C24]',
  'Ara': 'bg-[#FF8200]',
};

type Tab = 'dashboard' | 'new-list' | 'map' | 'compare';

export default function Home() {

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ PROMOCIONES BIEN UBICADAS
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/promotions')
      .then(r => r.json())
      .then(d => setPromotions(d.promotions || []))
      .catch(() => setPromotions([]));
  }, []);

  const [recentSearches] = useState(['Arroz Diana', 'Leche Alquería', 'Aceite Vegetal']);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setActiveTab('compare');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error buscando');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('Error al buscar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">

      <div className="bg-[#014421] text-white p-6 rounded-[2.5rem] relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <p className="text-green-200 text-sm font-medium mb-1">Mercado Curado</p>
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Encuentra el precio más bajo en segundos.
          </h2>
          <button 
            onClick={() => setActiveTab('new-list')}
            className="bg-[#D4E952] text-[#014421] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white transition-all"
          >
            <Search size={18} /> Comparar Ahora
          </button>
        </div>
      </div>

      {/* 🔥 NUEVA SECCIÓN DINÁMICA */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          🔥 Promociones de hoy
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {promotions.length === 0 ? (
            <p className="text-sm text-gray-400">No hay promociones hoy</p>
          ) : (
            promotions.map((promo, i) => (
              <div
                key={i}
                className={`flex-shrink-0 rounded-xl p-3 min-w-[200px] text-white ${STORE_COLORS[promo.store] || 'bg-gray-400'}`}
              >
                <span className="text-xs font-bold uppercase">
                  {promo.store}
                </span>
                <p className="text-sm mt-1">{promo.text}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Listas Recientes</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <History size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Mercado Semanal</h4>
                <p className="text-xs text-gray-500">12 items</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      </section>
    </div>
  );

  const renderNewList = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Crear Lista</h2>
      
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="¿Qué necesitas hoy?" 
          className="w-full bg-white border border-gray-200 rounded-[2rem] pl-12 pr-4 py-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="flex flex-wrap gap-2">
        {recentSearches.map((s, i) => (
          <button key={i} onClick={() => setQuery(s)} className="bg-gray-100 px-4 py-2 rounded-full text-sm">
            + {s}
          </button>
        ))}
      </div>

      <button 
        disabled={!query || loading}
        onClick={handleSearch}
        className="w-full bg-[#014421] text-white py-5 rounded-[2rem] font-bold disabled:bg-gray-400"
      >
        {loading ? 'Buscando...' : 'Comparar Precios Ahora →'}
      </button>
    </div>
  );

  const renderCompare = () => (
    <div className="space-y-6">
      {loading ? (
        <p>Analizando precios...</p>
      ) : results ? (
        <div>
          <p className="text-2xl font-bold">
            ${results.totalPrice?.toLocaleString('es-CO')}
          </p>
        </div>
      ) : (
        <p>Sin resultados</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">

      <header className="bg-white px-6 py-5 flex justify-between shadow-sm">
        <h1 className="font-black text-xl text-[#014421]">
          MERCADO<span className="text-[#D4E952]">CURADO</span>
        </h1>
      </header>

      <main className="max-w-xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'new-list' && renderNewList()}
        {activeTab === 'compare' && renderCompare()}
      </main>

    </div>
  );
}