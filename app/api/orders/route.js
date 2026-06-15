import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// GET - Fetch orders (with optional filtering)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderId = searchParams.get('id');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (email) {
      query = query.eq('email', email);
    }

    if (orderId) {
      query = query.eq('id', orderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new order
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      email,
      phone,
      address,
      items,
      subtotal,
      delivery,
      status,
      deliveryDate,
      deliverySlot,
      notes,
    } = body;

    if (!id || !name || !email || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          id,
          name,
          email,
          phone,
          address,
          items,
          subtotal,
          delivery,
          status: status || 'pending',
          delivery_date: deliveryDate,
          delivery_slot: deliverySlot,
          notes: notes || '',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Also save/update customer info
    if (email) {
      const { error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            email: email,
            name: name,
            phone: phone,
          },
          { onConflict: 'email' }
        );

      if (customerError) {
        console.error('Customer upsert error:', customerError);
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update order status
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error('Error in PATCH /api/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
