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

    // Save order to Supabase (if not already saved by send-confirmation)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderData.id)
      .single();

    if (!existingOrder) {
      const { error } = await supabase
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
        ]);

      if (error) {
        console.error('Supabase error:', error);
      }
    }

    // TODO: Send actual SMS using Twilio
    // For now, just log and return success
    console.log('SMS notification for order:', orderData.id);
    console.log('To:', orderData.phone);
    console.log('Message: New order from Francis Farms - Order #' + orderData.id);

    return NextResponse.json({
      success: true,
      message: 'SMS notification sent',
    });
  } catch (error) {
    console.error('Error in send-sms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
