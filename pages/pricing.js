// pages/pricing.js
import { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Pricing() {
  const [user, setUser] = useState(null);
  const priceMonthlyId = "price_xxx_month";   // Remplace par tes price_id
  const priceQuarterlyId = "price_xxx_quarter";
  const priceYearlyId = "price_xxx_year";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckout = async (priceId) => {
    if (!user) {
      alert("Veuillez vous connecter avant de vous abonner.");
      return;
    }

    const token = await user.getIdToken(); 
    // On envoie le token juste pour sécuriser, mais si le backend n'en a pas besoin, on peut l'omettre.
    // Surtout on envoie le uid dans body.

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, uid: user.uid }) 
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors de la création de la session de paiement");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Nos formules</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h2>Mensuel</h2>
          <p>10€ / mois</p>
          <button onClick={() => handleCheckout(price_1QUlyhHd1CTS1QCeLJfFF9Kj)}>S'abonner</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h2>Trimestriel</h2>
          <p>27€ / 3 mois</p>
          <button onClick={() => handleCheckout(price_1QUlzrHd1CTS1QCebhWYJdYv)}>S'abonner</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h2>Annuel</h2>
          <p>100€ / an</p>
          <button onClick={() => handleCheckout(price_1QUm0YHd1CTS1QCeSrmFSzI7)}>S'abonner</button>
        </div>
      </div>
      {!user && <p>Veuillez vous connecter pour vous abonner.</p>}
      {user && <p>Connecté en tant que {user.email}</p>}
    </div>
  );
}
