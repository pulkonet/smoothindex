import { getDomainSubscription, getUserByEmail } from '@/utils/db';
import { cookies } from 'next/headers';

export async function GET(request) {
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (!session?.value) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Parse the session cookie which contains user info
        const sessionData = JSON.parse(session.value);
        const user = await getUserByEmail(sessionData.email);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const searchParams = request.nextUrl.searchParams;
        const domain = searchParams.get('domain');

        if (!domain) {
            return new Response(JSON.stringify({ error: 'Domain is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const subscription = await getDomainSubscription(domain);
        return new Response(JSON.stringify({
            isSubscribed: !!subscription && subscription.status === 'active',
            subscription
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error checking subscription status:', error);
        return new Response(JSON.stringify({ error: 'Failed to check subscription status' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 