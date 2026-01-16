import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { stripe, PLANS, PlanType } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const { plan, annual } = await request.json() as { plan: PlanType; annual?: boolean };

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Check if user already has a subscription
    const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    
    let customerId: string;
    
    if (existing.length > 0 && existing[0].stripeCustomerId) {
      customerId = existing[0].stripeCustomerId;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const priceId = annual ? PLANS[plan].annual : PLANS[plan].monthly;
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId,
          plan,
        },
      },
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
