import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"; // Importa Firestore
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";


// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD0z_ZZHK53i5Sk5Ddi4dn-ytqZfXIrHm0",
    authDomain: "controlframe-f315b.firebaseapp.com",
    projectId: "controlframe-f315b",
    storageBucket: "controlframe-f315b.appspot.com",
    messagingSenderId: "1001869693332",
    appId: "1:1001869693332:web:aecfb621e7e73590657f81"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Inicializa Firestore

console.log("Firebase está inicializado:", app);


export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db }; // Exporta lo necesario

