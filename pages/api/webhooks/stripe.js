// pages/api/webhooks/stripe.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import { db } from '../../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.client_reference_id;

    if (!uid) {
      console.error("No uid found in client_reference_id");
      return res.status(400).json({ error: 'No uid found' });
    }

    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const current_period_end = subscription.current_period_end;

    // Mettre à jour Firestore avec l'abonnement
    await setDoc(doc(db, "subscriptions", uid), {
      subscription_id: subscriptionId,
      valid_until: new Date(current_period_end * 1000)
    });

    console.log(`Abonnement mis à jour pour l'utilisateur UID: ${uid}`);
  }

  res.status(200).json({ received: true });
}
