import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
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
const db = getDatabase(app);

console.log("Firebase inicializado:", app);

// Exporta las funciones necesarias
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };

// Verificar y renovar autenticación
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            user.getIdToken(true).then(idToken => {
                localStorage.setItem("tokenFrame", idToken);
            }).catch(error => {
                console.error("Error al renovar el token: ", error);
            });
        } else {
            window.location.href = "index.html";
        }
    });
}

// Ejecutar la validación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const validPaths = ["/Frame/", "http://localhost:1234/"];
    
    // Verificar solo si la ruta actual no es válida
    if (!validPaths.includes(window.location.pathname) && !validPaths.includes(window.location.href)) {
        if (!localStorage.getItem("authChecked")) {
            checkAuth();
            localStorage.setItem("authChecked", "true"); // Marcar que se ha verificado
        }
    }
});
