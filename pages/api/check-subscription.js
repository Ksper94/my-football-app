// pages/api/check-subscription.js
import { supabaseService } from '../../utils/supabaseService';

export default async function handler(req, res) {
  const { user_id } = req.body;

  const { data: sub, error } = await supabaseService
    .from('subscriptions')
    .select('valid_until')
    .eq('user_id', user_id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const now = new Date();
  const valid = sub && new Date(sub.valid_until) > now;

  return res.status(200).json({ valid });
}
