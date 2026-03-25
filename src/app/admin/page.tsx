export default function AdminPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-400 mb-8">
        Panel de administración - Market Compare Santa Marta
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Cadenas</p>
          <p className="text-4xl font-bold text-green-400 mt-1">5</p>
          <p className="text-gray-500 text-xs mt-2">
            Éxito, D1, Ara, Olímpica, Megatiendas
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Sedes en Santa Marta</p>
          <p className="text-4xl font-bold text-green-400 mt-1">16</p>
          <p className="text-gray-500 text-xs mt-2">Con coordenadas verificadas</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Productos base</p>
          <p className="text-4xl font-bold text-green-400 mt-1">196</p>
          <p className="text-gray-500 text-xs mt-2">En 10 categorías</p>
        </div>
      </div>

      {/* Próximos pasos */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Próximos pasos</h3>
        <ul className="space-y-2 text-gray-400 list-none">
          <li>
            <span className="text-green-400 mr-2">✅</span> Cadenas cargadas
          </li>
          <li>
            <span className="text-green-400 mr-2">✅</span> Sedes con coordenadas
          </li>
          <li>
            <span className="text-green-400 mr-2">✅</span> Catálogo de productos
          </li>
          <li>
            <span className="text-yellow-400 mr-2">⏳</span> Cargar precios por tienda
          </li>
          <li>
            <span className="text-gray-600 mr-2">⬜</span> Motor de comparación
          </li>
          <li>
            <span className="text-gray-600 mr-2">⬜</span> App para usuarios
          </li>
        </ul>
      </div>
    </div>
  )
}
