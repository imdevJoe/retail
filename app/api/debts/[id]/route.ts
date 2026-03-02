import { NextResponse } from 'next/server';
import DebtService from '@/services/debt.service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const debt = await DebtService.getDebtById(id);
    if (!debt) return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
    return NextResponse.json(debt);
  } catch (error) {
    console.error('Error fetching debt:', error);
    return NextResponse.json({ error: 'Failed to fetch debt' }, { status: 500 });
  }
}
