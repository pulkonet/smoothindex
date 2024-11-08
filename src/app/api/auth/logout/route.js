import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
    cookies().delete('google_access_token');
    cookies().delete('google_refresh_token');
    cookies().delete('user_profile');

    return NextResponse.json({ success: true });
} 