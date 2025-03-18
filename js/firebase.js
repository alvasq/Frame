import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDzh7xcrhiQ3Bs-KfooM_TLjP2pCWr-0xE",
    authDomain: "controlframe-35d38.firebaseapp.com",
    projectId: "controlframe-35d38",
    storageBucket: "controlframe-35d38.firebasestorage.app",
    messagingSenderId: "831744000341",
    appId: "1:831744000341:web:46a4325016bbe4a20eafdc",
    measurementId: "G-STPEY5NXYD"
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// Exporta las funciones necesarias
export { auth, createUserWithEmailAndPassword, db, signInWithEmailAndPassword };

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
