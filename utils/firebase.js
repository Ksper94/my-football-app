import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// On peut importer getAnalytics, mais uniquement utiliser côté client
// import { getAnalytics } from "firebase/analytics"; 

// Configuration Firebase que tu as fournie
const firebaseConfig = {
  apiKey: "AIzaSyD1e4GfJsXaN03ulY-OXoLsDyWMUsjUrzU",
  authDomain: "my-football-ce0f8.firebaseapp.com",
  projectId: "my-football-ce0f8",
  storageBucket: "my-football-ce0f8.firebasestorage.app",
  messagingSenderId: "748989742037",
  appId: "1:748989742037:web:dbc89e7a894bbe24305b5c",
  measurementId: "G-N5Q4RNVNGR"
};

// Initialisation de l'app Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification Firebase
export const auth = getAuth(app);

// Initialisation de Firestore
export const db = getFirestore(app);

// Pour Analytics, comme ça ne fonctionne que côté client, on peut le charger conditionnellement
// si vraiment nécessaire, par exemple :
/*
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}
*/
