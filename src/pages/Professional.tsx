// src/pages/Professional.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfessional, requestAppointment } from '../api'
import type { ProfessionalDetail } from '../api'   // import só do tipo
import { useAuth } from '../context/AuthContext'

// Converte datetime-local para RFC3339 com timezone
function toRFC3339WithOffset(local: string) {
  const d = new Date(local + ':00')
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  const offsetMin = -d.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const absm = Math.abs(offsetMin)
  const oh = pad(Math.floor(absm / 60))
  const om = pad(absm % 60)
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}${sign}${oh}:${om}`
}

export default function ProfessionalPage() {
  const { id } = useParams()
  const { isAuthenticated, loginWithGoogle } = useAuth()
  const [p, setP] = useState<ProfessionalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProfessional(Number(id))
      .then(setP)
      .finally(() => setLoading(false))
  }, [id])

  const onRequest = async () => {
    if (!p || !start || !end) return
    setSending(true)
    setMsg(null)
    try {
      const starts_at = toRFC3339WithOffset(start)
      const ends_at = toRFC3339WithOffset(end)
      await requestAppointment({ professional_id: p.id, starts_at, ends_at })
      setMsg('Solicitação enviada! O profissional irá avaliar e confirmar.')
      setStart('')
      setEnd('')
    } catch (e: any) {
      setMsg(e?.message || 'Erro ao solicitar agendamento')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="p-6">Carregando…</div>
  if (!p) return <div className="p-6">Profissional não encontrado.</div>

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex gap-6">
        <img
          src={p.avatar_url || '/img/avatar-fallback.png'}
          alt={p.full_name}
          className="h-28 w-28 rounded-2xl object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {(p.profession === 'psychology'
              ? 'Psicólogo(a) '
              : 'Nutricionista ') + p.full_name}
          </h1>
          <p className="text-gray-700">
            {p.city}
            {p.state ? ` - ${p.state}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(p.modalities || []).map(m => (
              <span
                key={m}
                className="text-xs rounded-full px-2 py-1 bg-white shadow"
              >
                {m}
              </span>
            ))}
            {p.rating ? (
              <span className="text-xs">⭐ {p.rating.toFixed(1)}</span>
            ) : null}
          </div>
          <div className="mt-1 text-sm">
            {(p.price_cents / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}{' '}
            • {p.session_minutes} min
          </div>
        </div>
      </div>

      {/* Bio */}
      {p.bio && (
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">Sobre</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{p.bio}</p>
        </div>
      )}

      {/* Solicitação de agendamento */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 className="font-semibold">Solicitar horário</h2>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800">
            Faça login para solicitar um horário.{' '}
            <button className="underline" onClick={loginWithGoogle}>
              Entrar com Google
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Início</span>
            <input
              type="datetime-local"
              className="border rounded p-2 w-full"
              value={start}
              onChange={e => setStart(e.target.value)}
              disabled={!isAuthenticated}
            />
          </label>
          <label className="block">
            <span className="text-sm">Fim</span>
            <input
              type="datetime-local"
              className="border rounded p-2 w-full"
              value={end}
              onChange={e => setEnd(e.target.value)}
              disabled={!isAuthenticated}
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRequest}
            disabled={!isAuthenticated || sending || !start || !end}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60"
          >
            {sending ? 'Enviando…' : 'Solicitar agendamento'}
          </button>
          {p.whatsapp && (
            <a
              className="px-4 py-2 rounded-xl bg-green-600 text-white"
              target="_blank"
              rel="noreferrer"
              href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`}
            >
              Falar no WhatsApp
            </a>
          )}
        </div>

        {msg && <div className="text-sm text-gray-700">{msg}</div>}
      </div>
    </div>
  )
}
