// pages/login.js
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      setSession(data.session);
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      {!session ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2" />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2" />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">Se connecter</button>
        </form>
      ) : (
        <div>
          <p>Connecté avec succès !</p>
          <p>Token: {session.access_token}</p>
          <p>Transmettez ce token à l'application Streamlit pour accéder.</p>
        </div>
      )}
    </div>
  );
}
