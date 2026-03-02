import { NextRequest, NextResponse } from 'next/server';
import StockService from '@/services/stock.service';
import { StockStatus } from '@prisma/client';
import { ZodError } from 'zod';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const stock = await StockService.getStockById(id);
    if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    return NextResponse.json(stock);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body || typeof body.status !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const status = body.status as StockStatus;
    if (!Object.values(StockStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await StockService.updateStatus(id, status);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }

    console.error('Error updating stock status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
