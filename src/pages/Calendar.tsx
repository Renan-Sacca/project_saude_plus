import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '@/api'

// Converte "YYYY-MM-DDTHH:MM" (datetime-local) para RFC3339 com offset local
function toRFC3339WithOffset(local: string) {
  // Adiciona :00 segundos, cria Date e extrai offset real do navegador
  const d = new Date(local + ':00')
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  const offsetMin = -d.getTimezoneOffset() // ex: -180 => -03:00
  const sign = offsetMin >= 0 ? '+' : '-'
  const absm = Math.abs(offsetMin)
  const oh = pad(Math.floor(absm / 60))
  const om = pad(absm % 60)
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}${sign}${oh}:${om}`
}

export default function CalendarPage() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [summary, setSummary] = useState('Consulta')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [createMeet, setCreateMeet] = useState(true)
  const [msg, setMsg] = useState<string>('')

  useEffect(() => {
    apiGet<{ connected: boolean }>('/calendar/status')
      .then(r => setConnected(r.connected))
      .catch(() => setConnected(false))
  }, [])

  if (connected === null) return <div className="p-6">Carregando…</div>

  if (!connected) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Google Calendar</h1>
        <p>Conecte seu calendário para criar eventos.</p>
        <a
          className="px-4 py-2 rounded-xl bg-blue-600 text-white inline-block"
          href="/api/auth/google/calendar"
        >
          Conectar Google Calendar
        </a>
      </div>
    )
  }

  const createEvent = async () => {
    setMsg('Criando evento...')
    try {
      const body = {
        summary,
        description,
        start: toRFC3339WithOffset(start),
        end: toRFC3339WithOffset(end),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
        createMeet,
      }
      const r = await apiPost<any>('/calendar/events', body)
      const htmlLink = r.htmlLink || ''
      const meet = r.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri
      setMsg(`Evento criado! ${htmlLink ? `Link: ${htmlLink}` : ''} ${meet ? `Meet: ${meet}` : ''}`)
    } catch (e: any) {
      setMsg(`Erro: ${e?.message || e}`)
    }
  }

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Criar evento</h1>

      <label className="block">
        <span className="text-sm">Título</span>
        <input className="border rounded p-2 w-full" value={summary} onChange={e => setSummary(e.target.value)} />
      </label>

      <label className="block">
        <span className="text-sm">Descrição</span>
        <textarea className="border rounded p-2 w-full" value={description} onChange={e => setDescription(e.target.value)} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm">Início</span>
          <input type="datetime-local" className="border rounded p-2 w-full" value={start} onChange={e => setStart(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm">Fim</span>
          <input type="datetime-local" className="border rounded p-2 w-full" value={end} onChange={e => setEnd(e.target.value)} />
        </label>
      </div>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={createMeet} onChange={e => setCreateMeet(e.target.checked)} />
        <span>Criar link do Google Meet</span>
      </label>

      <div className="flex gap-3">
        <button onClick={createEvent} className="px-4 py-2 rounded-xl bg-green-600 text-white">
          Criar evento
        </button>
        <a className="px-4 py-2 rounded-xl bg-gray-200" href="/api/auth/logout">Sair</a>
      </div>

      {msg && <div className="text-sm text-gray-700">{msg}</div>}
    </div>
  )
}
