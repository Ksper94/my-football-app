// pages/api/webhooks/stripe.js
import { supabaseService } from '../../../utils/supabaseService';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("Webhook Stripe reçu");
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Événement Stripe décodé avec succès:", event.type);
  } catch (err) {
    console.error("Erreur de vérification de la signature du webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    console.log("Événement checkout.session.completed détecté");
    const session = event.data.object;

    // Essayer customer_details d’abord, sinon fallback sur customer.email
    let customerEmail = session.customer_details?.email;
    if (!customerEmail && session.customer?.email) {
      customerEmail = session.customer.email;
    }

    console.log("Email du client:", customerEmail, "Subscription ID:", session.subscription);

    if (!customerEmail) {
      console.error("Impossible de récupérer l'email du client.");
      return res.status(400).json({ error: 'No customer email found' });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const current_period_end = subscription.current_period_end;
      console.log("current_period_end (timestamp):", current_period_end);

      const { data: authUser, error: authError } = await supabaseService.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
      });

      if (authError) {
        console.error("Erreur lors de la création de l'utilisateur:", authError);
        return res.status(500).json({ error: 'User creation failed' });
      }

      console.log("Utilisateur créé avec succès:", authUser);

      const { data: subData, error: subError } = await supabaseService
        .from('subscriptions')
        .insert({
          user_id: authUser.user.id,
          subscription_id: session.subscription,
          valid_until: new Date(current_period_end * 1000)
        });

      if (subError) {
        console.error("Erreur lors de l'insertion de l'abonnement:", subError);
        return res.status(500).json({ error: 'Subscription insert failed' });
      }

      console.log("Abonnement inséré avec succès:", subData);

      return res.status(200).json({ received: true });
    } catch (catchErr) {
      console.error("Erreur inattendue dans le webhook:", catchErr);
      return res.status(500).json({ error: 'Unexpected error in webhook' });
    }
  } else {
    console.log("Événement non géré:", event.type);
    return res.status(200).json({ received: true });
  }
}
