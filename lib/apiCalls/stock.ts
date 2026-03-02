export async function listStocks(): Promise<any[]> {
  const res = await fetch('/api/stocks', {
    method: 'GET',
    // run on server by default; don't cache to get fresh data in SSR
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stocks: ${res.status}`);
  }

  return res.json();
}

export async function createStock(payload: unknown) {
  const res = await fetch('api/stocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create stock: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getStockById(id: string) {
  const res = await fetch(`api/stocks/${encodeURIComponent(id)}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stock ${id}: ${res.status}`);
  }

  return res.json();
}

export async function updateStockStatus(id: string, status: string) {
  const res = await fetch(`api/stocks/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update stock ${id}: ${res.status} ${text}`);
  }

  return res.json();
}
