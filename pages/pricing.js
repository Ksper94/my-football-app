// pages/pricing.js
import React from 'react';

export default function Pricing() {
  const handleCheckout = async (priceId) => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nos formules</h1>
      <div className="flex justify-center gap-8">
        <div className="border p-4 text-center">
          <h2 className="font-bold text-xl">Mensuel</h2>
          <p>10€/mois</p>
          <button onClick={() => handleCheckout('price_1QUlyhHd1CTS1QCeLJfFF9Kj')} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">S'abonner</button>
        </div>
        <div className="border p-4 text-center">
          <h2 className="font-bold text-xl">Trimestriel</h2>
          <p>27€ / 3 mois</p>
          <button onClick={() => handleCheckout('price_1QUlzrHd1CTS1QCebhWYJdYv')} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">S'abonner</button>
        </div>
        <div className="border p-4 text-center">
          <h2 className="font-bold text-xl">Annuel</h2>
          <p>100€/an</p>
          <button onClick={() => handleCheckout('price_1QUm0YHd1CTS1QCeSrmFSzI7')} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">S'abonner</button>
        </div>
      </div>
    </div>
  );
}
