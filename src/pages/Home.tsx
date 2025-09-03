// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listProfessionals } from '../api'
import type { ProfessionalCard } from '../api'   // <-- type-only import

export default function Home() {
  const { loginWithGoogle, isAuthenticated, user } = useAuth()
  const [items, setItems] = useState<ProfessionalCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    profession: 'psychology',
    city: '',
    modality: '',
    q: '',
  })

  useEffect(() => {
    setLoading(true)
    listProfessionals({
      profession: filters.profession as any,
      city: filters.city || undefined,
      modality: (filters.modality as any) || undefined,
      q: filters.q || undefined,
    })
      .then(r => setItems(r.items))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profissionais</h1>
        {!isAuthenticated ? (
          <div className="flex flex-wrap gap-3">
            <Link className="px-4 py-2 rounded-xl bg-blue-600 text-white" to="/login">
              Entrar com Email/Senha
            </Link>
            <button
              onClick={loginWithGoogle}
              className="px-4 py-2 rounded-xl bg-red-600 text-white"
            >
              Entrar com Google
            </button>
          </div>
        ) : (
          <p className="text-gray-700">
            Bem-vindo, <span className="font-semibold">{user?.email}</span>!
          </p>
        )}
      </div>

      {/* Filtros */}
      <div className="grid md:grid-cols-5 gap-3 bg-white rounded-2xl shadow p-4">
        <select
          className="rounded-xl border p-2"
          value={filters.profession}
          onChange={e => setFilters(f => ({ ...f, profession: e.target.value }))}
        >
          <option value="psychology">Psicologia</option>
          <option value="nutrition">Nutrição</option>
        </select>
        <input
          className="rounded-xl border p-2"
          placeholder="Cidade"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
        />
        <select
          className="rounded-xl border p-2"
          value={filters.modality}
          onChange={e => setFilters(f => ({ ...f, modality: e.target.value }))}
        >
          <option value="">Modalidade</option>
          <option value="online">Online</option>
          <option value="presencial">Presencial</option>
        </select>
        <input
          className="rounded-xl border p-2 md:col-span-2"
          placeholder="Buscar por nome/descrição…"
          value={filters.q}
          onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="p-6 text-gray-600">Carregando…</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-gray-600">Nenhum profissional encontrado.</div>
      ) : (
        <div className="grid gap-4">
          {items.map(p => (
            <article
              key={p.id}
              className="bg-amber-200/70 rounded-2xl shadow p-4 flex gap-4 items-center"
            >
              <img
                src={p.avatar_url || '/img/avatar-fallback.png'}
                alt={p.full_name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-sky-900">
                  {(p.profession === 'psychology' ? 'Psicólogo(a) ' : 'Nutricionista ') + p.full_name}
                </h3>
                <p className="text-sm text-sky-800/80">
                  {p.city}{p.state ? ` - ${p.state}` : ''}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(p.modalities || []).map(m => (
                    <span key={m} className="text-xs rounded-full px-2 py-1 bg-white shadow">{m}</span>
                  ))}
                  {p.rating ? <span className="text-xs">⭐ {p.rating.toFixed(1)}</span> : null}
                </div>
                <div className="mt-1 text-sm text-sky-950">
                  {(p.price_cents/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} • {p.session_minutes} min
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {p.whatsapp && (
                  <a
                    href={`https://wa.me/${p.whatsapp.replace(/\D/g,'')}`}
                    target="_blank" rel="noreferrer"
                    className="rounded-2xl px-4 py-2 bg-green-600 text-white font-medium shadow hover:opacity-90"
                  >
                    WhatsApp
                  </a>
                )}
                <Link
                  to={`/p/${p.id}`}
                  className="rounded-2xl px-4 py-2 bg-rose-600 text-white font-medium shadow hover:opacity-90 text-center"
                >
                  Saiba Mais
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
