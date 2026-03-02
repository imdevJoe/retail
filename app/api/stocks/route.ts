import { NextRequest, NextResponse } from 'next/server';
import StockService from '@/services/stock.service';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const stocks = await StockService.listActiveStocks();
    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error listing stocks:', error);
    return NextResponse.json({ error: 'Failed to list stocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const stock = await StockService.createStock(payload);
    return NextResponse.json(stock, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating stock:', error);
    return NextResponse.json({ error: 'Failed to create stock' }, { status: 500 });
  }
}
