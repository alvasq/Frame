// Importa las funciones necesarias desde Firebase
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";


// Inicializa Firebase (asegúrate de que esto se ejecute antes de usar Firebase)
const auth = getAuth(); // Obtenemos la instancia de autenticación

// Función para verificar y renovar la autenticación
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Si el usuario está autenticado, renueva el token
            user.getIdToken(true).then(function (idToken) {
                console.log("Token renovado: ", idToken);
                localStorage.setItem("tokenFrame", idToken); // Guarda el token renovado
            }).catch(function (error) {
                console.error("Error al renovar el token: ", error);
            });
        } else {
            // Si no hay usuario autenticado, redirige al inicio de sesión
            window.location.href = "index.html";
        }
    });
}

// Ejecutar la validación al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    checkAuth();
});

// Definir el módulo de AngularJS
var Frame = angular.module('fApp', []);

// Definir el controlador de AngularJS
Frame.controller('fControler', function ($scope) {
    // Función para manejar la opción de ingresar un usuario
    $scope.ingresarUsuario = function () {
        window.location.href="usuario.html"
        // Lógica para ingresar usuario (puedes agregar más detalles aquí)
    };

    // Función para manejar la opción de ingresar un aporte
    $scope.ingresarAporte = function () {
        alert("Ingresar Aporte");
        // Lógica para ingresar un aporte (puedes agregar más detalles aquí)
    };

    // Función para generar el reporte de usuarios
    $scope.reporteUsuario = function () {
        alert("Generar Reporte de Usuario");
        // Lógica para generar reporte de usuario (puedes agregar más detalles aquí)
    };

    // Función para generar el reporte de aportes
    $scope.reporteAportes = function () {
        alert("Generar Reporte de Aportes");
        // Lógica para generar reporte de aportes (puedes agregar más detalles aquí)
    };
});
