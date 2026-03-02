import { NextResponse } from 'next/server';
import DebtService from '@/services/debt.service';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const debts = await DebtService.listDebts();
    return NextResponse.json(debts);
  } catch (error) {
    console.error('Error listing debts:', error);
    return NextResponse.json({ error: 'Failed to list debts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const debt = await DebtService.createDebt(body);
    return NextResponse.json(debt, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating debt:', error);
    return NextResponse.json({ error: 'Failed to create debt' }, { status: 500 });
  }
}
