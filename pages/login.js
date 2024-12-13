import { useState } from 'react';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      setMessage(`Compte créé pour ${userCred.user.email}`);
    } catch (err) {
      console.error("Erreur lors de la création du compte:", err);
      setMessage(`Erreur: ${err.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      setSession(token);
      setMessage(`Connecté en tant que ${userCred.user.email}`);
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      setMessage(`Erreur: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Connexion / Création de compte</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
      <button onClick={handleSignup} style={{ marginTop: '10px' }}>Créer un compte</button>
      {message && <p>{message}</p>}
      {session && (
        <div>
          <p>Token JWT : {session}</p>
          <p>Copiez ce token pour Streamlit.</p>
        </div>
      )}
    </div>
  );
}
