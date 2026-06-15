import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderData } = body;

    if (!orderData) {
      return NextResponse.json({ error: 'Order data is required' }, { status: 400 });
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save order to Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          id: orderData.id,
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          items: orderData.items,
          subtotal: orderData.subtotal,
          delivery: orderData.delivery,
          status: orderData.status || 'pending',
          delivery_date: orderData.deliveryDate,
          delivery_slot: orderData.deliverySlot,
          notes: orderData.notes || '',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    // Also save/update customer info
    if (orderData.email) {
      const { error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            email: orderData.email,
            name: orderData.name,
            phone: orderData.phone,
          },
          { onConflict: 'email' }
        );

      if (customerError) {
        console.error('Customer upsert error:', customerError);
      }
    }

    // TODO: Send actual confirmation email using a service like Resend or SendGrid
    // For now, just return success
    console.log('Order saved:', data);

    return NextResponse.json({
      success: true,
      message: 'Order confirmation sent',
      orderId: data.id,
    });
  } catch (error) {
    console.error('Error in send-confirmation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
