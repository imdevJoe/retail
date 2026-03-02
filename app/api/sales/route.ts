import { NextResponse } from 'next/server';
import SaleService from '@/services/sale.service';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const sales = await SaleService.listSales();
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error listing sales:', error);
    return NextResponse.json({ error: 'Failed to list sales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sale = await SaleService.createSale(body);
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
