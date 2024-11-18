import { getUserByEmail } from '@/utils/db';
import { createCheckout } from '@/utils/lemonsqueezy';
import { cookies } from 'next/headers';

export async function POST(request) {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const sessionData = JSON.parse(sessionCookie.value);
        const user = await getUserByEmail(sessionData.email);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { domainName } = await request.json();

        const checkoutUrl = await createCheckout(user.email, domainName);
        return new Response(JSON.stringify({ checkoutUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating checkout:', error);
        return new Response(JSON.stringify({ error: 'Failed to create checkout' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 