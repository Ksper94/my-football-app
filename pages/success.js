// pages/success.js
import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold">Paiement Réussi !</h1>
      <p className="mb-4">Votre compte est en cours de création ou de mise à jour.</p>
      <Link href="/">
        <a className="underline text-blue-600">Retour à l'accueil</a>
      </Link>
    </div>
  )
}
