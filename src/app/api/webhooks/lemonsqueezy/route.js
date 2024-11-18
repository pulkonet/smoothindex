import { createDomainSubscription, updateSubscriptionStatus } from '@/utils/db';
import { verifyLemonSqueezyWebhook } from '@/utils/lemonsqueezy';

export async function POST(request) {
    const signature = request.headers.get('x-signature');
    const rawBody = await request.text();

    if (!verifyLemonSqueezyWebhook(rawBody, signature)) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const event = JSON.parse(rawBody);
    const { event_name, data } = event;

    try {
        switch (event_name) {
            case 'subscription_created':
                await createDomainSubscription(
                    data.attributes.user_id,
                    data.attributes.custom_data.domain_name,
                    data.attributes.subscription_id,
                    data.attributes.customer_id
                );
                break;

            case 'subscription_updated':
                await updateSubscriptionStatus(
                    data.attributes.subscription_id,
                    data.attributes.status
                );
                break;
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 