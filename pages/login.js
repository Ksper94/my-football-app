import { useState } from 'react';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    // L'utilisateur est créé. Firebase Auth gère le compte.
    // Pas encore abonné, il devra payer sur /pricing.
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken();
    setSession(token);
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" />
        <button type="submit">Se connecter</button>
      </form>
      <button onClick={handleSignup}>Créer un compte</button>

      {session && (
        <div>
          <p>Token JWT : {session}</p>
          <p>Copiez ce token et utilisez-le dans Streamlit.</p>
        </div>
      )}
    </div>
  );
}
