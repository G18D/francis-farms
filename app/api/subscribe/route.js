import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, type } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === 'newsletter') {
      // Save to newsletter subscribers
      const { data, error } = await supabase
        .from('subscribers')
        .insert([
          {
            email: email,
            name: name || null,
          },
        ])
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
        }
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
        data,
      });
    } else if (type === 'subscription') {
      // Handle subscription box signup
      const { email, name, phone, address, boxId, frequency } = body;

      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            email: email,
            name: name,
            phone: phone,
            address: address,
            box_id: boxId,
            frequency: frequency || 'weekly',
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription created successfully',
        data,
      });
    }

    return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
  } catch (error) {
    console.error('Error in subscribe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
