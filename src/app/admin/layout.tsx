import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-2">
        <h1 className="text-xl font-bold text-green-400 mb-6">
          🛒 Market Compare
        </h1>
        <p className="text-xs text-gray-500 uppercase mb-2">Admin Panel</p>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/prices"
          className="px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
        >
          💰 Cargar Precios
        </Link>
        <Link
          href="/admin/stores"
          className="px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-800 hover:text-white transition"
        >
          🏪 Tiendas
        </Link>
        <Link
          href="/admin/products"
          className="px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
        >
          📦 Productos
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
