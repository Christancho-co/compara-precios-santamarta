'use client';
import { useState, useEffect } from 'react';
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
  ChevronDown,
  Filter,
  Check
} from 'lucide-react';

const STORES = ['Megatiendas', 'D1', 'Éxito', 'Olímpica', 'Ara'];
const STORE_COLORS: Record<string, string> = {
  'Megatiendas': 'bg-blue-600',
  'D1': 'bg-[#E30613]', // D1 Red
  'Éxito': 'bg-[#FFD100]', // Exito Yellow
  'Olímpica': 'bg-[#ED1C24]', // Olimpica Red
  'Ara': 'bg-[#FF8200]', // Ara Orange
};

type Tab = 'dashboard' | 'new-list' | 'map' | 'compare';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Arroz Diana', 'Leche Alquería', 'Aceite Vegetal']);

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
    } catch {
      setError('Error al buscar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const renderDashboard = () => (
    <div className=\"space-y-6\">
      {/* Welcome Card */}
      <div className=\"bg-[#014421] text-white p-6 rounded-[2.5rem] relative overflow-hidden shadow-xl\">
        <div className=\"relative z-10\">
          <p className=\"text-green-200 text-sm font-medium mb-1\">Mercado Curado</p>
          <h2 className=\"text-3xl font-bold leading-tight mb-4\">Encuentra el precio más bajo en segundos.</h2>
          <button 
            onClick={() => setActiveTab('new-list')}
            className=\"bg-[#D4E952] text-[#014421] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white transition-all\"
          >
            <Search size={18} /> Comparar Ahora
          </button>
        </div>
        <div className=\"absolute -right-10 -bottom-10 w-48 h-48 bg-green-800 rounded-full opacity-50 blur-3xl\"></div>
      </div>

      {/* Daily Promotions */}
      <section>
        <div className=\"flex justify-between items-center mb-4\">
          <h3 className=\"text-xl font-bold text-gray-800\">Promociones del Día</h3>
          <button className=\"text-sm font-semibold text-[#014421]\">Ver todas</button>
        </div>
        <div className=\"flex gap-4 overflow-x-auto pb-4 no-scrollbar\">
          {[
            { name: 'Frutas y Verduras Frescas', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80', discount: 'Hasta 30% OFF' },
            { name: 'Aceites y Abarrotes', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', discount: '$12.500' },
            { name: 'Panadería Artesanal', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', discount: '$4.200' }
          ].map((promo, i) => (
            <div key={i} className=\"min-w-[160px] bg-white rounded-3xl p-3 shadow-sm border border-gray-100\">
              <img src={promo.img} className=\"w-full h-32 object-cover rounded-2xl mb-3\" alt=\"\" />
              <p className=\"text-xs font-bold text-gray-500 mb-1\">{promo.discount}</p>
              <h4 className=\"text-sm font-bold text-gray-800 line-clamp-1\">{promo.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Lists */}
      <section>
        <h3 className=\"text-xl font-bold text-gray-800 mb-4\">Mis Listas Recientes</h3>
        <div className=\"space-y-3\">
          <div className=\"bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100 shadow-sm\">
            <div className=\"flex items-center gap-4\">
              <div className=\"w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600\">
                <History size={24} />
              </div>
              <div>
                <h4 className=\"font-bold text-gray-800\">Mercado Semanal</h4>
                <p className=\"text-xs text-gray-500\">12 items • Última vez: Ayer</p>
              </div>
            </div>
            <ChevronRight className=\"text-gray-400\" />
          </div>
          <div className=\"bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100 shadow-sm\">
            <div className=\"flex items-center gap-4\">
              <div className=\"w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600\">
                <History size={24} />
              </div>
              <div>
                <h4 className=\"font-bold text-gray-800\">Asado Familiar</h4>
                <p className=\"text-xs text-gray-500\">5 items • Última vez: 2 días</p>
              </div>
            </div>
            <ChevronRight className=\"text-gray-400\" />
          </div>
        </div>
      </section>
    </div>
  );

  const renderNewList = () => (
    <div className=\"space-y-6\">
      <div className=\"flex items-center justify-between\">
        <h2 className=\"text-2xl font-bold text-gray-800\">Crear Lista</h2>
        <button className=\"text-red-500 font-semibold text-sm\">Limpiar</button>
      </div>
      
      <form onSubmit={handleSearch} className=\"relative\">
        <Search className=\"absolute left-4 top-1/2 -translate-y-1/2 text-gray-400\" size={20} />
        <input 
          type=\"text\" 
          placeholder=\"¿Qué necesitas hoy? Ej: Arroz, Leche...\" 
          className=\"w-full bg-white border border-gray-200 rounded-[2rem] pl-12 pr-4 py-4 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#014421] transition-all\"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type=\"submit\" className=\"hidden\">Buscar</button>
      </form>

      <section>
        <h3 className=\"text-sm font-bold text-gray-400 uppercase tracking-widest mb-4\">Sugerencias frecuentes</h3>
        <div className=\"flex flex-wrap gap-2\">
          {recentSearches.map((s, i) => (
            <button 
              key={i} 
              onClick={() => { setQuery(s); }}
              className=\"bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors\"
            >
              + {s}
            </button>
          ))}
        </div>
      </section>

      <section className=\"pt-4\">
        <h3 className=\"text-xl font-bold text-gray-800 mb-4\">Mi Lista</h3>
        <div className=\"bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center\">
          <div className=\"w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4\">
            <ListPlus className=\"text-gray-300\" size={32} />
          </div>
          <p className=\"text-gray-500\">Tu lista está vacía.</p>
          <p className=\"text-sm text-gray-400 mt-1\">Agrega productos para comparar precios.</p>
        </div>
      </section>

      <button 
        disabled={!query}
        onClick={handleSearch}
        className=\"w-full bg-[#014421] text-white py-5 rounded-[2rem] font-bold text-lg shadow-lg disabled:opacity-50 disabled:bg-gray-400 transition-all\"
      >
        Comparar Precios Ahora →
      </button>
    </div>
  );

  const renderCompare = () => (
    <div className=\"space-y-6\">
      {loading ? (
        <div className=\"flex flex-col items-center justify-center py-20 space-y-4\">
          <div className=\"w-12 h-12 border-4 border-[#014421] border-t-transparent rounded-full animate-spin\"></div>
          <p className=\"font-bold text-gray-600\">Analizando precios en 5 tiendas...</p>
        </div>
      ) : results ? (
        <>
          <div className=\"bg-[#D4E952]/20 border border-[#D4E952] p-6 rounded-[2.5rem] relative overflow-hidden\">
            <div className=\"flex items-center gap-3 mb-4\">
              <div className=\"w-10 h-10 bg-[#014421] text-white rounded-full flex items-center justify-center\">
                <TrendingDown size={20} />
              </div>
              <h2 className=\"text-xl font-bold text-[#014421]\">Tu canasta analizada.</h2>
            </div>
            
            <div className=\"flex items-end justify-between\">
              <div>
                <p className=\"text-xs text-gray-500 font-bold uppercase tracking-wider mb-1\">Mejor opción total</p>
                <p className=\"text-3xl font-black text-gray-900\">$184.500</p>
              </div>
              <div className=\"text-right\">
                <span className=\"bg-[#014421] text-white px-3 py-1 rounded-full text-[10px] font-bold\">Tiendas: 2/5</span>
                <p className=\"text-green-600 font-bold mt-1 text-sm\">Ahorras 12% ($22.000)</p>
              </div>
            </div>
          </div>

          <section>
            <div className=\"flex justify-between items-center mb-4\">
              <h3 className=\"text-xl font-bold text-gray-800\">Desglose por Producto</h3>
              <Filter className=\"text-gray-400\" size={20} />
            </div>
            <div className=\"space-y-4\">
              {(results.cheapest as any[]).map((group, i) => (
                <div key={i} className=\"bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100\">
                  <div className=\"flex justify-between items-start mb-4\">
                    <div>
                      <h4 className=\"font-bold text-gray-800 capitalize\">{group.product}</h4>
                      <p className=\"text-xs text-gray-400\">{group.allPrices.length} opciones encontradas</p>
                    </div>
                    <MoreVertical className=\"text-gray-300\" size={20} />
                  </div>
                  
                  <div className=\"grid grid-cols-2 gap-3\">
                    {(group.allPrices as any[]).slice(0, 2).map((p, j) => (
                      <div key={j} className={`p-4 rounded-2xl border ${j === 0 ? 'border-green-200 bg-green-50/50' : 'border-gray-100'}`}>
                        <div className=\"flex items-center justify-between mb-2\">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${STORE_COLORS[p.store] || 'bg-gray-400'}`}>
                            {p.store}
                          </span>
                          {j === 0 && <Check size={14} className=\"text-green-600\" />}
                        </div>
                        <p className=\"text-lg font-black text-gray-900\">${p.price.toLocaleString('es-CO')}</p>
                        <p className=\"text-[10px] text-gray-400 truncate\">{p.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className=\"text-center py-20\">
          <div className=\"w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6\">
            <ArrowLeftRight className=\"text-gray-200\" size={40} />
          </div>
          <h3 className=\"text-xl font-bold text-gray-800\">Nada para comparar</h3>
          <p className=\"text-gray-500 mt-2\">Ve a la pestaña \"Nueva Lista\" y agrega productos.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className=\"min-h-screen bg-[#F8F9FA] pb-32\">
      {/* Top Navbar */}
      <header className=\"bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm\">
        <div className=\"flex items-center gap-3\">
          <Menu className=\"text-gray-800\" size={24} />
          <h1 className=\"font-black text-xl text-[#014421] tracking-tight\">MERCADO<span className=\"text-[#D4E952]\">CURADO</span></h1>
        </div>
        <div className=\"flex items-center gap-4\">
          <div className=\"relative\">
            <Bell size={24} className=\"text-gray-400\" />
            <span className=\"absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white\"></span>
          </div>
          <div className=\"w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm\">
            <User size={20} className=\"text-gray-400\" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className=\"max-w-xl mx-auto px-6 py-6\">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'new-list' && renderNewList()}
        {activeTab === 'compare' && renderCompare()}
        {activeTab === 'map' && (
          <div className=\"text-center py-20\">
            <MapPin className=\"mx-auto text-gray-200 mb-4\" size={64} />
            <h2 className=\"text-2xl font-bold\">Mapa de Tiendas</h2>
            <p className=\"text-gray-500\">Próximamente: Ubica las tiendas más baratas cerca de ti.</p>
          </div>
        )}
      </main>

      {/* Custom Bottom Tab Bar */}
      <nav className=\"fixed bottom-8 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] h-20 shadow-2xl flex items-center justify-around px-4 z-[100]\">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-[#014421]' : 'text-gray-300'}`}
        >
          <LayoutDashboard size={26} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
          <span className=\"text-[10px] font-bold uppercase tracking-tighter\">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('new-list')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'new-list' ? 'text-[#014421]' : 'text-gray-300'}`}
        >
          <ListPlus size={26} strokeWidth={activeTab === 'new-list' ? 2.5 : 2} />
          <span className=\"text-[10px] font-bold uppercase tracking-tighter\">Nueva Lista</span>
        </button>
        <button 
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'compare' ? 'text-[#014421]' : 'text-gray-300'}`}
        >
          <ArrowLeftRight size={26} strokeWidth={activeTab === 'compare' ? 2.5 : 2} />
          <span className=\"text-[10px] font-bold uppercase tracking-tighter\">Comparar</span>
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'map' ? 'text-[#014421]' : 'text-gray-300'}`}
        >
          <MapPin size={26} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
          <span className=\"text-[10px] font-bold uppercase tracking-tighter\">Mapa</span>
        </button>
      </nav>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
