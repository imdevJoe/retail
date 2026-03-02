import { NextResponse } from 'next/server';
import SaleService from '@/services/sale.service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const sale = await SaleService.getSaleById(id);
    if (!sale) return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}
