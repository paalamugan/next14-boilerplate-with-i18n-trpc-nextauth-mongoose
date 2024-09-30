import { type NextRequest, NextResponse } from 'next/server';

export const PUT = (_request: NextRequest) => {
  return NextResponse.json({ message: 'Spotlight PUT request' });
};
