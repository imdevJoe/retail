export async function listSales(): Promise<any[]> {
  const res = await fetch('/api/sales', { method: 'GET', cache: 'no-store' });

  if (!res.ok) throw new Error(`Failed to fetch sales: ${res.status}`);
  return res.json();
}

export async function createSale(payload: unknown) {
  const res = await fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create sale: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getSaleById(id: string) {
  const res = await fetch(`/api/sales/${encodeURIComponent(id)}`, { method: 'GET', cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch sale ${id}: ${res.status}`);
  return res.json();
}
