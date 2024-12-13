// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold mb-4">Analyse Probabilités Matches de Football</h1>
      <p className="mb-8 max-w-md text-center">Notre outil utilise la météo, l'historique des équipes, le classement, la forme des joueurs et plus encore, pour vous fournir une probabilité de résultat précise.</p>
      <Link href="/pricing" className="bg-green-600 text-white px-6 py-3 rounded-md">
      Voir nos formules d'abonnement
      </Link>

    </div>
  );
}
