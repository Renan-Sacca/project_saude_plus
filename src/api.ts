// src/api.ts
//const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api'
const API_BASE = import.meta.env.VITE_API_BASE || '/api'

type FetchOpts = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  withCredentials?: boolean
}

async function request<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const { method = 'GET', body, headers = {}, withCredentials = true } = opts
  const res = await fetch(url, {
    method,
    credentials: withCredentials ? 'include' : 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  let data: any = null
  try { data = await res.json() } catch { /* ignore */ }

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data as T
}

export const apiGet = <T,>(path: string, withCredentials = true) =>
  request<T>(path, { withCredentials })

export const apiPost = <T,>(path: string, body: any, withCredentials = true) =>
  request<T>(path, { method: 'POST', body, withCredentials })

export type ProfessionalCard = {
  id: number
  full_name: string
  profession: 'psychology' | 'nutrition'
  register_code?: string
  city?: string
  state?: string
  avatar_url?: string
  whatsapp?: string
  price_cents: number
  session_minutes: number
  modalities: string[]
  rating?: number | null
}

export type ProfessionalDetail = ProfessionalCard & { bio?: string }

export async function listProfessionals(params: {
  profession?: 'psychology' | 'nutrition'
  city?: string
  modality?: 'online' | 'presencial'
  price_min?: number
  price_max?: number
  q?: string
}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  })
  const query = qs.toString()
  const path = `/professionals${query ? `?${query}` : ''}`
  return apiGet<{ items: ProfessionalCard[] }>(path)
}

export async function getProfessional(id: number) {
  return apiGet<ProfessionalDetail>(`/professionals/${id}`)
}

export async function requestAppointment(input: {
  professional_id: number
  starts_at: string
  ends_at: string
}) {
  return apiPost<{ id: number }>(`/appointments`, {
    ...input,
    status: 'pending',
  })
}

// Auth helpers (para padronizar /me no AuthContext)
export type MeResponse = { email: string } | { error: string }
export async function getMe() {
  return apiGet<MeResponse>(`/me`)
}
