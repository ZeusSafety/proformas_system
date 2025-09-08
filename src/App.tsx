import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './index.css'
import { requestFcmToken } from './firebase'

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }
}

function useOnline() {
  const [online, setOnline] = useState<boolean>(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme()
  const online = useOnline()
  return (
    <div className="min-h-full flex flex-col bg-white text-black dark:bg-black dark:text-white">
      <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/proformas" className="font-bold text-lg text-[--color-primary]">Proformas</Link>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded ${online ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'}`}>{online ? 'Online' : 'Offline'}</span>
            <button onClick={toggle} className="px-3 py-1 rounded border border-black/10 dark:border-white/10">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t border-black/10 dark:border-white/10 text-center py-3 text-sm">© 2025 Tu Empresa</footer>
    </div>
  )
}

// Mock data
// Carga mock desde JSON público (cacheable offline por PWA)
async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(path)
  return res.json()
}

function LoginPage() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !pass) return setError('Usuario y contraseña requeridos')
    localStorage.setItem('auth', '1')
    Notification.requestPermission().then((res) => {
      if (res === 'granted') requestFcmToken()
    })
    window.location.href = import.meta.env.BASE_URL + 'proformas'
  }
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Usuario" value={user} onChange={(e) => setUser(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-[--color-primary] text-white rounded px-4 py-2 w-full">Entrar</button>
      </form>
    </div>
  )
}

