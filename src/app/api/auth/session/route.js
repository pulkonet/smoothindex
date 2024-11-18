import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
        return new Response(JSON.stringify({ user: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const sessionData = JSON.parse(sessionCookie.value);
        return new Response(JSON.stringify({
            user: {
                email: sessionData.email,
                name: sessionData.name,
                picture: sessionData.picture,
                id: sessionData.userId
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Session error:', error);
        return new Response(JSON.stringify({ user: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 