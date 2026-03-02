export async function listDebts(): Promise<any[]> {
  const res = await fetch('/api/debts', { method: 'GET', cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch debts: ${res.status}`);
  return res.json();
}

export async function createDebt(payload: unknown) {
  const res = await fetch('/api/debts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create debt: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getDebtById(id: string) {
  const res = await fetch(`/api/debts/${encodeURIComponent(id)}`, { method: 'GET', cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch debt ${id}: ${res.status}`);
  return res.json();
}
