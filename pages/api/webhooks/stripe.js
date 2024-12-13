// pages/api/webhooks/stripe.js
import { supabaseService } from '../../../utils/supabaseService';
import { buffer } from 'micro';
import Stripe from 'stripe';

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
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer différents types d’événements Stripe
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details.email;
    const subscriptionId = session.subscription; // l'abonnement Stripe

    // Récupérer l'abo pour connaître la période
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // Déterminer la fin de la période actuelle
    const current_period_end = subscription.current_period_end; // timestamp UNIX

    // Logique : créer ou mettre à jour l'utilisateur dans Supabase
    // On suppose que l'email = identifiant unique
    const { data: existingUser, error: userErr } = await supabaseService
      .from('users')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (!existingUser) {
      // Créer l'utilisateur
      // Supabase Auth : On peut créer un utilisateur avec Auth API
      const { data: authUser, error: authError } = await supabaseService.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
      });

      // Ajouter les infos d'abonnement
      await supabaseService.from('subscriptions').insert({
        user_id: authUser.user.id,
        subscription_id: subscriptionId,
        valid_until: new Date(current_period_end * 1000),
      });
    } else {
      // Mettre à jour son abonnement
      await supabaseService
        .from('subscriptions')
        .upsert({
          user_id: existingUser.id,
          subscription_id: subscriptionId,
          valid_until: new Date(current_period_end * 1000),
        }, { onConflict: 'user_id' });
    }
  }

  res.status(200).json({ received: true });
}
