const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

export async function createCheckout(userEmail, domainName) {
    try {
        const response = await fetch(`${LEMON_SQUEEZY_API_URL}/checkouts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        custom_price: 499, // $4.99 in cents
                        checkout_options: {
                            button_color: "#2563eb" // matches our theme blue
                        },
                        checkout_data: {
                            email: userEmail,
                            custom: {
                                domain_name: domainName
                            }
                        }
                    },
                    relationships: {
                        store: {
                            data: {
                                type: "stores",
                                id: process.env.LEMON_SQUEEZY_STORE_ID
                            }
                        },
                        variant: {
                            data: {
                                type: "variants",
                                id: process.env.LEMON_SQUEEZY_VARIANT_ID
                            }
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('LemonSqueezy API Error:', errorData);
            throw new Error(errorData.errors?.[0]?.detail || 'Failed to create checkout');
        }

        const data = await response.json();

        if (!data?.data?.attributes?.url) {
            console.error('Unexpected LemonSqueezy response:', data);
            throw new Error('Invalid checkout URL received');
        }

        return data.data.attributes.url;
    } catch (error) {
        console.error('Error in createCheckout:', error);
        throw error;
    }
} 