function Guard({ children }: { children: React.ReactElement }) {
  const isAuthed = localStorage.getItem('auth') === '1'
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

function ProformasListPage() {
  const [rows, setRows] = useState<Array<{ id: number; n: string; cliente: string; fecha: string; entrega: string }>>([])
  useEffect(() => {
    fetchJSON<typeof rows>('/data/proformas.json').then(setRows).catch(() => setRows([]))
  }, [])
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Proformas</h1>
        <Link to="/proformas/nueva" className="bg-[--color-accent] text-black px-3 py-2 rounded">+ Nueva</Link>
      </div>
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              <th className="text-left p-2">N° Proforma</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Estado entrega</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => (window.location.href = `${import.meta.env.BASE_URL}proformas/${p.id}`)}>
                <td className="p-2">{p.n}</td>
                <td className="p-2">{p.cliente}</td>
                <td className="p-2">{p.entrega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProformaDetailPage() {
  const id = Number(window.location.pathname.split('/').pop())
  const [proforma, setProforma] = useState<{ id: number; n: string; cliente: string; fecha: string; entrega: string } | null>(null)
  const [rows, setRows] = useState<Array<{ codigo: string; descripcion: string; cantidad: number; precio: number }>>([])
  useEffect(() => {
    fetchJSON<Array<{ id: number; n: string; cliente: string; fecha: string; entrega: string }>>('/data/proformas.json').then((list) => setProforma(list.find((p) => p.id === id) || null))
    fetchJSON<Array<{ proformaId: number; items: Array<{ codigo: string; descripcion: string; cantidad: number; precio: number }> }>>('/data/productos.json').then((all) => setRows(all.find((x) => x.proformaId === id)?.items || []))
  }, [id])
  const total = useMemo(() => rows.reduce((s, r) => s + r.cantidad * r.precio, 0), [rows])
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{proforma?.n}</h1>
          <p className="text-sm opacity-80">Cliente: {proforma?.cliente} · Fecha: {proforma?.fecha}</p>
          <p className="text-sm">Entrega: {proforma?.entrega}</p>
        </div>
        <button onClick={() => console.log('Generar/Actualizar PDF', proforma)} className="bg-[--color-primary] text-white px-3 py-2 rounded">Generar/Actualizar PDF</button>
      </div>
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-right p-2">Cantidad</th>
              <th className="text-right p-2">Precio</th>
              <th className="text-right p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.codigo}>
                <td className="p-2">{r.codigo}</td>
                <td className="p-2">{r.descripcion}</td>
                <td className="p-2 text-right">{r.cantidad}</td>
                <td className="p-2 text-right">{r.precio.toFixed(2)}</td>
                <td className="p-2 text-right">{(r.cantidad * r.precio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-right font-semibold">Total: S/ {total.toFixed(2)}</div>
    </div>
  )
}

function NewProformaPage() {
  const [usarClienteExistente, setUsarClienteExistente] = useState(true)
  const [productos, setProductos] = useState<Array<{ codigo: string; descripcion: string; cantidad: number; precio: number }>>([
    { codigo: '', descripcion: '', cantidad: 1, precio: 0 },
  ])
  const addRow = () => setProductos((p) => [...p, { codigo: '', descripcion: '', cantidad: 1, precio: 0 }])
  const updateRow = (i: number, field: string, value: string) => {
    setProductos((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: field === 'cantidad' || field === 'precio' ? Number(value) : value } : r)))
  }
  const onSave = () => {
    console.log('Guardar proforma (mock)', { usarClienteExistente, productos })
    alert('Proforma guardada (mock)')
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Nueva Proforma</h1>
      <div className="flex gap-2">
        <button className={`px-3 py-2 rounded border ${usarClienteExistente ? 'bg-[--color-accent]' : ''}`} onClick={() => setUsarClienteExistente(true)}>Usar cliente por documento</button>
        <button className={`px-3 py-2 rounded border ${!usarClienteExistente ? 'bg-[--color-accent]' : ''}`} onClick={() => setUsarClienteExistente(false)}>Ingresar cliente manual</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" type="date" placeholder="Fecha registro" />
        <input className="border rounded px-3 py-2" type="date" placeholder="Fecha entrega" />
        <select className="border rounded px-3 py-2">
          <option>SI</option>
          <option>NO</option>
          <option>REPROGRAMADO</option>
          <option>CANCELADO</option>
        </select>
      </div>
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-right p-2">Cantidad</th>
              <th className="text-right p-2">Precio</th>
              <th className="text-right p-2">Subtotal</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((r, i) => (
              <tr key={i}>
                <td className="p-2"><input className="w-full border rounded px-2 py-1" value={r.codigo} onChange={(e) => updateRow(i, 'codigo', e.target.value)} /></td>
                <td className="p-2"><input className="w-full border rounded px-2 py-1" value={r.descripcion} onChange={(e) => updateRow(i, 'descripcion', e.target.value)} /></td>
                <td className="p-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" type="number" value={r.cantidad} onChange={(e) => updateRow(i, 'cantidad', e.target.value)} /></td>
                <td className="p-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" type="number" step="0.01" value={r.precio} onChange={(e) => updateRow(i, 'precio', e.target.value)} /></td>
                <td className="p-2 text-right">{(r.cantidad * r.precio).toFixed(2)}</td>
                <td className="p-2 text-right"><button className="px-2 py-1 border rounded" onClick={() => setProductos((rows) => rows.filter((_, idx) => idx !== i))}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={addRow}>Agregar producto</button>
        <button className="px-3 py-2 bg-[--color-primary] text-white rounded" onClick={onSave}>Guardar</button>
      </div>
    </div>
  )
}

function PedidosPage() {
  const [pedidos, setPedidos] = useState<Array<{ id: number; n: string; entrega: string; empaquetacion: string }>>([])
  useEffect(() => {
    fetchJSON<typeof pedidos>('/data/pedidos.json').then(setPedidos).catch(() => setPedidos([]))
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Pedidos de Proformas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.map((p) => (
          <div key={p.id} className="border rounded p-4 bg-white dark:bg-black">
            <div className="font-semibold">{p.n}</div>
            <div className="text-sm">Entrega: {p.entrega}</div>
            <div className="text-sm">Empaquetación: {p.empaquetacion}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/proformas" element={<Guard><ProformasListPage /></Guard>} />
          <Route path="/proformas/nueva" element={<Guard><NewProformaPage /></Guard>} />
          <Route path="/proformas/:id" element={<Guard><ProformaDetailPage /></Guard>} />
          <Route path="/pedidos" element={<Guard><PedidosPage /></Guard>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
