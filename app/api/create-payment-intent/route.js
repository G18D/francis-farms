import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount } = await req.json();
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
