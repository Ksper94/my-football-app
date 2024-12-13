import { supabaseService } from '../../utils/supabaseService';

export default async function handler(req, res) {
  const { data: authUser, error: authError } = await supabaseService.auth.admin.createUser({
    email: 'testuser@example.com',
    email_confirm: true,
  });

  if (authError) {
    console.error("Erreur lors de la création utilisateur (test-user):", authError);
    return res.status(500).json({ error: authError.message });
  }

  console.log("Utilisateur créé (test-user):", authUser);
  return res.status(200).json({ user: authUser });
}
