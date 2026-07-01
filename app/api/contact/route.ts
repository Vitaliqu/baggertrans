import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/booking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    // TODO: integrate with email service (Resend, Nodemailer, etc.)
    // or save to Firestore contacts collection
    console.log('[Contact Form Submission]', {
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email || 'not provided',
      messageLength: result.data.message?.length ?? 0,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Ваше повідомлення успішно отримано' },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Внутрішня помилка сервера' },
      { status: 500 },
    );
  }
}
