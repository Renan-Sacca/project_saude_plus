export async function apiGet<T = any>(url: string) {
  const r = await fetch(`/api${url}`, { credentials: 'include' })
  if (!r.ok) throw new Error(await r.text())
  return (await r.json()) as T
}

export async function apiPost<T = any>(url: string, body?: any) {
  const r = await fetch(`/api${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!r.ok) throw new Error(await r.text())
  return (await r.json()) as T
}
