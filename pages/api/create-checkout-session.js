// pages/api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { priceId, uid } = req.body;
  if (!priceId || !uid) {
    return res.status(400).json({ error: "Missing priceId or uid" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      client_reference_id: uid, // On associe le uid de l'utilisateur
      payment_method_types: ['card']
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Erreur création session Stripe:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
