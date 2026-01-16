import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as 'starter' | 'pro';
        
        if (!userId) break;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        await db.insert(subscriptions).values({
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          plan: plan || 'starter',
          status: subscription.status === 'trialing' ? 'trialing' : 'active',
          trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          requestLimit: PLANS[plan]?.requestLimit || 25000,
          requestCount: 0,
        }).onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            plan: plan || 'starter',
            status: subscription.status === 'trialing' ? 'trialing' : 'active',
            trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            requestLimit: PLANS[plan]?.requestLimit || 25000,
            updatedAt: new Date(),
          },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (!userId) break;

        const plan = subscription.metadata?.plan as 'starter' | 'pro' || 'starter';

        await db.update(subscriptions)
          .set({
            status: subscription.status === 'trialing' ? 'trialing' : 
                   subscription.status === 'active' ? 'active' : 
                   subscription.status === 'past_due' ? 'past_due' : 'cancelled',
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            requestLimit: PLANS[plan]?.requestLimit || 25000,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (!userId) break;

        await db.update(subscriptions)
          .set({
            status: 'cancelled',
            plan: 'cancelled',
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));
        break;
      }

      case 'invoice.paid': {
        // Reset request count on successful payment (new billing cycle)
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await db.update(subscriptions)
          .set({
            requestCount: 0,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeCustomerId, customerId));
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
