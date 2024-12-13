// pages/api/check-subscription.js
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth'; 
// Pour valider le token JWT Firebase côté serveur, installe firebase-admin:
// npm install firebase-admin
import { initializeApp, applicationDefault } from 'firebase-admin/app';

if (!global.firebaseAdminApp) {
  global.firebaseAdminApp = initializeApp({ credential: applicationDefault() });
}

const adminAuth = getAuth(global.firebaseAdminApp);

export default async function handler(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  // Vérifier le token JWT Firebase côté serveur
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userEmail = decoded.email;

  // Récupérer l'abonnement Firestore
  const docRef = doc(db, "subscriptions", userEmail);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return res.status(200).json({ valid: false });
  }

  const data = docSnap.data();
  const now = new Date();
  const valid = data.valid_until.toDate() > now;

  return res.status(200).json({ valid });
}
