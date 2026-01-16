import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { subscriptions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sub = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

    if (!sub.length) {
      // No subscription = new user, they're on implicit trial
      return NextResponse.json({
        plan: 'none',
        status: 'none',
        requestCount: 0,
        requestLimit: 0,
        trialEndsAt: null,
        canUseApp: false, // Must subscribe to use
      });
    }

    const subscription = sub[0];
    const now = new Date();
    const isTrialActive = subscription.status === 'trialing' && 
                          subscription.trialEndsAt && 
                          new Date(subscription.trialEndsAt) > now;
    const isActive = subscription.status === 'active' || isTrialActive;
    const usagePercent = Math.round((subscription.requestCount / subscription.requestLimit) * 100);

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      requestCount: subscription.requestCount,
      requestLimit: subscription.requestLimit,
      usagePercent,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
      canUseApp: isActive,
      daysLeftInTrial: isTrialActive && subscription.trialEndsAt 
        ? Math.ceil((new Date(subscription.trialEndsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
