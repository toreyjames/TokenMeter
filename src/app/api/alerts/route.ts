import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { alerts } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// GET - Fetch user's alerts
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userAlerts = await db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(alerts.createdAt);

    return NextResponse.json(userAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new alert
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { thresholdCents, period, email, provider } = body;

    if (!thresholdCents || !email) {
      return NextResponse.json(
        { error: 'Threshold and email are required' },
        { status: 400 }
      );
    }

    const [newAlert] = await db
      .insert(alerts)
      .values({
        userId,
        provider: provider || null, // null means all providers
        thresholdCents: parseInt(thresholdCents),
        period: period || 'daily',
        email,
        enabled: true,
      })
      .returning();

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update an alert
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, thresholdCents, period, email, enabled, provider } = body;

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const updateData: Partial<typeof alerts.$inferInsert> = {};
    if (thresholdCents !== undefined) updateData.thresholdCents = parseInt(thresholdCents);
    if (period !== undefined) updateData.period = period;
    if (email !== undefined) updateData.email = email;
    if (enabled !== undefined) updateData.enabled = enabled;
    if (provider !== undefined) updateData.provider = provider || null;

    const [updatedAlert] = await db
      .update(alerts)
      .set(updateData)
      .where(and(eq(alerts.id, id), eq(alerts.userId, userId)))
      .returning();

    if (!updatedAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an alert
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const [deletedAlert] = await db
      .delete(alerts)
      .where(and(eq(alerts.id, id), eq(alerts.userId, userId)))
      .returning();

    if (!deletedAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
